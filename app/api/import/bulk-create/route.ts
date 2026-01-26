import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { success, fail } from "@/src/lib/response";
import { Prisma } from "@prisma/client";

type RawOption = {
  tempId?: string;
  id?: string; // legacy
  option?: string;
  label?: string;
  description?: string | null;
  price?: string | number | null;
  sku?: string | null;
  imageUrl?: string | null;
  incompatibleWith?: string | string[] | null;
};

type RawItem = {
  category?: string | null;
  options?: RawOption[] | null;
};

type RequestBody = {
  configuratorId?: string;
  items?: RawItem[];
};

type NormalizedOption = {
  tempId?: string;
  label: string;
  description?: string | null;
  price?: number | undefined;
  sku?: string | undefined;
  imageUrl?: string | null;
  incompatibleWith: string[]; // normalized to array of refs (tempId/sku/label)
};

type NormalizedItem = {
  categoryName: string;
  options: NormalizedOption[];
};

type CreatedOptionRecord = {
  tempId?: string | undefined;
  id: string;
  label: string;
  sku?: string | undefined;
  categoryName: string;
  original: NormalizedOption;
};

/* -------------------------- Utilities ---------------------------- */

const safeString = (v: any) =>
  v === null || v === undefined ? "" : String(v).trim();

function parsePrice(raw: any): number | undefined {
  if (raw === null || raw === undefined || raw === "") return undefined;
  // Parse number robustly
  const parsed = Number(String(raw).trim());
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
}

function normalizeIncompatRef(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map((x) => safeString(x)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
}

/* ------------------------ Normalization -------------------------- */

function normalizeRequest(body: RequestBody): {
  items: NormalizedItem[];
} {
  const rawItems = Array.isArray(body?.items) ? body!.items : [];

  const items: NormalizedItem[] = rawItems
    .map((it: RawItem) => {
      const categoryName = safeString(it?.category);
      const optionsArr = Array.isArray(it?.options) ? it!.options : [];
      const options: NormalizedOption[] = optionsArr.map((o: RawOption) => {
        const tempId = safeString(o?.tempId ?? o?.id) || undefined;
        const label = safeString(o?.option ?? o?.label);
        return {
          tempId,
          label,
          description: o?.description ?? null,
          price: parsePrice(o?.price),
          sku: o?.sku ? String(o.sku).trim() : undefined,
          imageUrl: o?.imageUrl ?? null,
          incompatibleWith: normalizeIncompatRef(o?.incompatibleWith),
        };
      });

      return {
        categoryName,
        options: options.filter((op) => op.label.length > 0), // drop empty labels
      };
    })
    .filter((it) => it.categoryName.length > 0 && it.options.length > 0);

  return { items };
}

/* -------------------- DB helper: ensure categories -------------------- */
/*
  Ensures each category exists (for the given configuratorId).
  Returns Map<categoryName, { id, name }>
*/
async function ensureCategories(
  tx: Prisma.TransactionClient,
  configuratorId: string,
  items: NormalizedItem[]
): Promise<Map<string, { id: string; name: string }>> {
  const map = new Map<string, { id: string; name: string }>();

  for (const it of items) {
    if (!it.categoryName) continue;

    // Try to find existing
    const existing = await tx.category.findFirst({
      where: { configuratorId, name: it.categoryName },
      select: { id: true, name: true },
    });

    if (existing) {
      map.set(it.categoryName, existing);
      continue;
    }

    // Create if missing
    const created = await tx.category.create({
      data: {
        configuratorId,
        name: it.categoryName,
        isPrimary: false,
      },
      select: { id: true, name: true },
    });

    map.set(it.categoryName, created);
  }

  return map;
}

/* -------------------- DB helper: create options -------------------- */
/*
  Creates all options (after categories exist). Returns created option records and a lookup map
  keyed by tempId / sku / lowercase label for resolving incompatibilities later.
*/
async function createOptions(
  tx: Prisma.TransactionClient,
  categoryMap: Map<string, { id: string; name: string }>,
  items: NormalizedItem[]
): Promise<{
  createdOptionsList: CreatedOptionRecord[];
  optionLookup: Map<string, { id: string; label: string; sku?: string }>;
}> {
  const optionLookup = new Map<
    string,
    { id: string; label: string; sku?: string }
  >();
  const createdOptionsList: CreatedOptionRecord[] = [];

  for (const item of items) {
    const cat = categoryMap.get(item.categoryName);
    if (!cat) continue;

    for (let i = 0; i < item.options.length; i++) {
      const o = item.options[i];

      const label = o.label.trim();
      const price = o.price !== undefined ? Number(o.price) : undefined;
      const sku = o.sku ? String(o.sku).trim() : undefined;

      const created = await tx.option.create({
        data: {
          categoryId: cat.id,
          label,
          description: o.description ?? null,
          price: price ?? 0,
          sku: sku ?? null,
          imageUrl: o.imageUrl ?? null,
          orderIndex: i,
          isActive: true,
        },
        select: { id: true, label: true, sku: true },
      });

      const rec: CreatedOptionRecord = {
        tempId: o.tempId,
        id: created.id,
        label: created.label,
        sku: created.sku ?? undefined,
        categoryName: item.categoryName,
        original: o,
      };

      createdOptionsList.push(rec);

      // register lookups
      if (rec.tempId) {
        optionLookup.set(String(rec.tempId), {
          id: rec.id,
          label: rec.label,
          sku: rec.sku,
        });
      }
      if (sku) {
        optionLookup.set(String(sku), {
          id: created.id,
          label: created.label,
          sku: created.sku ?? undefined,
        });
      }
      optionLookup.set(created.label.toLowerCase(), {
        id: created.id,
        label: created.label,
        sku: created.sku ?? undefined,
      });
    }
  }

  return { createdOptionsList, optionLookup };
}

/* -------------------- Build incompatibility rows -------------------- */

type IncompatRow = {
  optionId: string;
  incompatibleOptionId: string;
  severity?: string;
  message?: string | null;
};

function buildIncompatRows(
  createdOptionsList: CreatedOptionRecord[],
  optionLookup: Map<string, { id: string; label: string; sku?: string }>
): { rows: IncompatRow[]; warnings: string[] } {
  const rows: IncompatRow[] = [];
  const warnings: string[] = [];

  for (const created of createdOptionsList) {
    const originals = created.original;
    const refs = Array.isArray(originals.incompatibleWith)
      ? originals.incompatibleWith
      : [];

    for (const ref of refs) {
      if (!ref) continue;
      // resolve by exact key or lowercase label
      const candidate =
        optionLookup.get(ref) ?? optionLookup.get(ref.toLowerCase());
      if (!candidate) {
        warnings.push(
          `Could not resolve incompatibility reference "${ref}" for option "${created.label}" (created id: ${created.id})`
        );
        continue;
      }
      rows.push({
        optionId: created.id,
        incompatibleOptionId: candidate.id,
        severity: "error",
      });
      rows.push({
        optionId: candidate.id,
        incompatibleOptionId: created.id,
        severity: "error",
      });
    }
  }

  // dedupe by composite key
  const uniq = new Map<string, IncompatRow>();
  for (const r of rows) {
    const key = `${r.optionId}|${r.incompatibleOptionId}`;
    if (!uniq.has(key)) uniq.set(key, r);
  }

  return { rows: Array.from(uniq.values()), warnings };
}

/* ----------------------------- Handler ---------------------------- */

export async function POST(request: NextRequest) {
  try {
    const rawBody = (await request.json()) as RequestBody;
    const body = rawBody as any;
    const configuratorId = body.configuratorId;

    if (!configuratorId) {
      return fail("Configurator ID is required", "VALIDATION_ERROR", 400);
    }

    // Verify session
    const auth = await (await import("@/src/lib/admin-auth")).verifyAdminSession();

    // Verify configurator belongs to client
    const configurator = await prisma.configurator.findUnique({
      where: { id: configuratorId },
      select: { id: true, clientId: true },
    });

    if (!configurator) {
      return fail("Configurator not found", "NOT_FOUND", 404);
    }

    if (configurator.clientId !== auth.clientId) {
      return fail("You don't own this configurator", "UNAUTHORIZED", 401);
    }

    const { items } = normalizeRequest(rawBody);
    
    if (!Array.isArray(items) || items.length === 0)
      return fail("No items provided", "VALIDATION_ERROR", 400);

    // Transactional sequence: categories -> options -> incompatibilities
    const result = await prisma.$transaction(async (tx) => {
      // 1) Ensure categories exist
      const categoryMap = await ensureCategories(tx, configuratorId, items);

      // 2) Create options and build lookup
      const { createdOptionsList, optionLookup } = await createOptions(
        tx,
        categoryMap,
        items
      );

      // 3) Build incompatibility rows and insert them
      const { rows: incompatRows, warnings } = buildIncompatRows(
        createdOptionsList,
        optionLookup
      );

      let createdCount = 0;
      if (incompatRows.length > 0) {
        await tx.optionIncompatibility.createMany({
          data: incompatRows.map((r) => ({
            optionId: r.optionId,
            incompatibleOptionId: r.incompatibleOptionId,
            severity: r.severity ?? "error",
            message: r.message ?? null,
            createdAt: new Date(),
          })),
          skipDuplicates: true,
        });

        createdCount = incompatRows.length;
      }

      return {
        categories: Array.from(categoryMap.values()),
        options: createdOptionsList.map((c) => ({
          id: c.id,
          label: c.label,
          sku: c.sku,
          categoryName: c.categoryName,
          tempId: c.tempId,
        })),
        incompatibilitiesCreated: createdCount,
        warnings,
      };
    });

    return success(result, "Bulk import completed");
  } catch (err: any) {
    console.error("Bulk import error:", err);
    return fail(err?.message || "Bulk import failed", "IMPORT_ERROR", 500);
  }
}
