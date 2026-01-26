// Reset theme to default
import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { success, fail, unauthorized } from "@/src/lib/response";
import { verifyAdminSession } from "@/src/lib/admin-auth";
import { DEFAULT_THEME } from "@/src/config/constants";

export async function POST(request: NextRequest) {
  try {
    // Verify session
    const auth = await verifyAdminSession();

    // Get the first active theme for this client
    let theme = await prisma.theme.findFirst({
      where: {
        clientId: auth.clientId,
        isActive: true,
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    if (theme) {
      // Update existing theme to defaults
      theme = await prisma.theme.update({
        where: { id: theme.id },
        data: {
          ...(DEFAULT_THEME as any),
          name: "Default Theme",
          isDefault: true,
        },
      });
    } else {
      // Create new default theme
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

    return success(theme, "Theme reset to default");
  } catch (error: any) {
    console.error("Theme reset error:", error);
    if (
      error.message === "Not authenticated" ||
      error.message === "Client not found"
    ) {
      return unauthorized(error.message);
    }
    return fail(error.message || "Failed to reset theme", "RESET_ERROR", 500);
  }
}
