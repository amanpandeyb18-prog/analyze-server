import { useQuery } from "@tanstack/react-query";
import { configuratorService } from "@/components/configurator/services/configuratorService";
import { Configurator, Category } from "@/components/configurator/types/api";
import { getErrorMessage } from "@/components/configurator/lib/api-client";

interface ConfiguratorQueryResult {
  categories: Category[];
  configuratorFound: boolean;
  configurator?: Configurator;
  configuratorId?: string;
}

/**
 * Hook to fetch configurator data
 * Supports both public mode (publicId + publicKey) and admin mode (publicId only with session)
 */
export function useConfiguratorData(
  publicId: string | null,
  publicKey: string | null | undefined,
  isAdminMode: boolean = false
) {
  const { data, isLoading, error, refetch } = useQuery<ConfiguratorQueryResult>(
    {
      queryKey: ["configurator", publicId, publicKey, isAdminMode],
      queryFn: async () => {
        if (!publicId) {
          return { categories: [], configuratorFound: false };
        }

        try {
          let response;

          if (isAdminMode) {
            // Admin mode: use session-authenticated endpoint
            response = await fetch(`/api/configurator/admin/${publicId}`, {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch configurator: ${response.statusText}`);
            }

            const jsonData = await response.json();
            
            if (jsonData.success && jsonData.data) {
              return {
                categories: jsonData.data.categories || [],
                configuratorFound: true,
                configurator: jsonData.data,
                configuratorId: jsonData.data.id,
              };
            }
          } else {
            // Public mode: use publicKey
            if (!publicKey) {
              return { categories: [], configuratorFound: false };
            }

            response = await configuratorService.getByPublicId(
              publicId,
              publicKey
            );

            if (response.success && response.data) {
              return {
                categories: response.data.categories || [],
                configuratorFound: true,
                configurator: response.data,
                configuratorId: response.data.id,
              };
            }
          }

          return { categories: [], configuratorFound: false };
        } catch (err) {
          const errorMessage = getErrorMessage(err);
          console.error("[Configurator Data Error]", errorMessage);
          throw err;
        }
      },
      enabled: isAdminMode ? !!publicId : (!!publicId && !!publicKey),
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    }
  );

  return {
    categories: data?.categories ?? [],
    configuratorFound: data?.configuratorFound ?? false,
    configurator: data?.configurator,
    configuratorId: data?.configuratorId,
    isLoading,
    error: error ? getErrorMessage(error) : null,
    refetch,
  };
}
