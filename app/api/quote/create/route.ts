// Create quote
import { NextRequest, NextResponse } from "next/server";
import { QuoteService } from "@/src/services/quote.service";
import { AnalyticsService } from "@/src/services/analytics.service";
import { validatePublicKey } from "@/src/middleware/api-key";
import { success, fail, created } from "@/src/lib/response";
import { addCorsHeaders, handleCors } from "@/src/lib/cors";
import { validate } from "@/src/utils/validation";
import { sendEmail } from "@/src/lib/email";
import {
  getCustomerQuoteEmailTemplate,
  getUserQuoteConfirmationTemplate,
} from "@/src/lib/email-templates";
import { prisma } from "@/src/lib/prisma";
import { env } from "@/src/config/env";

export async function POST(request: NextRequest) {
  try {
    // Support both session auth (admin mode) and public key (public mode)
    let client;
    let isAdminMode = false;
    
    // Try session auth first
    try {
      const { verifyAdminSession } = await import("@/src/lib/admin-auth");
      const auth = await verifyAdminSession();
      const { prisma } = await import("@/src/lib/prisma");
      
      const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        include: { client: true },
      });
      
      if (user?.client) {
        client = user.client;
        isAdminMode = true;
      }
    } catch (sessionError) {
      // Session auth failed, try public key
    }
    
    // If no session, validate public key
    if (!client) {
      client = await validatePublicKey(request);
    }

    const body = await request.json();
    const {
      configuratorId,
      customerEmail,
      customerName,
      customerPhone,
      selectedOptions,
      totalPrice,
      configuration,
    } = body;

    const validation = validate([
      {
        field: "customerEmail",
        value: customerEmail,
        rules: ["required", "email"],
      },
      { field: "totalPrice", value: totalPrice, rules: ["required"] },
    ]);

    if (!validation.valid) {
      const response = fail(validation.errors.join(", "), "VALIDATION_ERROR");
      return addCorsHeaders(response, request, ["*"]);
    }

    const quote = await QuoteService.create(client.id, {
      configuratorId,
      customerEmail,
      customerName,
      customerPhone,
      selectedOptions,
      totalPrice: parseFloat(totalPrice),
      configuration,
    });

    // Track analytics event
    await AnalyticsService.trackEvent(client.id, {
      configuratorId,
      eventType: "QUOTE_REQUEST",
      eventName: "Quote Created",
      metadata: { quoteCode: quote.quoteCode },
    });

    // ✅ Send email notifications (async, don't block response)
    sendEmailNotifications(quote, client, configuratorId).catch((error) => {
      console.error("Error sending quote emails:", error);
      // Don't fail the request if email fails
    });

    const response = created(quote, "Quote created");
    return addCorsHeaders(response, request, ["*"]);
  } catch (error: any) {
    const response = fail(
      error.message,
      "CREATE_ERROR",
      error.statusCode || 500
    );
    return addCorsHeaders(response, request, ["*"]);
  }
}

export async function OPTIONS(request: NextRequest) {
  const corsResponse = handleCors(request);
  return corsResponse || new NextResponse(null, { status: 204 });
}

/**
 * Send email notifications to customer and client/user
 */
async function sendEmailNotifications(
  quote: any,
  client: any,
  configuratorId?: string
) {
  try {
    // Get configurator details for better email content
    let configuratorName = "Product Configuration";
    let currency = "USD";
    let currencySymbol = "$";

    if (configuratorId) {
      const configurator = await prisma.configurator.findUnique({
        where: { id: configuratorId },
        select: {
          name: true,
          currency: true,
          currencySymbol: true,
          publicId: true,
        },
      });

      if (configurator) {
        configuratorName = configurator.name;
        currency = configurator.currency;
        currencySymbol = configurator.currencySymbol;
      }
    }

    const quoteLink = `${env.FRONTEND_URL || env.APP_URL}/quote/${quote.quoteCode}`;
    const dashboardLink = `${env.FRONTEND_URL || env.APP_URL}/dashboard`;

    // 1. Send email to CUSTOMER
    const customerEmailTemplate = getCustomerQuoteEmailTemplate({
      customerName: quote.customerName || "Valued Customer",
      quoteCode: quote.quoteCode,
      totalPrice: parseFloat(quote.totalPrice).toFixed(2),
      currencySymbol,
      configuratorName,
      quoteLink,
      companyName: client.companyName,
    });

    const customerEmailResult = await sendEmail({
      to: quote.customerEmail,
      subject: customerEmailTemplate.subject,
      html: customerEmailTemplate.html,
    });

    if (customerEmailResult.success) {
      console.log(
        `✅ Customer email sent successfully to ${quote.customerEmail}`
      );
    } else {
      console.error(
        `❌ Failed to send customer email to ${quote.customerEmail}:`,
        customerEmailResult.error
      );
    }

    // 2. Send confirmation email to CLIENT/USER
    const userEmailTemplate = getUserQuoteConfirmationTemplate({
      userName: client.name || "Team Member",
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      quoteCode: quote.quoteCode,
      totalPrice: parseFloat(quote.totalPrice).toFixed(2),
      currencySymbol,
      configuratorName,
      dashboardLink,
    });

    const userEmailResult = await sendEmail({
      to: client.email,
      subject: userEmailTemplate.subject,
      html: userEmailTemplate.html,
    });

    if (userEmailResult.success) {
      console.log(
        `✅ User confirmation email sent successfully to ${client.email}`
      );
    } else {
      console.error(
        `❌ Failed to send user email to ${client.email}:`,
        userEmailResult.error
      );
    }

    return {
      customerEmailSent: customerEmailResult.success,
      userEmailSent: userEmailResult.success,
    };
  } catch (error) {
    console.error("Error in sendEmailNotifications:", error);
    throw error;
  }
}
