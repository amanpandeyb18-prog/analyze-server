import { NextRequest } from "next/server";
import { ConfiguratorService } from "@/src/services/configurator.service";
import { success, fail, unauthorized } from "@/src/lib/response";
import { verifyAdminSession } from "@/src/lib/admin-auth";
import { prisma } from "@/src/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { configuratorId, ...data } = body;

    if (!configuratorId) {
      return fail("Configurator ID is required", "VALIDATION_ERROR", 400);
    }

    // Verify session
    const auth = await verifyAdminSession();

    // Verify configurator belongs to client
    const configurator = await prisma.configurator.findUnique({
      where: { id: configuratorId },
      select: { id: true, clientId: true },
    });

    if (!configurator) {
      return fail("Configurator not found", "NOT_FOUND", 404);
    }

    if (configurator.clientId !== auth.clientId) {
      return unauthorized("You don't own this configurator");
    }

    // Perform the update
    const updatedConfigurator = await ConfiguratorService.update(
      configuratorId,
      auth.clientId,
      data
    );

    return success(updatedConfigurator, "Configurator updated successfully");
  } catch (error: any) {
    console.error("Configurator update error:", error);
    if (error.message === "Not authenticated" || error.message === "Client not found") {
      return unauthorized(error.message);
    }
    return fail(
      error.message || "Failed to update configurator",
      "UPDATE_ERROR",
      500
    );
  }
}
