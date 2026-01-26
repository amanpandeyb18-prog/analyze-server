import { NextRequest, NextResponse } from "next/server";

/**
 * GET /embed/script.js
 * Returns JavaScript embed loader that dynamically injects iframe
 */
export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";

  const script = `
(function() {
  'use strict';
  
  // Get the script tag that loaded this file
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  
  // Read data attributes
  var publicKey = currentScript.getAttribute('data-public-key');
  var configuratorId = currentScript.getAttribute('data-configurator-id');
  var containerId = currentScript.getAttribute('data-container-id') || 'konfigra-configurator';
  
  if (!publicKey || !configuratorId) {
    console.error('[Konfigra] Missing required attributes: data-public-key and data-configurator-id');
    return;
  }
  
  // Create iframe
  var iframe = document.createElement('iframe');
  iframe.src = '${appUrl}/embed/configurator?publicKey=' + encodeURIComponent(publicKey) + '&configuratorId=' + encodeURIComponent(configuratorId);
  iframe.style.width = '100%';
  iframe.style.height = '800px';
  iframe.style.border = 'none';
  iframe.style.display = 'block';
  iframe.setAttribute('allowfullscreen', 'true');
  
  // Find or create container
  var container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    currentScript.parentNode.insertBefore(container, currentScript);
  }
  
  // Inject iframe
  container.appendChild(iframe);
  
  // Handle responsive height via postMessage
  window.addEventListener('message', function(event) {
    if (event.origin !== '${appUrl}') return;
    
    if (event.data.type === 'konfigra-resize' && event.data.height) {
      iframe.style.height = event.data.height + 'px';
    }
  });
})();
`.trim();

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
