export let parentOrigin: string | null = null;

// Use current origin as fallback (works for both embedded and native contexts)
function setFallbackParentOrigin() {
  if (parentOrigin) return;
  
  // In Next.js context, always use current origin
  if (typeof window !== "undefined") {
    parentOrigin = window.location.origin;
  }
}

// Listen for parent → iframe handshake (for embedded mode only)
if (typeof window !== "undefined") {
  window.addEventListener("message", (event) => {
    if (event.data?.type === "KONFIGRA_PARENT_ORIGIN") {
      parentOrigin = event.data.origin;
      return;
    }

    // If no handshake message, use current origin
    setFallbackParentOrigin();
  });

  // Also run once on load
  setFallbackParentOrigin();
}
