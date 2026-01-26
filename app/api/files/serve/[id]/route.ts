// Serve files with on-demand SAS token generation
// This endpoint generates fresh SAS tokens, so URLs never expire

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { generateBlobSasUrl } from "@/lib/azure-blob";
import { fail } from "@/src/lib/response";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get file record from database
    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      return fail("File not found", "NOT_FOUND", 404);
    }

    // Generate fresh SAS token (valid for 1 hour)
    const sasUrl = generateBlobSasUrl(file.key, 60);

    // Redirect to the blob URL with SAS token
    return NextResponse.redirect(sasUrl);
  } catch (error: any) {
    console.error("Error serving file:", error);
    return fail(error.message, "FILE_SERVE_ERROR", 500);
  }
}
