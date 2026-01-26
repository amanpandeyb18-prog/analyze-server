// File service for Azure Blob Storage uploads
import { getBlockBlobClient, ensureContainerExists, generateBlobSasUrl } from "@/lib/azure-blob";
import {
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { prisma } from "@/src/lib/prisma";
import { env } from "@/src/config/env";
import { NotFoundError } from "@/src/lib/errors";
import type { File as FileModel, FileType } from "@prisma/client";
import { generateId } from "@/src/utils/id";

export const FileService = {
  async upload(
    clientId: string,
    file: {
      buffer: Buffer;
      originalName: string;
      mimeType: string;
      size: number;
    },
  ): Promise<FileModel> {
    await ensureContainerExists();

    const fileId = generateId();
    const ext = file.originalName.split(".").pop();
    const filename = `${fileId}.${ext}`;
    const blobName = `clients/${clientId}/${filename}`;

    const blockBlobClient = getBlockBlobClient(blobName);

    // ✅ safer upload method
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimeType,
      },
    });

    let fileType: FileType = "OTHER";
    if (file.mimeType.startsWith("image/")) fileType = "IMAGE";
    else if (
      file.mimeType === "application/pdf" ||
      file.mimeType.includes("document")
    ) {
      fileType = "DOCUMENT";
    }

    const fileRecord = await prisma.file.create({
      data: {
        clientId,
        filename,
        originalName: file.originalName,
        fileType,
        mimeType: file.mimeType,
        size: file.size,
        key: blobName,
        url: '', // Will be set below
      },
    });

    // Update with API endpoint URL for on-demand SAS token generation
    return await prisma.file.update({
      where: { id: fileRecord.id },
      data: { url: `/api/files/serve/${fileRecord.id}` },
    });
  },

  async list(clientId: string, fileType?: FileType): Promise<FileModel[]> {
    return prisma.file.findMany({
      where: {
        clientId,
        ...(fileType && { fileType }),
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string): Promise<FileModel> {
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) throw new NotFoundError("File");
    return file;
  },

  async delete(id: string): Promise<void> {
    const file = await this.getById(id);

    const blockBlobClient = getBlockBlobClient(file.key);
    await blockBlobClient.deleteIfExists();

    await prisma.file.delete({ where: { id } });
  },

  async getSignedUploadUrl(
    clientId: string,
    filename: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
    await ensureContainerExists();

    const fileId = generateId();
    const blobName = `clients/${clientId}/${fileId}-${filename}`;
    const blockBlobClient = getBlockBlobClient(blobName);

    // ✅ backdate start time to avoid clock skew
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: env.AZURE_CONTAINER_NAME,
        blobName,
        permissions: BlobSASPermissions.parse("rcw"), // Added 'r' for read access
        startsOn: new Date(Date.now() - 5 * 60 * 1000),
        expiresOn: new Date(Date.now() + 60 * 60 * 1000),
        contentType,
      },
      getCredential(),
    ).toString();

    // Create file record in database
    const fileRecord = await prisma.file.create({
      data: {
        clientId,
        filename,
        fileType: "OTHER", // Will be determined by content type
        mimeType: contentType,
        size: 0, // Will be updated after upload
        key: blobName,
        url: '', // Temporary, will be updated below
        originalName: filename,
      },
    });

    // Update with API endpoint URL for on-demand SAS token generation
    await prisma.file.update({
      where: { id: fileRecord.id },
      data: { url: `/api/files/serve/${fileRecord.id}` },
    });

    return {
      uploadUrl: `${blockBlobClient.url}?${sasToken}`,
      fileUrl: `/api/files/serve/${fileRecord.id}`,
      key: blobName,
      fileId: fileRecord.id,
    };
  },
};

function getCredential(): StorageSharedKeyCredential {
  const connectionString = env.AZURE_STORAGE_CONNECTION_STRING;

  const accountNameMatch = connectionString.match(/AccountName=([^;]+)/);
  const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/);

  if (!accountNameMatch || !accountKeyMatch) {
    throw new Error("Invalid Azure Storage connection string");
  }

  return new StorageSharedKeyCredential(
    accountNameMatch[1],
    accountKeyMatch[1],
  );
}
