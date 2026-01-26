// Get active theme for current user
import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { success, fail, unauthorized } from "@/src/lib/response";
import { verifyAdminSession } from "@/src/lib/admin-auth";
import { DEFAULT_THEME } from "@/src/config/constants";

export async function GET(request: NextRequest) {
  try {
    // Verify session
    const auth = await verifyAdminSession();

    // Try to get theme from configurator
    const configurator = await prisma.configurator.findFirst({
      where: {
        clientId: auth.clientId,
        isActive: true,
      },
      include: {
        theme: true,
      },
      orderBy: { createdAt: "desc" },
    });

    let theme = configurator?.theme;

    // If no theme linked to configurator, get default theme for client
    if (!theme) {
      theme = await prisma.theme.findFirst({
        where: {
          clientId: auth.clientId,
          isActive: true,
        },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      });
    }

    // If still no theme, create one with defaults
    if (!theme) {
      theme = await prisma.theme.create({
        data: {
          clientId: auth.clientId,
          ...(DEFAULT_THEME as any),
          name: "Default Theme",
          isDefault: true,
          isActive: true,
        },
      });
    }

    return success(theme, "Theme loaded successfully");
  } catch (error: any) {
    console.error("Theme active error:", error);
    if (
      error.message === "Not authenticated" ||
      error.message === "Client not found"
    ) {
      return unauthorized(error.message);
    }
    return fail(
      error.message || "Failed to load active theme",
      "LOAD_ERROR",
      500,
    );
  }
}
