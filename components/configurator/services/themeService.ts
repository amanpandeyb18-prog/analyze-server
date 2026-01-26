import { apiClient } from "@/components/configurator/lib/api-client";
import { ApiResponse, Theme } from "@/types/api";

/**
 * Theme Service
 * Handles all theme-related API calls
 * Uses session-based authentication (cookies)
 */
export const themeService = {
  /**
   * Get active theme (uses session auth)
   */
  async getActiveTheme(): Promise<Theme> {
    const response = await apiClient.get<Theme>("/api/theme/active");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error("Failed to load active theme");
  },

  /**
   * Save/update theme (uses session auth)
   */
  async saveTheme(theme: Partial<Theme>): Promise<Theme> {
    const response = await apiClient.put<Theme>("/api/theme/update", theme);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error("Failed to save theme");
  },

  /**
   * Reset to default theme (uses session auth)
   */
  async resetToDefault(): Promise<Theme> {
    const response = await apiClient.post<Theme>("/api/theme/reset");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error("Failed to reset theme");
  },
};
