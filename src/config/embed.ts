// Centralized embed URL configuration
import { env } from "./env";

/**
 * Get the embed base URL
 * This URL is used for all embed script references
 */
export function getEmbedUrl(): string {
  // Client-side: use NEXT_PUBLIC_EMBED_URL
  if (typeof window !== "undefined") {
    return (
      process.env.NEXT_PUBLIC_EMBED_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      window.location.origin
    );
  }

  // Server-side: use env config
  return env.NEXT_PUBLIC_EMBED_URL || env.APP_URL || "http://localhost:3000";
}

/**
 * Generate embed script code for a configurator
 */
export function generateEmbedScript(
  publicKey: string,
  configuratorId: string,
  configuratorName: string,
): string {
  const embedUrl = getEmbedUrl();

  return `<!-- Konfigra Configurator: ${configuratorName} -->
<div id="konfigra-${configuratorId}"></div>

<script 
  src="${embedUrl}/embed/script.js"
  data-public-key="${publicKey}"
  data-configurator-id="${configuratorId}"
  data-container-id="konfigra-${configuratorId}">
</script>`;
}

/**
 * Generate embed preview URL
 */
export function generateEmbedPreviewUrl(
  publicKey: string,
  configuratorId: string,
): string {
  const embedUrl = getEmbedUrl();
  return `${embedUrl}/embed/configurator?publicKey=${publicKey}&configuratorId=${configuratorId}`;
}

/**
 * Generate admin configurator URL
 */
export function generateAdminConfiguratorUrl(publicId: string): string {
  const embedUrl = getEmbedUrl();
  return `${embedUrl}/admin/configurator/${publicId}`;
}

/**
 * Embed configuration constants
 */
export const EMBED_CONFIG = {
  containerIdPrefix: "konfigra-",
  scriptPath: "/embed/script.js",
  previewPath: "/embed/configurator",
  adminPath: "/admin/configurator",
} as const;
