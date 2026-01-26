// Azure Blob Storage client configuration
import {
  BlobServiceClient,
  ContainerClient,
  BlockBlobClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { env } from "@/src/config/env";

let blobServiceClient: BlobServiceClient;
let containerClient: ContainerClient;

export function getBlobServiceClient(): BlobServiceClient {
  if (!blobServiceClient) {
    blobServiceClient = BlobServiceClient.fromConnectionString(
      env.AZURE_STORAGE_CONNECTION_STRING,
    );
  }
  return blobServiceClient;
}

export function getContainerClient(): ContainerClient {
  if (!containerClient) {
    const blobService = getBlobServiceClient();
    containerClient = blobService.getContainerClient(env.AZURE_CONTAINER_NAME);
  }
  return containerClient;
}

export function getBlockBlobClient(blobName: string): BlockBlobClient {
  const container = getContainerClient();
  return container.getBlockBlobClient(blobName);
}

export async function ensureContainerExists(): Promise<void> {
  try {
    const container = getContainerClient();
    await container.createIfNotExists();
    // Container created with private access (no public access)
    // Files will be accessible via authenticated requests or SAS tokens

    // Set CORS rules for the container
    await configureCORS();
  } catch (error) {
    console.error("Failed to create container:", error);
    throw error;
  }
}

/**
 * Configure CORS rules for Azure Blob Storage
 * This allows direct client-side uploads from browsers
 */
export async function configureCORS(): Promise<void> {
  try {
    const blobService = getBlobServiceClient();

    // Get current service properties
    const properties = await blobService.getProperties();

    // Define CORS rules
    const corsRules = [
      {
        allowedOrigins: "*", // Allow all origins (restrict in production)
        allowedMethods: "GET,PUT,POST,DELETE,HEAD,OPTIONS",
        allowedHeaders: "*",
        exposedHeaders: "*",
        maxAgeInSeconds: 3600,
      },
    ];

    // Update CORS settings
    await blobService.setProperties({
      ...properties,
      cors: corsRules,
    });

    console.log("Azure Blob Storage CORS configured successfully");
  } catch (error) {
    console.error("Failed to configure CORS:", error);
    // Don't throw - CORS configuration failure shouldn't break the app
    // The storage account may already have CORS configured via Azure Portal
  }
}

/**
 * Generate a SAS URL for a blob with read permissions
 * Use this to provide temporary public access to private blobs
 */
export function generateBlobSasUrl(blobName: string, expiresInMinutes: number = 60): string {
  const blockBlobClient = getBlockBlobClient(blobName);
  
  // Extract account name and key from connection string
  const connectionString = env.AZURE_STORAGE_CONNECTION_STRING;
  const accountNameMatch = connectionString.match(/AccountName=([^;]+)/);
  const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/);
  
  if (!accountNameMatch || !accountKeyMatch) {
    throw new Error("Invalid storage connection string");
  }
  
  const accountName = accountNameMatch[1];
  const accountKey = accountKeyMatch[1];
  
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: env.AZURE_CONTAINER_NAME,
      blobName: blobName,
      permissions: BlobSASPermissions.parse("r"), // Read only
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + expiresInMinutes * 60 * 1000),
    },
    sharedKeyCredential
  ).toString();
  
  return `${blockBlobClient.url}?${sasToken}`;
}

export default {
  getBlobServiceClient,
  getContainerClient,
  getBlockBlobClient,
  ensureContainerExists,
  configureCORS,
  generateBlobSasUrl,
};
