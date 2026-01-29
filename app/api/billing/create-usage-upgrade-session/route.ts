import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/src/lib/prisma";
import { BillingService } from "@/src/services/billing.service";
import { success, fail } from "@/src/lib/response";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return fail("Unauthorized", "UNAUTHORIZED", 401);
    }

    const client = await prisma.client.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionStatus: true,
        subscriptionDuration: true,
      },
    });

    if (!client?.stripeCustomerId) {
      return fail("Missing Stripe customer", "NO_CUSTOMER", 400);
    }

    if (!client?.stripeSubscriptionId) {
      return fail(
        "No active subscription found. Please subscribe first.",
        "NO_SUBSCRIPTION",
        400,
      );
    }

    if (client.subscriptionStatus !== "ACTIVE") {
      return fail(
        "Subscription is not active. Please ensure your subscription is active before upgrading.",
        "INACTIVE_SUBSCRIPTION",
        400,
      );
    }

    // Add recurring upgrade to subscription
    // This permanently increases the subscription price by €10/month or €100/year
    await BillingService.addOptionCapacityUpgrade(
      client.id,
      client.stripeSubscriptionId,
      client.subscriptionDuration || "MONTHLY",
    );

    return success({
      message: "Option capacity upgraded successfully",
      recurring: true,
      amount: client.subscriptionDuration === "YEARLY" ? 100 : 10,
      interval: client.subscriptionDuration === "YEARLY" ? "year" : "month",
    });
  } catch (err: any) {
    console.error("Option capacity upgrade error:", err);
    return fail(
      err.message || "Failed to upgrade option capacity",
      "UPGRADE_ERROR",
      500,
    );
  }
}
