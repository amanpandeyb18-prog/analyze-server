// ⚠️ DEPRECATED: This file is kept for backwards compatibility only
// API key validation has been moved to src/lib/api-auth.ts
// 
// These functions use Prisma and can ONLY be used in API routes, NOT in middleware
// Import from the new location in your API route handlers:
//   import { validateApiKey, validatePublicKey } from "@/src/lib/api-auth";

export { validatePublicKey, validateApiKey } from "@/src/lib/api-auth";
