"use client";

import { ApiResponse } from "@/src/types/api";

export interface ConfiguratorClientOptions {
  mode: "public" | "admin";
  configuratorId: string;
  publicKey?: string;
}

/**
 * Unified client service for fetching configurator data
 * Handles both public and admin modes
 */
export class ConfiguratorClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch configurator data based on mode
   */
  async getConfigurator(
    options: ConfiguratorClientOptions
  ): Promise<ApiResponse> {
    const { mode, configuratorId, publicKey } = options;

    if (mode === "admin") {
      // Admin mode: use session-authenticated endpoint
      const response = await fetch(
        `/api/configurator/admin/${configuratorId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch configurator: ${response.statusText}`);
      }

      return response.json();
    } else {
      // Public mode: use publicKey
      if (!publicKey) {
        throw new Error("Public key is required for public mode");
      }

      const response = await fetch(
        `/api/configurator/${configuratorId}?publicKey=${publicKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Embed-Origin": window.location.origin,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch configurator: ${response.statusText}`);
      }

      return response.json();
    }
  }

  /**
   * Update configurator (admin only)
   */
  async updateConfigurator(data: any): Promise<ApiResponse> {
    const response = await fetch("/api/configurator/update", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update configurator: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete configurator (admin only)
   */
  async deleteConfigurator(configuratorId: string): Promise<ApiResponse> {
    const response = await fetch("/api/configurator/delete", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ configuratorId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete configurator: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create category (admin only)
   */
  async createCategory(data: any): Promise<ApiResponse> {
    const response = await fetch("/api/category/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create category: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update category (admin only)
   */
  async updateCategory(data: any): Promise<ApiResponse> {
    const response = await fetch("/api/category/update", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update category: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create option (admin only)
   */
  async createOption(data: any): Promise<ApiResponse> {
    const response = await fetch("/api/option/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create option: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update option (admin only)
   */
  async updateOption(data: any): Promise<ApiResponse> {
    const response = await fetch("/api/option/update", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update option: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create theme (admin only)
   */
  async createTheme(data: any): Promise<ApiResponse> {
    const response = await fetch("/api/theme/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create theme: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update theme (admin only)
   */
  async updateTheme(data: any): Promise<ApiResponse> {
    const response = await fetch("/api/theme/update", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update theme: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Bulk import (admin only)
   */
  async bulkImport(data: any): Promise<ApiResponse> {
    const response = await fetch("/api/import/bulk-create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to import: ${response.statusText}`);
    }

    return response.json();
  }
}

// Singleton instance
export const configuratorClient = new ConfiguratorClient();
