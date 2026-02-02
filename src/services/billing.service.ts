// Billing service
import { prisma } from "@/src/lib/prisma";
import {
  stripe,
  createCheckoutSession,
  createCheckoutSessionWithImmediateCharge,
  createCustomer,
  createCustomerPortalSession,
  addSubscriptionItem,
  getOrCreateUpgradePrice,
} from "@/src/lib/stripe";
import { ClientService } from "./client.service";
import type { SubscriptionStatus, SubscriptionDuration } from "@prisma/client";
import { PLAN_LIMITS } from "@/src/config/permissions";
import { env } from "@/src/config/env";

export const BillingService = {
  async createCheckoutSession(
    clientId: string,
    duration: "MONTHLY" | "YEARLY",
    successUrl: string,
    cancelUrl: string,
  ) {
    const client = await ClientService.getById(clientId);

    let customerId = client.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await createCustomer({
        email: client.email,
        name: client.name,
        metadata: { clientId: client.id },
      });
      customerId = customer.id;

      await ClientService.update(clientId, {
        stripeCustomerId: customerId,
      });
    }

    // Create or get price IDs for monthly and yearly subscriptions
    // In production, these should be created in Stripe dashboard and stored in env
    const monthlyPriceId = env.STRIPE_MONTHLY_PRICE_ID;
    const yearlyPriceId = env.STRIPE_YEARLY_PRICE_ID;

    // If no price IDs in env, create them dynamically (for development)
    let priceId: string;
    let immediateCharge: number;

    if (duration === "MONTHLY") {
      priceId = monthlyPriceId || (await createOrGetPrice("month", 9900)); // €99.00
      immediateCharge = 1000; // €10.00 immediate charge
    } else {
      priceId = yearlyPriceId || (await createOrGetPrice("year", 99900)); // €999.00
      immediateCharge = 10000; // €100.00 immediate charge
    }

    // Create checkout session with immediate charge + recurring subscription
    const session = await createCheckoutSessionWithImmediateCharge({
      customerId,
      priceId,
      immediateCharge,
      successUrl,
      cancelUrl,
    });

    return session;
  },

  async createUpgradeCheckoutSession(
    clientId: string,
    currentClient: {
      subscriptionEndsAt: Date | null;
      stripeSubscriptionId: string;
    },
    successUrl: string,
    cancelUrl: string,
  ) {
    const client = await ClientService.getById(clientId);

    if (!client.stripeCustomerId) {
      throw new Error("No Stripe customer found");
    }

    // Cancel the current monthly subscription immediately (no proration)
    try {
      await stripe.subscriptions.update(currentClient.stripeSubscriptionId, {
        cancel_at_period_end: false,
        proration_behavior: "none",
      });
      await stripe.subscriptions.cancel(currentClient.stripeSubscriptionId);
    } catch (err) {
      console.warn("Failed to cancel existing subscription:", err);
    }

    // Create a new yearly subscription checkout
    const yearlyPriceId =
      env.STRIPE_YEARLY_PRICE_ID || (await createOrGetPrice("year", 99900));

    // Create checkout session with immediate charge for yearly plan
    const session = await createCheckoutSessionWithImmediateCharge({
      customerId: client.stripeCustomerId,
      priceId: yearlyPriceId,
      immediateCharge: 10000, // €100 immediate charge
      successUrl,
      cancelUrl,
    });

    return session;
  },

  /**
   * Add recurring option capacity upgrade to existing subscription
   * This permanently increases the subscription price by €10/month or €100/year
   */
  async addOptionCapacityUpgrade(
    clientId: string,
    stripeSubscriptionId: string,
    subscriptionDuration: "MONTHLY" | "YEARLY",
  ) {
    try {
      // Get subscription details
      const subscription =
        await stripe.subscriptions.retrieve(stripeSubscriptionId);

      // Determine interval
      const interval = subscriptionDuration === "YEARLY" ? "year" : "month";

      // Get or create upgrade price
      const upgradePriceId = await getOrCreateUpgradePrice(interval);

      // Add subscription item (this will prorate automatically)
      const subscriptionItem = await addSubscriptionItem(
        stripeSubscriptionId,
        upgradePriceId,
        1,
      );

      console.log(
        `Added option capacity upgrade to subscription ${stripeSubscriptionId}:`,
        subscriptionItem.id,
      );

      // Update billing usage to track permanent upgrade
      await prisma.billingUsage.upsert({
        where: { clientId },
        update: {
          chargedBlocks: { increment: 1 },
          lastSync: new Date(),
        },
        create: {
          clientId,
          chargedBlocks: 1,
          totalPrimaryOptions: 0,
        },
      });

      // Log audit event
      await prisma.auditBillingEvent.create({
        data: {
          clientId,
          event: "RECURRING_UPGRADE_ADDED",
          details: {
            subscriptionId: stripeSubscriptionId,
            subscriptionItemId: subscriptionItem.id,
            priceId: upgradePriceId,
            interval,
            amount: interval === "month" ? 1000 : 10000,
          },
        },
      });

      return subscriptionItem;
    } catch (error: any) {
      console.error("Failed to add option capacity upgrade:", error);
      throw error;
    }
  },

  async createPortalSession(clientId: string, returnUrl: string) {
    const client = await ClientService.getById(clientId);

    if (!client.stripeCustomerId) {
      throw new Error("No Stripe customer found");
    }

    return await createCustomerPortalSession(
      client.stripeCustomerId,
      returnUrl,
    );
  },

  async handleSubscriptionCreated(subscription: any) {
    try {
      const customerId = subscription.customer;
      const subscriptionId = subscription.id;
      const stripeStatus = subscription.status; // 'active', 'trialing', 'past_due', etc.
      const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

      console.log("Processing subscription:", {
        subscriptionId,
        customerId,
        status: stripeStatus,
        currentPeriodEnd,
      });

      // Map Stripe status to our SubscriptionStatus enum
      let status: SubscriptionStatus;
      switch (stripeStatus) {
        case "active":
        case "trialing": // Map trialing to active since we don't support trials
          status = "ACTIVE";
          break;
        case "past_due":
          status = "PAST_DUE";
          break;
        case "canceled":
        case "unpaid":
          status = "CANCELED";
          break;
        case "incomplete":
        case "incomplete_expired":
        default:
          status = "INACTIVE";
          break;
      }

      // Find client by Stripe customer ID
      const client = await prisma.client.findUnique({
        where: { stripeCustomerId: customerId },
      });

      if (!client) {
        console.error(`No client found for Stripe customer: ${customerId}`);
        throw new Error(`Client not found for customer ${customerId}`);
      }

      // Determine duration from price interval
      const interval = subscription.items.data[0]?.price.recurring?.interval;
      const duration = interval === "year" ? "YEARLY" : "MONTHLY";

      // Get the price ID
      const priceId = subscription.items.data[0]?.price.id;

      console.log(
        `Updating client ${client.id} (${client.email}) subscription:`,
        {
          status,
          duration,
          subscriptionId,
          priceId,
          stripeStatus,
        },
      );

      await prisma.client.update({
        where: { id: client.id },
        data: {
          subscriptionStatus: status,
          subscriptionDuration: duration,
          stripeSubscriptionId: subscriptionId,
          stripePriceId: priceId,
          subscriptionEndsAt: currentPeriodEnd,
        },
      });

      console.log(
        `✅ Successfully updated client ${client.id} subscription status to ${status}`,
      );
    } catch (error: any) {
      console.error("Error in handleSubscriptionCreated:", {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  },

  async handleSubscriptionUpdated(subscription: any) {
    await this.handleSubscriptionCreated(subscription);
  },

  async handleSubscriptionDeleted(subscription: any) {
    const customerId = subscription.customer;

    const client = await prisma.client.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (!client) return;

    await prisma.client.update({
      where: { id: client.id },
      data: {
        subscriptionStatus: "CANCELED",
        subscriptionDuration: null,
        stripeSubscriptionId: null,
        subscriptionEndsAt: new Date(),
      },
    });
  },
};

// Helper function to create or get Stripe price
async function createOrGetPrice(
  interval: "month" | "year",
  amount: number,
): Promise<string> {
  try {
    // Try to find existing product
    const products = await stripe.products.list({
      limit: 1,
    });

    let productId: string;

    if (products.data.length === 0) {
      // Create product if it doesn't exist
      const product = await stripe.products.create({
        name: "Configurator Subscription",
        description: "Product configurator platform subscription",
      });
      productId = product.id;
    } else {
      productId = products.data[0].id;
    }

    // Create price
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: amount,
      currency: "eur",
      recurring: {
        interval: interval,
      },
    });

    return price.id;
  } catch (error) {
    console.error("Failed to create price:", error);
    // Fallback to dummy price IDs
    return interval === "month" ? "price_monthly" : "price_yearly";
  }
}
