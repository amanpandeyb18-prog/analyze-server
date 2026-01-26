"use client";

import React, { useMemo } from "react";
import { Theme } from "@/components/configurator/types/theme";
import {
  DEFAULT_BLUE_THEME,
  generateThemeCSSVariables,
} from "./themeConstants";

interface ConfiguratorThemeProviderProps {
  theme?: Theme | null;
  children: React.ReactNode;
}

/**
 * ConfiguratorThemeProvider
 * 
 * Wraps the configurator UI and applies theme CSS variables
 * in a scoped manner (only affects configurator, not global app).
 * 
 * Features:
 * - Always provides a valid theme (falls back to default blue)
 * - Applies CSS variables via inline styles for reliability
 * - Self-contained theme scope
 */
export function ConfiguratorThemeProvider({
  theme,
  children,
}: ConfiguratorThemeProviderProps) {
  // Ensure we always have a valid theme
  const activeTheme = useMemo(() => {
    if (theme !== null && theme !== undefined) {
      return theme;
    }
    // Fall back to default blue theme
    console.log("No theme provided, using default blue theme");
    return DEFAULT_BLUE_THEME;
  }, [theme]);

  // Generate CSS variables from theme
  const cssVariables = useMemo(() => {
    return generateThemeCSSVariables(activeTheme);
  }, [activeTheme]);

  return (
    <div
      className="configurator-theme-scope"
      style={cssVariables as React.CSSProperties}
      data-theme-id={activeTheme.id}
      data-theme-name={activeTheme.name}
    >
      {children}
    </div>
  );
}
