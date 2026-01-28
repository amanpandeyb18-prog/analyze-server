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

    // If no ID provided, use create-or-update logic
    if (!id) {
      // Try to find existing active theme
      let theme = await prisma.theme.findFirst({
        where: {
          clientId: auth.clientId,
          isActive: true,
        },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      });

      if (theme) {
        // Update existing theme
        const updated = await ThemeService.update(theme.id, data);
        return success(updated, "Theme updated successfully");
      } else {
        // Create new theme with provided data and defaults
        theme = await prisma.theme.create({
          data: {
            clientId: auth.clientId,
            ...(DEFAULT_THEME as any),
            ...(data as any),
            name: (data as any)?.name || "Custom Theme",
            isActive: true,
            isDefault: true,
          },
        });
        return success(theme, "Theme created successfully");
      }
    } else {
      // ID provided - verify and update specific theme
      const theme = await prisma.theme.findUnique({
        where: { id },
        select: { id: true, clientId: true },
      });

      if (!theme) {
        // Theme not found - create new one with provided data
        console.warn(`Theme ${id} not found, creating new theme instead`);
        const newTheme = await prisma.theme.create({
          data: {
            clientId: auth.clientId,
            ...(DEFAULT_THEME as any),
            ...(data as any),
            name: (data as any)?.name || "Custom Theme",
            isActive: true,
            isDefault: true,
          },
        });
        return success(newTheme, "Theme created successfully");
      }

      if (theme.clientId !== auth.clientId) {
        return unauthorized("You don't own this theme");
      }

      // Update existing theme
      const updated = await ThemeService.update(id, data);
      return success(updated, "Theme updated successfully");
    }
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
