// Create theme
import { NextRequest } from "next/server";
import { ThemeService } from "@/src/services/theme.service";
import { success, fail, created, unauthorized } from "@/src/lib/response";
import { verifyAdminSession } from "@/src/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const themeData = body;

    // Verify session
    const auth = await verifyAdminSession();

    // Create theme for the authenticated client
    const theme = await ThemeService.create(auth.clientId, themeData);

    return created(theme, "Theme created");
  } catch (error: any) {
    console.error("Theme create error:", error);
    if (error.message === "Not authenticated" || error.message === "Client not found") {
      return unauthorized(error.message);
    }
    return fail(error.message || "Failed to create theme", "CREATE_ERROR", 500);
  }
}
