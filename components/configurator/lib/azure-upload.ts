/**
 * Azure Blob Storage upload utilities
 * Reusable upload logic for direct client-side uploads
 */

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadProgress {
  progress: number;
  stage: "preparing" | "requesting" | "uploading" | "complete";
}

/**
 * Upload a file directly to Azure Blob Storage
 * Uses a two-step process:
 * 1. Get signed URL from backend
 * 2. Upload file directly to Azure
 */
export async function uploadToAzureBlob(
  file: File,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  try {
    // Stage 1: Preparing
    onProgress?.({ progress: 10, stage: "preparing" });

    // Validate file
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Invalid file type. Please upload an image.",
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "File too large. Please upload an image smaller than 5MB.",
      };
    }

    // Stage 2: Requesting signed URL
    onProgress?.({ progress: 20, stage: "requesting" });

    const params = new URLSearchParams({
      filename: file.name,
      contentType: file.type,
    });

    const response = await fetch(`/api/files/upload?${params.toString()}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to get upload URL");
    }

    const { uploadUrl, fileUrl } = data.data;

    onProgress?.({ progress: 40, stage: "uploading" });

    // Stage 3: Upload directly to Azure Blob Storage
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      // Check if it's a CORS error
      if (uploadResponse.status === 0 || uploadResponse.type === "opaque") {
        throw new Error(
          "CORS error: Unable to upload to Azure Blob Storage. Please contact support to configure CORS settings.",
        );
      }

      // Handle 403 Forbidden specifically
      if (uploadResponse.status === 403) {
        const errorText = await uploadResponse.text();
        if (errorText.includes("CORS")) {
          throw new Error(
            "Azure CORS not configured. Please contact your administrator to enable CORS for Azure Blob Storage.",
          );
        }
        throw new Error(
          `Upload forbidden (403): ${errorText || uploadResponse.statusText}`,
        );
      }

      throw new Error(
        `Azure upload failed (${uploadResponse.status}): ${uploadResponse.statusText}`,
      );
    }

    // Stage 4: Complete
    onProgress?.({ progress: 100, stage: "complete" });

    return {
      success: true,
      url: fileUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Upload failed",
    };
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
