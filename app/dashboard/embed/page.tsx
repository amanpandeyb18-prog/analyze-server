"use client";

import { useEffect, useState } from "react";
import { DashboardLoading } from "@/components/dashboard-loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Code,
  Copy,
  CheckCircle2,
  ExternalLink,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { ApiResponse } from "@/src/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  generateEmbedPreviewUrl,
  generateAdminConfiguratorUrl,
} from "@/src/config/embed";
import { env } from "@/src/config/env";

interface ClientInfo {
  publicKey: string;
  apiKey: string;
  domain: string | null;
}

interface Configurator {
  id: string;
  name: string;
  description?: string;
  publicId: string;
}

type FrameworkId =
  | "vanilla"
  | "react"
  | "nextjs"
  | "vue-nuxt"
  | "svelte"
  | "wordpress";

const FRAMEWORKS: { id: FrameworkId; label: string; desc: string }[] = [
  { id: "vanilla", label: "Vanilla JS", desc: "Plain script tag for any site" },
  {
    id: "react",
    label: "React",
    desc: "React functional component (useEffect)",
  },
  {
    id: "nextjs",
    label: "Next.js",
    desc: "Next.js client component example (use client)",
  },
  { id: "vue-nuxt", label: "Nuxt / Vue", desc: "Vue 3 / Nuxt 3 (onMounted)" },
  { id: "svelte", label: "Svelte", desc: "Svelte (onMount)" },
  {
    id: "wordpress",
    label: "WordPress",
    desc: "Script tag + shortcode example",
  },
];

function escapeForHtmlAttr(s: string) {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/**
 * All framework snippets now use the single embed CDN script:
 *   https://cdn.konfigra.com/embed.js
 *
 * Each snippet ensures the script is loaded (avoiding duplicate inserts)
 * and then calls window.Konfigra.render(...) when ready.
 */
function generateFrameworkSnippet(
  framework: FrameworkId,
  publicKey: string,
  publicId: string,
  name = "",
) {
  const pk = escapeForHtmlAttr(publicKey || "");
  const id = escapeForHtmlAttr(publicId || "");
  const safeName = name ? name.replace(/"/g, '\\"') : "";

  // Common loader that checks for an existing script and renders once loaded.
  // For snippets that accept an element, we pass an element selector or element ref.
  switch (framework) {
    case "vanilla":
      return `<!-- Konfigra Embed (Vanilla JS) -->
<div id="konfigra-root-${id}"></div>
<script>
(function () {
  function init() {
    if (window.Konfigra && typeof window.Konfigra.render === "function") {
      window.Konfigra.render({
        element: "#konfigra-root-${id}",
        publicKey: "${pk}",
        configId: "${id}"
      });
    }
  }

  if (!document.getElementById("konfigra-embed-script")) {
    var s = document.createElement("script");
    s.id = "konfigra-embed-script";
    s.src = "https://cdn.konfigra.com/embed.js";
    s.async = true;
    s.onload = init;
    document.head.appendChild(s);
  } else {
    init();
  }
})();
</script>
<!-- End Konfigra Embed -->`;

    case "react":
      return `// React - functional component (uses the same CDN script)
import React, { useEffect, useRef } from "react";

export default function KonfigraEmbed() {
  const mountRef = useRef(null);

  useEffect(() => {
    function init() {
      if (window.Konfigra && typeof window.Konfigra.render === "function") {
        window.Konfigra.render({
          element: mountRef.current,
          publicKey: "${pk}",
          configId: "${id}"
        });
      }
    }

    const existing = document.getElementById("konfigra-embed-script");
    if (!existing) {
      const s = document.createElement("script");
      s.id = "konfigra-embed-script";
      s.src = "https://cdn.konfigra.com/embed.js";
      s.async = true;
      s.onload = init;
      document.head.appendChild(s);
    } else {
      init();
    }

    // optionally cleanup if Konfigra offers an unmount API
    return () => {
      if (mountRef.current && window.Konfigra && typeof window.Konfigra.unmount === "function") {
        try { window.Konfigra.unmount({ element: mountRef.current }); } catch (e) {}
      }
    };
  }, []);

  return <div ref={mountRef} id={"konfigra-root-${id}"} />;
}
`;

    case "nextjs":
      return `// Next.js (app router) - client component
"use client";

import React, { useEffect, useRef } from "react";

export default function KonfigraEmbedClient() {
  const mountRef = useRef(null);

  useEffect(() => {
    function init() {
      if (window.Konfigra && typeof window.Konfigra.render === "function") {
        window.Konfigra.render({
          element: mountRef.current,
          publicKey: "${pk}",
          configId: "${id}"
        });
      }
    }

    const existing = document.getElementById("konfigra-embed-script");
    if (!existing) {
      const s = document.createElement("script");
      s.id = "konfigra-embed-script";
      s.src = "https://cdn.konfigra.com/embed.js";
      s.async = true;
      s.onload = init;
      document.head.appendChild(s);
    } else {
      init();
    }

    return () => {
      if (mountRef.current && window.Konfigra && typeof window.Konfigra.unmount === "function") {
        try { window.Konfigra.unmount({ element: mountRef.current }); } catch (e) {}
      }
    };
  }, []);

  return <div ref={mountRef} id={"konfigra-root-${id}"} />;
}
`;

    case "vue-nuxt":
      return `<!-- Nuxt 3 / Vue 3 -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const mountEl = ref(null);

onMounted(() => {
  function init() {
    if (window.Konfigra && typeof window.Konfigra.render === "function") {
      window.Konfigra.render({
        element: mountEl.value,
        publicKey: "${pk}",
        configId: "${id}"
      });
    }
  }

  const existing = document.getElementById("konfigra-embed-script");
  if (!existing) {
    const s = document.createElement("script");
    s.id = "konfigra-embed-script";
    s.src = "https://cdn.konfigra.com/embed.js";
    s.async = true;
    s.onload = init;
    document.head.appendChild(s);
  } else {
    init();
  }
});

onBeforeUnmount(() => {
  if (mountEl.value && window.Konfigra && typeof window.Konfigra.unmount === "function") {
    try { window.Konfigra.unmount({ element: mountEl.value }); } catch (e) {}
  }
});
</script>

<template>
  <div ref="mountEl" id="konfigra-root-${id}"></div>
</template>
`;

    case "svelte":
      return `<!-- Svelte -->
<script>
  import { onMount, onDestroy } from "svelte";
  let mountEl;

  function init() {
    if (window.Konfigra && typeof window.Konfigra.render === "function") {
      window.Konfigra.render({
        element: mountEl,
        publicKey: "${pk}",
        configId: "${id}"
      });
    }
  }

  onMount(() => {
    const existing = document.getElementById("konfigra-embed-script");
    if (!existing) {
      const s = document.createElement("script");
      s.id = "konfigra-embed-script";
      s.src = "https://cdn.konfigra.com/embed.js";
      s.async = true;
      s.onload = init;
      document.head.appendChild(s);
    } else {
      init();
    }
  });

  onDestroy(() => {
    if (mountEl && window.Konfigra && typeof window.Konfigra.unmount === "function") {
      try { window.Konfigra.unmount({ element: mountEl }); } catch (e) {}
    }
  });
</script>

<div bind:this={mountEl} id="konfigra-root-${id}"></div>
`;

    case "wordpress":
      return `<!-- WordPress: script tag -->
<div id="konfigra-root-${id}"></div>
<script>
  (function () {
    function init() {
      if (window.Konfigra && typeof window.Konfigra.render === "function") {
        window.Konfigra.render({
          element: "#konfigra-root-${id}",
          publicKey: "${pk}",
          configId: "${id}"
        });
      }
    }

    if (!document.getElementById("konfigra-embed-script")) {
      var s = document.createElement("script");
      s.id = "konfigra-embed-script";
      s.src = "https://cdn.konfigra.com/embed.js";
      s.async = true;
      s.onload = init;
      document.head.appendChild(s);
    } else {
      init();
    }
  })();
</script>

<!-- WordPress: shortcode example (functions.php)
Add:

function konfigra_shortcode($atts) {
  $a = shortcode_atts(array(
    'id' => '',
    'public_key' => '',
  ), $atts);
  return '<div id="konfigra-root-'.esc_attr($a['id']).'"></div>
  <script>
    (function(){
      function init(){
        if(window.Konfigra && typeof window.Konfigra.render === "function"){
          window.Konfigra.render({ element: "#konfigra-root-'.esc_attr($a['id']).'", publicKey: "'.esc_attr($a['public_key']).'", configId: "'.esc_attr($a['id']).'" });
        }
      }
      if(!document.getElementById("konfigra-embed-script")){
        var s = document.createElement("script");
        s.id = "konfigra-embed-script";
        s.src = "https://cdn.konfigra.com/embed.js";
        s.async = true;
        s.onload = init;
        document.head.appendChild(s);
      } else {
        init();
      }
    })();
  <\/script>';
}
add_shortcode("konfigra", "konfigra_shortcode");

Use in editor: [konfigra id="${id}" public_key="${pk}"]
-->
`;
    default:
      return `<!-- fallback -->\n${generateFrameworkSnippet("vanilla", publicKey, publicId, name)}`;
  }
}

export default function EmbedPage() {
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [configurators, setConfigurators] = useState<Configurator[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [expandedFrameworks, setExpandedFrameworks] = useState<
    Record<string, FrameworkId>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, listRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/configurator/list"),
        ]);

        if (clientRes.ok) {
          const result: ApiResponse = await clientRes.json();
          if (result.success && result.data) {
            setClient({
              publicKey: result.data?.publicKey || "",
              apiKey: result.data?.apiKey || "",
              domain: result.data?.domain || null,
            });
          }
        }

        if (listRes.ok) {
          const listJson: ApiResponse = await listRes.json();
          const data = listJson?.data || [];
          setConfigurators(data);

          // auto-expand if <3
          if (data.length && data.length < 3) {
            setExpandedIds(new Set(data.map((cfg: any) => cfg.id)));
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const setFrameworkFor = (id: string, fw: FrameworkId) => {
    setExpandedFrameworks((prev) => ({ ...(prev || {}), [id]: fw }));
  };

  const copyCode = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Embed script copied");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("copy failed", err);
      toast.error("Copy failed");
    }
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Embed Script</h1>
      <p className="text-muted-foreground mb-8">
        Integrate your configurators into any website. Choose a framework per
        configurator to get a tailored snippet (all snippets use the same CDN
        script).
      </p>

      <div className="grid gap-6 max-w-4xl">
        {/* Configurators */}
        {configurators.map((cfg) => {
          const expanded = expandedIds.has(cfg.id);
          const selectedFramework: FrameworkId =
            expandedFrameworks[cfg.id] || "vanilla";

          // fallback text if no public key
          const pk = client?.publicKey || "";

          const snippet = generateFrameworkSnippet(
            selectedFramework,
            pk,
            cfg.publicId,
            cfg.name,
          );

          return (
            <Card key={cfg.id}>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>{cfg.name}</CardTitle>
                  <CardDescription>
                    {cfg.description || "No description provided."}
                  </CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        generateEmbedPreviewUrl(
                          client?.publicKey || "",
                          cfg.publicId,
                        ),
                        "_blank",
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      window.open(
                        generateAdminConfiguratorUrl(cfg.publicId),
                        "_blank",
                      )
                    }
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleExpand(cfg.id)}
                  >
                    {expanded ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>
              </CardHeader>

              {expanded && (
                <CardContent className="relative space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {FRAMEWORKS.map((fw) => (
                      <button
                        key={fw.id}
                        onClick={() => setFrameworkFor(cfg.id, fw.id)}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          selectedFramework === fw.id
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-transparent hover:bg-muted"
                        }`}
                      >
                        {fw.label}
                      </button>
                    ))}
                    <div className="ml-auto text-xs text-muted-foreground">
                      Selected:{" "}
                      <strong>
                        {
                          FRAMEWORKS.find((f) => f.id === selectedFramework)
                            ?.label
                        }
                      </strong>
                    </div>
                  </div>

                  <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs font-mono">
                    {snippet}
                  </pre>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyCode(snippet, cfg.id)}
                    >
                      {copiedId === cfg.id ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        window.open(
                          generateEmbedPreviewUrl(
                            client?.publicKey || "",
                            cfg.publicId,
                          ),
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open Preview
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Your unique identifiers for API access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Public Key</label>
              <div className="flex gap-2 mt-1">
                <code className="flex-1 p-3 bg-muted rounded-md text-sm break-all">
                  {client?.publicKey || "Not available"}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(client?.publicKey || "");
                    toast.success("Public key copied");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">API Key (Secret)</label>
              <div className="flex gap-2 mt-1">
                <code className="flex-1 p-3 bg-muted rounded-md text-sm break-all">
                  {client?.apiKey || "Not available"}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(client?.apiKey || "");
                    toast.success("API key copied");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep this secret. Use only for backend API calls.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Learn more about embedding and customization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-sm">Embedding Guide</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Step-by-step instructions for adding the configurator to your
                  site
                </p>
              </div>
              <Button size="sm" variant="ghost" asChild>
                <a href="/docs/embedding" target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-sm">API Reference</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Complete API documentation for advanced integrations
                </p>
              </div>
              <Button size="sm" variant="ghost" asChild>
                <a href="/docs/api" target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-sm">Customization Options</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Learn how to customize colors, fonts, and behavior
                </p>
              </div>
              <Button size="sm" variant="ghost" asChild>
                <a href="/docs/customization" target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
