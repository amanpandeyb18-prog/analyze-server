"use client";

import React, { useMemo, useEffect } from "react";
import { Theme } from "@/components/configurator/types/theme";
import {
  DEFAULT_BLUE_THEME,
  generateThemeCSSVariables,
} from "./themeConstants";
import "./configurator-theme-core.css";

interface ConfiguratorThemeProviderProps {
  theme?: Theme | null;
  children: React.ReactNode;
}

/**
 * ConfiguratorThemeProvider
 *
 * Complete theme isolation for the configurator.
 *
 * Architecture:
 * - Single .configurator-root boundary
 * - Uses --cfg-* prefixed CSS variables
 * - Overrides Tailwind utilities within scope
 * - Independent from Next.js app theme
 * - Database-driven with blue fallback
 *
 * Features:
 * - Always provides a valid theme (falls back to default blue)
 * - Applies CSS variables via inline styles
 * - Self-contained theme scope
 * - Supports HSL and hex color formats
 */
export function ConfiguratorThemeProvider({
  theme,
  children,
}: ConfiguratorThemeProviderProps) {
  // Ensure we always have a valid theme
  const activeTheme = useMemo(() => {
    if (theme !== null && theme !== undefined) {
      console.log(
        "[Configurator Theme] Using theme from database:",
        theme.name,
      );
      return theme;
    }
    // Fall back to default blue theme
    console.log(
      "[Configurator Theme] No theme provided, using default blue theme",
    );
    return DEFAULT_BLUE_THEME;
  }, [theme]);

  // Generate --cfg-* prefixed CSS variables from theme
  const cssVariables = useMemo(() => {
    const vars = generateThemeCSSVariables(activeTheme);
    console.log("[Configurator Theme] Generated CSS variables:", {
      primary: vars["--cfg-primary"],
      background: vars["--cfg-background"],
      themeName: activeTheme.name,
    });
    return vars;
  }, [activeTheme]);

  // Apply font family if specified
  useEffect(() => {
    if (activeTheme.fontFamily) {
      console.log(
        "[Configurator Theme] Applying font family:",
        activeTheme.fontFamily,
      );
    }
  }, [activeTheme.fontFamily]);

  return (
    <div
      className="configurator-root"
      style={
        {
          ...cssVariables,
          ...(activeTheme.fontFamily && { fontFamily: activeTheme.fontFamily }),
        } as React.CSSProperties
      }
      data-theme-id={activeTheme.id}
      data-theme-name={activeTheme.name}
      data-theme-mode="isolated"
    >
      {children}
    </div>
  );
}
