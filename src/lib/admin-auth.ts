import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/src/lib/prisma";

export interface AdminAuthResult {
  clientId: string;
  userId: string;
  email: string;
}

/**
 * Verify NextAuth session and return client context
 * Throws error if not authenticated or client not found
 */
export async function verifyAdminSession(): Promise<AdminAuthResult> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { client: true },
  });

  if (!user || !user.client) {
    throw new Error("Client not found");
  }

  return {
    clientId: user.client.id,
    userId: user.id,
    email: user.email!,
  };
}

/**
 * Verify configurator ownership by client
 * Throws error if configurator not found or doesn't belong to client
 */
export async function verifyConfiguratorOwnership(
  configuratorId: string,
  clientId: string
): Promise<void> {
  const configurator = await prisma.configurator.findUnique({
    where: { publicId: configuratorId },
    select: { clientId: true },
  });

  if (!configurator) {
    throw new Error("Configurator not found");
  }

  if (configurator.clientId !== clientId) {
    throw new Error("Forbidden: You don't own this configurator");
  }
}

/**
 * Combined helper: verify session and configurator ownership
 */
export async function verifyAdminAccess(
  configuratorId: string
): Promise<AdminAuthResult> {
  const auth = await verifyAdminSession();
  await verifyConfiguratorOwnership(configuratorId, auth.clientId);
  return auth;
}
