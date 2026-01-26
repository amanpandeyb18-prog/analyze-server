import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess } from "@/src/lib/admin-auth";
import { ConfiguratorService } from "@/src/services/configurator.service";
import { success, fail, unauthorized, forbidden, notFound } from "@/src/lib/response";

/**
 * GET /api/configurator/admin/[id]
 * Returns full configurator data for admin editing
 * Requires valid NextAuth session
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: configuratorId } = await params;

    // Verify session and ownership
    const auth = await verifyAdminAccess(configuratorId);

    // Fetch full configurator with all relations
    const configurator = await ConfiguratorService.getByPublicIdAndClientId(
      configuratorId,
      auth.clientId
    );

    if (!configurator) {
      return notFound("Configurator not found");
    }

    return success(configurator);
  } catch (error: any) {
    if (error.message === "Not authenticated") {
      return unauthorized("Authentication required");
    }
    if (error.message === "Client not found") {
      return unauthorized("Client not found");
    }
    if (error.message === "Configurator not found") {
      return notFound("Configurator not found");
    }
    if (error.message.startsWith("Forbidden")) {
      return forbidden(error.message);
    }
    return fail(error.message, "INTERNAL_ERROR", 500);
  }
}
