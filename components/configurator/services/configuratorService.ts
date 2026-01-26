import { apiClient } from "@/components/configurator/lib/api-client";
import { parentOrigin } from "@/components/configurator/lib/embed-origin";
import {
  ApiResponse,
  Configurator,
  CreateConfiguratorInput,
  UpdateConfiguratorInput,
  EditToken,
  TokenVerification,
} from "@/components/configurator/types/api";

/**
 * Configurator Service
 * Handles all configurator-related API calls
 */
export const configuratorService = {
  /**
   * Generate edit token for a configurator
   */
  /**
   * Get configurator by public ID (public endpoint)
   * Requires publicKey in query params
   */
  async getByPublicId(
    publicId: string,
    publicKey: string
  ): Promise<ApiResponse<Configurator>> {
    return apiClient.get<Configurator>(
      `/api/configurator/${publicId}?publicKey=${encodeURIComponent(
        publicKey
      )}`,
      {
        headers: {
          "X-Embed-Origin": parentOrigin || window.location.origin,
        },
      }
    );
  },

  /**
   * List all configurators (requires token)
   */
  async list(token: string): Promise<ApiResponse<Configurator[]>> {
    return apiClient.get<Configurator[]>("/api/configurator/list", {
      data: { token },
    });
  },

  /**
   * Create configurator
   */
  async create(
    input: CreateConfiguratorInput
  ): Promise<ApiResponse<Configurator>> {
    return apiClient.post<Configurator>("/api/configurator/create", input);
  },

  /**
   * Update configurator
   */
  async update(
    input: UpdateConfiguratorInput
  ): Promise<ApiResponse<Configurator>> {
    return apiClient.put<Configurator>("/api/configurator/update", input);
  },

  /**
   * Delete configurator (session-based)
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(
      `/api/configurator/delete?id=${encodeURIComponent(id)}`
    );
  },

  /**
   * Duplicate configurator (session-based)
   */
  async duplicate(id: string): Promise<ApiResponse<Configurator>> {
    return apiClient.post<Configurator>("/api/configurator/duplicate", {
      id,
    });
  },
};
