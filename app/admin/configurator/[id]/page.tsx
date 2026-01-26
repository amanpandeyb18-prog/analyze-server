"use client";

import "../configurator-isolation.css";
import { use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

// Dynamically import ConfiguratorApp to avoid SSR issues
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminConfiguratorPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/admin/configurator/${id}`);
    }
  }, [status, router, id]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  // Render the full ConfiguratorApp in admin mode
  // NO ThemeProvider wrapper - configurator manages its own theme
  return (
    <div className="konfigra-configurator-root">
      <QueryClientProvider client={queryClient}>
        <ConfiguratorApp
          mode="admin"
          configuratorId={id}
          publicKey={undefined}
          initialData={undefined}
        />
      </QueryClientProvider>
    </div>
  );
}
