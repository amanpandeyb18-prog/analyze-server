// /api/email/send/route.ts
import { NextRequest } from "next/server";
import { authenticateRequest } from "@/src/middleware/auth";
import { sendEmail, renderEmailTemplate } from "@/src/lib/email";
import { EmailTemplateService } from "@/src/services/email-template.service";
import { success, fail } from "@/src/lib/response";

export async function POST(request: NextRequest) {
  try {
    // ✅ REQUIRED for dashboard usage
    await authenticateRequest(request);

    const body = await request.json();
    const { to, subject, html, templateId, variables } = body;

    if (!to) {
      return fail("Recipient email is required", "VALIDATION_ERROR", 400);
    }

    let emailSubject = subject;
    let emailHtml = html;

    // ✅ Template support (optional)
    if (templateId) {
      const template = await EmailTemplateService.getById(templateId);

      if (!template) {
        return fail("Email template not found", "NOT_FOUND", 404);
      }

      emailSubject = renderEmailTemplate(template.subject, variables || {});

      emailHtml = renderEmailTemplate(template.body, variables || {});
    }

    if (!emailSubject || !emailHtml) {
      return fail(
        "Email subject and content are required",
        "VALIDATION_ERROR",
        400
      );
    }

    // 🔥 ACTUAL RESEND CALL
    const result = await sendEmail({
      to,
      subject: emailSubject,
      html: emailHtml,
    });

    if (!result.success) {
      console.error("Resend error:", result.error);
      return fail("Failed to send email", "EMAIL_ERROR", 500);
    }

    return success({ messageId: result.data }, "Email sent successfully");
  } catch (error: any) {
    console.error("Email send route error:", error);
    return fail(error.message || "Email send failed", "EMAIL_ERROR", 500);
  }
}
