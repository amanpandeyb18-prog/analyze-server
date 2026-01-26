// Update theme
import { NextRequest } from "next/server";
import { ThemeService } from "@/src/services/theme.service";
import { prisma } from "@/src/lib/prisma";
import { success, fail, unauthorized, notFound } from "@/src/lib/response";
import { verifyAdminSession } from "@/src/lib/admin-auth";
import { DEFAULT_THEME } from "@/src/config/constants";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    let { id, ...data } = body;

    // Verify session
    const auth = await verifyAdminSession();

    // If no ID provided, get or create active theme
    if (!id) {
      let theme = await prisma.theme.findFirst({
        where: {
          clientId: auth.clientId,
          isActive: true,
        },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      });

      if (!theme) {
        // Create new theme with data
        theme = await prisma.theme.create({
          data: {
            clientId: auth.clientId,
            ...(data as any),
            name: data.name || "Custom Theme",
            isActive: true,
          },
        });
        return success(theme, "Theme created successfully");
      }

      id = theme.id;
    } else {
      // Verify theme belongs to client
      const theme = await prisma.theme.findUnique({
        where: { id },
        select: { id: true, clientId: true },
      });

      if (!theme) {
        return notFound("Theme not found");
      }

      if (theme.clientId !== auth.clientId) {
        return unauthorized("You don't own this theme");
      }
    }

    const updated = await ThemeService.update(id, data);
    return success(updated, "Theme updated successfully");
  } catch (error: any) {
    console.error("Theme update error:", error);
    if (
      error.message === "Not authenticated" ||
      error.message === "Client not found"
    ) {
      return unauthorized(error.message);
    }
    return fail(error.message || "Failed to update theme", "UPDATE_ERROR", 500);
  }
}
