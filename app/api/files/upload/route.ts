// File upload routes (Azure Blob Storage)
// Supports both session-based auth and external app token auth

export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { authenticateRequestDual } from "@/src/middleware/auth";
import { FileService } from "@/src/services/file.service";
import { success, fail, created } from "@/src/lib/response";

export async function POST(request: NextRequest) {
  try {
    // Support both session auth and token auth
    const formData = await request.formData();
    const tokenFromBody = formData.get("token") as string | null;

    const client = await authenticateRequestDual(
      request,
      tokenFromBody || undefined
    );

    const file = formData.get("file") as File;
    if (!file) {
      return fail("File is required", "VALIDATION_ERROR");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadedFile = await FileService.upload(client.id, {
      buffer,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
    });

    return created(uploadedFile, "File uploaded");
  } catch (error: any) {
    return fail(error.message, "UPLOAD_ERROR", 500);
  }
}

// Get signed upload URL for direct Azure upload
// Supports both session auth and token auth
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract token from query params if provided
    const tokenFromQuery = searchParams.get("token");

    const client = await authenticateRequestDual(
      request,
      tokenFromQuery || undefined
    );

    const filename = searchParams.get("filename");
    const contentType = searchParams.get("contentType");

    if (!filename || !contentType) {
      return fail("Filename and content type are required", "VALIDATION_ERROR");
    }

    const signedUrl = await FileService.getSignedUploadUrl(
      client.id,
      filename,
      contentType
    );

    return success(signedUrl);
  } catch (error: any) {
    return fail(error.message, "SIGNED_URL_ERROR", 500);
  }
}
