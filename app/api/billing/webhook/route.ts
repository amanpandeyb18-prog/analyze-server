// Unified Stripe webhook
import { NextRequest } from "next/server";
import { constructWebhookEvent, stripe } from "@/src/lib/stripe";
import { BillingService } from "@/src/services/billing.service";
import { prisma } from "@/src/lib/prisma";
import { success, fail } from "@/src/lib/response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!signature) return fail("Missing signature", "WEBHOOK_ERROR", 400);

    const event = constructWebhookEvent(body, signature);
    console.log(`[Webhook] ${event.type} ID: ${event.id}`);

    switch (event.type) {
      // ✅ Subscription checkout finished
      case "checkout.session.completed": {
        const session: any = event.data.object;

        // Subscription plan checkout
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription,
          );
          await BillingService.handleSubscriptionCreated(subscription);
        }

        break;
      }

      // ✅ New sub
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await BillingService.handleSubscriptionCreated(event.data.object);
        break;

      // ✅ Cancel sub
      case "customer.subscription.deleted":
        await BillingService.handleSubscriptionDeleted(event.data.object);
        break;

      // ✅ Invoice paid = billing cycle completed
      // NOTE: We no longer reset chargedBlocks because upgrades are now permanent
      // and tracked via subscription items in Stripe
      case "invoice.payment_succeeded": {
        const inv: any = event.data.object;
        const sub = inv.subscription as string;
        const client = await prisma.client.findFirst({
          where: { stripeSubscriptionId: sub },
        });
        if (client) {
          // Just update last sync - don't reset blocks anymore
          await prisma.billingUsage.updateMany({
            where: { clientId: client.id },
            data: { lastSync: new Date() },
          });

          console.log(
            `[Billing] Invoice paid for client ${client.id} - no reset needed (upgrades are permanent)`,
          );
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return success({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return fail(err.message, "WEBHOOK_ERROR", 400);
  }
}
