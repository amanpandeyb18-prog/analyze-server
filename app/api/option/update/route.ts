// Update option
import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { OptionService } from "@/src/services/option.service";
import { success, fail, unauthorized, notFound } from "@/src/lib/response";
import { verifyAdminSession } from "@/src/lib/admin-auth";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return fail("Option ID is required", "VALIDATION_ERROR");

    // Verify session
    const auth = await verifyAdminSession();

    // Fetch option to confirm ownership
    const option = await prisma.option.findUnique({
      where: { id },
      select: {
        id: true,
        category: {
          select: { configurator: { select: { id: true, clientId: true } } },
        },
      },
    });

    if (!option) return notFound("Option not found");

    if (option.category.configurator.clientId !== auth.clientId) {
      return unauthorized("You don't own this option");
    }

    if (data.price !== undefined) data.price = parseFloat(data.price);

    const updated = await OptionService.update(id, data);
    return success(updated, "Option updated");
  } catch (error: any) {
    console.error("option update error:", error);
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

    if (!id) return fail("Option ID is required", "VALIDATION_ERROR");

    // Verify session
    const auth = await verifyAdminSession();

    const option = await prisma.option.findUnique({
      where: { id },
      select: {
        id: true,
        category: {
          select: { configurator: { select: { id: true, clientId: true } } },
        },
      },
    });

    if (!option) return notFound("Option not found");

    if (option.category.configurator.clientId !== auth.clientId) {
      return unauthorized("You don't own this option");
    }

    await OptionService.delete(id);
    return success(null, "Option deleted");
  } catch (error: any) {
    console.error("option delete error:", error);
    if (error.message === "Not authenticated" || error.message === "Client not found") {
      return unauthorized(error.message);
    }
    return fail(error.message, "DELETE_ERROR", 500);
  }
}
