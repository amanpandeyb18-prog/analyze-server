// Email templates for quotations
import { env } from "@/src/config/env";

/**
 * Email template for customer - when they receive a quotation
 */
export function getCustomerQuoteEmailTemplate({
  customerName,
  quoteCode,
  totalPrice,
  currencySymbol,
  configuratorName,
  quoteLink,
  companyName,
}: {
  customerName: string;
  quoteCode: string;
  totalPrice: string;
  currencySymbol: string;
  configuratorName: string;
  quoteLink: string;
  companyName?: string;
}) {
  const displayName = customerName || "Valued Customer";
  const fromCompany = companyName || env.APP_NAME || "Our Team";

  return {
    subject: `Your Quote is Ready - ${quoteCode}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Quote is Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                🎉 Your Quote is Ready!
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello <strong>${displayName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in <strong>${configuratorName}</strong>. We're excited to share your personalized quotation with you!
              </p>
              
              <!-- Quote Details Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 20px; color: #4F46E5; font-size: 20px; font-weight: 600;">
                      Quote Details
                    </h2>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">Quote Code:</td>
                        <td style="padding: 8px 0; text-align: right;">
                          <strong style="color: #333333; font-size: 14px; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 4px 8px; border-radius: 4px; border: 1px solid #e9ecef;">
                            ${quoteCode}
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">Product:</td>
                        <td style="padding: 8px 0; text-align: right;">
                          <strong style="color: #333333; font-size: 14px;">${configuratorName}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 0; color: #666666; font-size: 16px; border-top: 2px solid #e9ecef;">Total Price:</td>
                        <td style="padding: 12px 0 0; text-align: right; border-top: 2px solid #e9ecef;">
                          <strong style="color: #10b981; font-size: 24px;">${currencySymbol}${totalPrice}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${quoteLink}" style="display: inline-block; padding: 16px 40px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);">
                      View Full Quote Details
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                If you have any questions or would like to discuss this quotation, please don't hesitate to reach out to us. We're here to help!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                Best regards,<br>
                <strong>${fromCompany}</strong>
              </p>
              <p style="margin: 10px 0 0; color: #999999; font-size: 12px;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };
}

/**
 * Email template for user/client - confirmation that quotation was created
 */
export function getUserQuoteConfirmationTemplate({
  userName,
  customerName,
  customerEmail,
  quoteCode,
  totalPrice,
  currencySymbol,
  configuratorName,
  dashboardLink,
}: {
  userName: string;
  customerName?: string;
  customerEmail: string;
  quoteCode: string;
  totalPrice: string;
  currencySymbol: string;
  configuratorName: string;
  dashboardLink: string;
}) {
  const displayUserName = userName || "Team Member";
  const displayCustomerName = customerName || "Customer";

  return {
    subject: `New Quote Created - ${quoteCode}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote Created Successfully</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                ✅ Quote Created Successfully
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello <strong>${displayUserName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                A new quotation has been successfully created and sent to your customer. Here are the details:
              </p>
              
              <!-- Quote Summary Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 20px; color: #10b981; font-size: 20px; font-weight: 600;">
                      Quote Summary
                    </h2>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">Quote Code:</td>
                        <td style="padding: 8px 0; text-align: right;">
                          <strong style="color: #333333; font-size: 14px; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 4px 8px; border-radius: 4px; border: 1px solid #e9ecef;">
                            ${quoteCode}
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">Configurator:</td>
                        <td style="padding: 8px 0; text-align: right;">
                          <strong style="color: #333333; font-size: 14px;">${configuratorName}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">Customer:</td>
                        <td style="padding: 8px 0; text-align: right;">
                          <strong style="color: #333333; font-size: 14px;">${displayCustomerName}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">Customer Email:</td>
                        <td style="padding: 8px 0; text-align: right;">
                          <span style="color: #4F46E5; font-size: 14px;">${customerEmail}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 0; color: #666666; font-size: 16px; border-top: 2px solid #e9ecef;">Total Amount:</td>
                        <td style="padding: 12px 0 0; text-align: right; border-top: 2px solid #e9ecef;">
                          <strong style="color: #10b981; font-size: 24px;">${currencySymbol}${totalPrice}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Status Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #dbeafe; border-radius: 6px; border-left: 4px solid #3b82f6;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                      <strong>📧 Email Status:</strong> The quotation email has been sent to <strong>${customerEmail}</strong>
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${dashboardLink}" style="display: inline-block; padding: 16px 40px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                      View in Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                You can track this quote's status and manage it from your dashboard.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                This is an automated notification from ${env.APP_NAME || "KONFIGRA"}
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };
}
