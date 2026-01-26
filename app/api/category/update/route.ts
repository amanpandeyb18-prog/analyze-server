// Update category
import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { CategoryService } from "@/src/services/category.service";
import { success, fail, unauthorized, notFound } from "@/src/lib/response";
import { verifyAdminSession } from "@/src/lib/admin-auth";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return fail("Category ID is required", "VALIDATION_ERROR");

    // Verify session
    const auth = await verifyAdminSession();

    const category = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        configurator: { select: { id: true, clientId: true } },
      },
    });

    if (!category) return notFound("Category not found");

    if (category.configurator.clientId !== auth.clientId) {
      return unauthorized("You don't own this category");
    }

    const updated = await CategoryService.update(id, data);
    return success(updated, "Category updated");
  } catch (error: any) {
    console.error("category update error:", error);
    if (error.message === "Not authenticated" || error.message === "Client not found") {
      return unauthorized(error.message);
    }
    return fail(error.message, "UPDATE_ERROR", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return fail("Category ID is required", "VALIDATION_ERROR");

    // Verify session
    const auth = await verifyAdminSession();

    const category = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        configurator: { select: { id: true, clientId: true } },
      },
    });

    if (!category) return notFound("Category not found");

    if (category.configurator.clientId !== auth.clientId) {
      return unauthorized("You don't own this category");
    }

    await CategoryService.delete(id);
    return success(null, "Category deleted");
  } catch (error: any) {
    console.error("category delete error:", error);
    if (error.message === "Not authenticated" || error.message === "Client not found") {
      return unauthorized(error.message);
    }
    return fail(error.message, "DELETE_ERROR", 500);
  }
}
