import { useState, useEffect } from "react";
import { Theme } from "@/components/configurator/types/theme";
import { themeService } from "@/components/configurator/services/themeService";
import { toast } from "@/components/configurator/hooks/use-toast";
import { DEFAULT_BLUE_THEME } from "@/components/configurator/theme/themeConstants";

/**
 * useTheme Hook (Refactored)
 *
 * Manages theme state for the configurator.
 * No longer applies theme directly to DOM - that's handled by ConfiguratorThemeProvider.
 *
 * Features:
 * - Always returns a valid theme (never null)
 * - Handles theme loading from API
 * - Provides update and reset functions
 */
export function useTheme(initialTheme?: Theme | null) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_BLUE_THEME);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, [initialTheme]);

  const loadTheme = async () => {
    setIsLoading(true);
    try {
      let activeTheme: Theme;

      // Priority 1: Use theme from configurator data if provided
      if (initialTheme !== null && initialTheme !== undefined) {
        activeTheme = initialTheme;
        console.log(
          "[Configurator Theme] Using theme from API:",
          activeTheme.name,
        );
      } else {
        // Priority 2: If initialTheme is null (no theme assigned), use default
        if (initialTheme === null) {
          console.log(
            "[Configurator Theme] No theme assigned, using default blue theme",
          );
          activeTheme = DEFAULT_BLUE_THEME;
        } else {
          // Priority 3: Try to fetch active theme from API (for admin mode)
          try {
            activeTheme = await themeService.getActiveTheme();
            console.log(
              "[Configurator Theme] Fetched theme from API:",
              activeTheme.name,
            );
          } catch (error) {
            // Priority 4: Fall back to default blue theme
            console.log(
              "[Configurator Theme] No theme found, using default blue theme",
            );
            activeTheme = DEFAULT_BLUE_THEME;
          }
        }
      }

      setTheme(activeTheme);
    } catch (error) {
      console.error(
        "[Configurator Theme] Failed to load theme, using default:",
        error,
      );
      setTheme(DEFAULT_BLUE_THEME);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTheme = async (updates: Partial<Theme>) => {
    try {
      const updatedTheme = await themeService.saveTheme({
        ...theme,
        ...updates,
      });
      setTheme(updatedTheme);
      toast({
        title: "Theme updated",
        description: "Your theme has been saved successfully.",
      });
      return updatedTheme;
    } catch (error) {
      console.error("[Configurator Theme] Failed to update theme:", error);
      toast({
        title: "Error",
        description: "Failed to save theme.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetTheme = async () => {
    try {
      const defaultTheme = await themeService.resetToDefault();
      setTheme(defaultTheme);
      toast({
        title: "Theme reset",
        description: "Theme has been reset to default.",
      });
      return defaultTheme;
    } catch (error) {
      console.error("[Configurator Theme] Failed to reset theme:", error);
      toast({
        title: "Error",
        description: "Failed to reset theme.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    theme, // Always a valid theme, never null
    isLoading,
    updateTheme,
    resetTheme,
  };
}
