// Delete configurator
import { NextRequest } from "next/server";
import { ConfiguratorService } from "@/src/services/configurator.service";
import { success, fail, unauthorized, notFound } from "@/src/lib/response";
import { verifyAdminSession } from "@/src/lib/admin-auth";
import { prisma } from "@/src/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return fail("Configurator ID is required", "VALIDATION_ERROR");
    }

    // Verify session
    const auth = await verifyAdminSession();

    // Verify configurator exists and ownership matches
    const configurator = await prisma.configurator.findUnique({
      where: { id },
      select: { id: true, clientId: true },
    });

    if (!configurator) {
      return notFound("Configurator not found");
    }

    if (configurator.clientId !== auth.clientId) {
      return unauthorized("You don't own this configurator");
    }

    await ConfiguratorService.delete(id, auth.clientId);

    return success(null, "Configurator deleted");
  } catch (error: any) {
    console.error("Configurator delete error:", error);
    if (error.message === "Not authenticated" || error.message === "Client not found") {
      return unauthorized(error.message);
    }
    return fail(
      error.message || "Failed to delete configurator",
      "DELETE_ERROR",
      error.statusCode || 500
    );
  }
}
