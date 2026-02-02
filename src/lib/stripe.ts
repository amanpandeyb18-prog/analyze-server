// Stripe client and helpers
import Stripe from "stripe";
import { env } from "@/src/config/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2025-02-24.acacia",
});

export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
}: {
  customerId?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card", "paypal"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

/**
 * Create checkout session with immediate one-time charge + recurring subscription
 * - Immediate charge: €10 for monthly, €100 for yearly
 * - Recurring subscription: €99/month or €999/year
 * - No proration behavior
 */
export async function createCheckoutSessionWithImmediateCharge({
  customerId,
  priceId,
  immediateCharge,
  successUrl,
  cancelUrl,
}: {
  customerId?: string;
  priceId: string;
  immediateCharge: number; // in cents (1000 = €10, 10000 = €100)
  successUrl: string;
  cancelUrl: string;
}) {
  const lineItems = [
    // Recurring subscription item
    {
      price: priceId,
      quantity: 1,
    },
  ];

  // Add one-time immediate charge if specified
  if (immediateCharge > 0) {
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Subscription Setup Fee",
          description: "One-time setup fee for your subscription",
        },
        unit_amount: immediateCharge,
      },
      quantity: 1,
    });
  }

  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card", "paypal"],
    line_items: lineItems,
    subscription_data: {
      proration_behavior: "none", // No proration
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function createCustomer({
  email,
  name,
  metadata,
}: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}) {
  return await stripe.customers.create({
    email,
    name,
    metadata,
  });
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string,
) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function updateSubscription(
  subscriptionId: string,
  priceId: string,
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
  });
}

/**
 * Add a recurring subscription item (for option capacity upgrades)
 * This permanently increases the subscription price
 *
 * IMPORTANT: Uses "none" proration behavior to ensure fixed pricing
 * - No immediate charge when adding capacity
 * - Charge starts from next billing cycle
 * - User pays full €10/month or €100/year from next billing date
 */
export async function addSubscriptionItem(
  subscriptionId: string,
  priceId: string,
  quantity: number = 1,
) {
  return await stripe.subscriptionItems.create({
    subscription: subscriptionId,
    price: priceId,
    quantity,
    proration_behavior: "none", // Fixed price - no proration, starts next billing cycle
  });
}

/**
 * Create or get upgrade price for option capacity (€10/month or €100/year)
 */
export async function getOrCreateUpgradePrice(
  interval: "month" | "year",
  productId?: string,
): Promise<string> {
  const amount = interval === "month" ? 1000 : 10000; // €10/month or €100/year

  try {
    // Use product ID from env if available
    const upgradeProductId = productId || env.STRIPE_UPGRADE_PRODUCT_ID;

    // Try to find existing upgrade price
    if (upgradeProductId) {
      const prices = await stripe.prices.list({
        product: upgradeProductId,
        active: true,
        type: "recurring",
        recurring: { interval },
        limit: 100,
      });

      const existingPrice = prices.data.find(
        (p) => p.unit_amount === amount && p.currency === "eur",
      );

      if (existingPrice) {
        console.log(`Found existing upgrade price: ${existingPrice.id}`);
        return existingPrice.id;
      }
    }

    // Create product if needed
    let finalProductId = upgradeProductId;
    if (!finalProductId) {
      const product = await stripe.products.create({
        name: "Option Capacity Upgrade",
        description: "Add 10 additional options per primary category",
        metadata: {
          type: "OPTION_UPGRADE",
        },
      });
      finalProductId = product.id;
      console.log(`Created upgrade product: ${finalProductId}`);
    }

    // Create new price
    const price = await stripe.prices.create({
      product: finalProductId,
      unit_amount: amount,
      currency: "eur",
      recurring: { interval },
      metadata: {
        type: "OPTION_UPGRADE",
        capacity: "10",
      },
    });

    console.log(`Created upgrade price: ${price.id} (${interval})`);
    return price.id;
  } catch (error) {
    console.error("Failed to create/get upgrade price:", error);
    throw error;
  }
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET || "whsec_dummy",
  );
}
