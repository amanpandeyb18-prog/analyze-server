// API authentication utilities for API route handlers
// ⚠️ These functions use Prisma and can ONLY be used in API routes, NOT in middleware
import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { AuthenticationError, AuthorizationError } from "@/src/lib/errors";
import type { Client } from "@/src/types/prisma";

/**
 * Validate public API key for embed endpoints
 * Use this in API route handlers, NOT in middleware
 */
export async function validatePublicKey(request: NextRequest): Promise<Client> {
  const publicKey = request.headers.get("x-public-key");
  const origin =
    request.headers.get("x-embed-origin") ||
    request.headers.get("referer") ||
    "";

  if (!publicKey) {
    throw new AuthenticationError("Public key required");
  }

  const client = await prisma.client.findUnique({
    where: { publicKey },
  });

  if (!client) {
    throw new AuthenticationError("Invalid public key");
  }

  // Check subscription status
  if (
    client.subscriptionStatus === "CANCELED" ||
    client.subscriptionStatus === "SUSPENDED"
  ) {
    throw new AuthorizationError("Subscription is not active");
  }

  // Validate allowed domains
  if (client.allowedDomains.length > 0 && origin) {
    const originUrl = new URL(origin).hostname;
    const isAllowed = client.allowedDomains.some(
      (domain: string) => domain === "*" || originUrl.includes(domain)
    );

    if (!isAllowed) {
      throw new AuthorizationError("Domain not allowed");
    }
  }

  // Check rate limits
  if (client.monthlyRequests >= client.requestLimit) {
    throw new AuthorizationError("Monthly request limit exceeded");
  }

  return client;
}

/**
 * Validate private API key for authenticated API access
 * Use this in API route handlers, NOT in middleware
 */
export async function validateApiKey(request: NextRequest): Promise<Client> {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    throw new AuthenticationError("API key required");
  }

  const client = await prisma.client.findUnique({
    where: { apiKey },
  });

  if (!client) {
    throw new AuthenticationError("Invalid API key");
  }

  // Check subscription status
  if (
    client.subscriptionStatus === "CANCELED" ||
    client.subscriptionStatus === "SUSPENDED"
  ) {
    throw new AuthorizationError("Subscription is not active");
  }

  return client;
}
