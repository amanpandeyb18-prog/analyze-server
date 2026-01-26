import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  applyRateLimit,
  getRateLimitIdentifier,
} from "@/src/middleware/rate-limit";
import { applyCors } from "@/src/middleware/cors";
// ❌ Removed: Cannot use Prisma in Edge Runtime (middleware)
// API key validation moved to individual API route handlers
// Use: import { validateApiKey, validatePublicKey } from "@/src/lib/api-auth"
import { env } from "@/src/config/env";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  // ✅ Apply CORS to all API routes using centralized configuration
  if (pathname.startsWith("/api")) {
    const corsResponse = applyCors(request);
    if (corsResponse) return corsResponse;
  }

  // ✅ Fixed: Rate limiting for ALL auth endpoints
  if (
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/register") ||
    pathname.startsWith("/api/auth/forgot-password") ||
    pathname.startsWith("/api/auth/reset-password")
  ) {
    const identifier = getRateLimitIdentifier(request);
    try {
      // Stricter limits for auth endpoints
      applyRateLimit(request, identifier, {
        max: 5, // 5 requests
        windowMs: 15 * 60 * 1000, // per 15 minutes
      });
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          error: (err as Error).message,
          code: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }
  }

  // Rate limiting for public API routes
  if (pathname.startsWith("/api/public")) {
    const identifier = getRateLimitIdentifier(request);
    try {
      applyRateLimit(request, identifier);
    } catch (err) {
      return NextResponse.json(
        { error: (err as Error).message },
        { status: 429 }
      );
    }
  }

  // ⚠️ API key validation moved to individual API route handlers
  // Cannot use Prisma in Edge Runtime middleware
  // To protect /api/secure/* routes, add validation in each route handler:
  //
  // import { validateApiKey } from "@/src/lib/api-auth";
  // export async function GET(request: NextRequest) {
  //   const client = await validateApiKey(request);
  //   // ... your logic
  // }

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/pricing",
    "/api",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Protected dashboard and test routes
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isTestRoute = pathname.startsWith("/test");
  const isAdminConfigRoute = pathname.startsWith("/admin/configurator");

  // If trying to access dashboard, test, or admin routes without auth, redirect to login
  if ((isDashboardRoute || isTestRoute || isAdminConfigRoute) && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
