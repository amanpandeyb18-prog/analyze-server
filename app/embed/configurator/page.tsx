"use client";

import "../../admin/configurator/configurator-isolation.css";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Dynamically import ConfiguratorApp
const ConfiguratorApp = dynamic(
  () => import("@/components/configurator/ConfiguratorApp"),
  { ssr: false, loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading configurator...</p>
      </div>
    </div>
  )}
);

function EmbedConfiguratorContent() {
  const searchParams = useSearchParams();
  const publicKey = searchParams.get("publicKey");
  const configuratorId = searchParams.get("configuratorId");

  if (!publicKey || !configuratorId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Missing Parameters</h1>
          <p className="text-gray-600">
            Please provide both publicKey and configuratorId parameters.
          </p>
        </div>
      </div>
    );
  }

  // Render ConfiguratorApp directly in public mode
  // NO ThemeProvider - configurator manages its own theme
  return (
    <div className="konfigra-configurator-root">
      <QueryClientProvider client={queryClient}>
        <ConfiguratorApp
          mode="public"
          configuratorId={configuratorId}
          publicKey={publicKey}
          initialData={undefined}
        />
      </QueryClientProvider>
    </div>
  );
}

export default function EmbedConfiguratorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <EmbedConfiguratorContent />
    </Suspense>
  );
}
