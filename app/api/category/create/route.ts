// Create category
import { NextRequest } from "next/server";
import { CategoryService } from "@/src/services/category.service";
import {
  success,
  fail,
  created,
  unauthorized,
  notFound,
} from "@/src/lib/response";
import { verifyAdminSession } from "@/src/lib/admin-auth";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      configuratorId,
      name,
      categoryType,
      description,
      isPrimary,
      isRequired,
    } = body;

    if (!configuratorId || !name) {
      return fail(
        "Configurator ID and name are required",
        "VALIDATION_ERROR",
        400
      );
    }

    // Verify session
    const auth = await verifyAdminSession();

    // Verify configurator exists & belongs to client
    const configurator = await prisma.configurator.findUnique({
      where: { id: configuratorId },
      select: { id: true, clientId: true },
    });

    if (!configurator) return notFound("Configurator not found");
    if (configurator.clientId !== auth.clientId) {
      return unauthorized("You don't own this configurator");
    }

    // If this is the first category for the configurator, make it primary by default
    const existingCount = await prisma.category.count({
      where: { configuratorId },
    });
    const isPrimaryForCreate = existingCount === 0;

    // Create category
    const category = await CategoryService.create(configuratorId, {
      name,
      categoryType,
      description,
      isPrimary: isPrimaryForCreate,
      isRequired,
    });

    return created(category, "Category created");
  } catch (error: any) {
    console.error("Category create error:", error);
    if (error.message === "Not authenticated" || error.message === "Client not found") {
      return unauthorized(error.message);
    }
    return fail(
      error.message || "Failed to create category",
      "CREATE_ERROR",
      error.statusCode || 500
    );
  }
}
