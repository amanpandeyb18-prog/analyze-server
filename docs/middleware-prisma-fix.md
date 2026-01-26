# API Authentication in Next.js Middleware

## The Problem

Prisma Client cannot be used in Next.js middleware because:
- Middleware runs in the **Edge Runtime** (limited Node.js APIs)
- Prisma requires the full Node.js runtime
- This causes webpack errors when trying to import Prisma in middleware

## The Solution

API key validation has been moved from middleware to API route handlers.

### ✅ Correct Usage (API Routes)

```typescript
// app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validatePublicKey, validateApiKey } from "@/src/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    // Validate the client's API key
    const client = await validatePublicKey(request);
    
    // Your API logic here
    return NextResponse.json({ success: true, clientId: client.id });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 401 }
    );
  }
}
```

### ❌ Incorrect Usage (Middleware)

```typescript
// middleware.ts - DON'T DO THIS!
import { validateApiKey } from "@/src/lib/api-auth"; // ❌ Error!

export async function middleware(request: NextRequest) {
  await validateApiKey(request); // ❌ Won't work in Edge Runtime
}
```

## What Changed

1. **Middleware** ([middleware.ts](../middleware.ts))
   - Removed Prisma-dependent imports
   - Handles only Edge-compatible logic (CORS, rate limiting, redirects)
   - Added comments explaining the change

2. **API Auth Utility** ([src/lib/api-auth.ts](../src/lib/api-auth.ts))
   - New location for `validatePublicKey` and `validateApiKey`
   - Can be safely imported in API route handlers
   - Uses Prisma to validate keys against the database

3. **Legacy File** ([src/middleware/api-key.ts](../src/middleware/api-key.ts))
   - Re-exports from the new location for backwards compatibility
   - Will be removed in a future version

## Migration Checklist

If you were using API key validation in specific routes, update them to use the validation in the route handler:

- [ ] Check all API routes that need authentication
- [ ] Import `validatePublicKey` or `validateApiKey` from `@/src/lib/api-auth`
- [ ] Call validation at the start of your route handler
- [ ] Handle errors appropriately

## Example: Protecting an API Route

```typescript
// app/api/configurator/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validatePublicKey } from "@/src/lib/api-auth";
import { AuthenticationError } from "@/src/lib/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate API key
    const client = await validatePublicKey(request);
    
    // Check if client owns this configurator
    const configurator = await prisma.configurator.findFirst({
      where: {
        id: params.id,
        clientId: client.id,
      },
    });
    
    if (!configurator) {
      throw new AuthenticationError("Configurator not found");
    }
    
    return NextResponse.json(configurator);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```
