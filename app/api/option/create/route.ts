// Create option
import { NextRequest } from "next/server";
import { OptionService } from "@/src/services/option.service";
import {
  success,
  fail,
  created as createdResponse,
  unauthorized,
  notFound,
} from "@/src/lib/response";
import { verifyAdminSession } from "@/src/lib/admin-auth";
import { prisma } from "@/src/lib/prisma";
import { countPrimaryOptionsForClient } from "@/src/lib/usage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      categoryId,
      label,
      description,
      price,
      sku,
      imageUrl,
      isDefault,
      incompatibleWith,
    } = body;

    if (!categoryId || !label || price === undefined) {
      return fail(
        "Category ID, label, and price are required",
        "VALIDATION_ERROR",
        400
      );
    }

    // Verify session
    const auth = await verifyAdminSession();

    // Verify category belongs to configurator & client
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        isPrimary: true,
        configurator: { select: { id: true, clientId: true } },
      },
    });

    if (!category) return notFound("Category not found");

    if (category.configurator.clientId !== auth.clientId) {
      return unauthorized("You don't own this category");
    }

    // Enforce primary option cap if adding to primary category
    if (category.isPrimary) {
      const totalPrimaryOptions = await countPrimaryOptionsForClient(
        auth.clientId
      );

      // Fetch purchased blocks
      const usage = await prisma.billingUsage.findUnique({
        where: { clientId: auth.clientId },
        select: { chargedBlocks: true },
      });

      const baseLimit = 10;
      const extraLimit = (usage?.chargedBlocks ?? 0) * 10;
      const limit = baseLimit + extraLimit;

      if (totalPrimaryOptions >= limit) {
        return fail(
          `You reached your limit of ${limit} options. Upgrade to add more.`,
          "PLAN_LIMIT",
          403
        );
      }
    }

    // Create option
    const created = await OptionService.create(categoryId, {
      label,
      price: parseFloat(String(price)),
      description,
      sku,
      imageUrl,
      isDefault,
    });

    // Process incompatibilities
    const processedIncompatibilities: string[] = [];
    if (Array.isArray(incompatibleWith) && incompatibleWith.length > 0) {
      await Promise.all(
        incompatibleWith.map(async (targetOptionId: string) => {
          try {
            // Confirm target exists and belongs to same configurator
            const target = await prisma.option.findUnique({
              where: { id: targetOptionId },
              select: {
                id: true,
                category: {
                  select: { configurator: { select: { id: true } } },
                },
              },
            });
            if (!target) return;
            if (target.category.configurator.id !== category.configurator.id)
              return;

            // Create incompatibility both ways
            await OptionService.addIncompatibility(created.id, targetOptionId);
            await OptionService.addIncompatibility(targetOptionId, created.id);

            processedIncompatibilities.push(targetOptionId);
          } catch {
            // Swallow individual errors to continue processing others
          }
        })
      );
    }

    const responsePayload = {
      ...created,
      incompatibleWith: processedIncompatibilities,
    };

    return createdResponse(responsePayload, "Option created");
  } catch (error: any) {
    console.error("Option create error:", error);
    if (error.message === "Not authenticated" || error.message === "Client not found") {
      return unauthorized(error.message);
    }
    return fail(
      error.message || "Failed to create option",
      "CREATE_ERROR",
      500
    );
  }
}
