import { Theme } from "@/components/configurator/types/theme";

/**
 * Default blue theme for configurator
 * Used when no theme is assigned or API fails
 */
export const DEFAULT_BLUE_THEME: Theme = {
  id: "default",
  clientId: "",
  name: "Default Blue Theme",
  primaryColor: "#3b82f6", // Blue color (Tailwind blue-500)
  secondaryColor: "#8b5cf6",
  accentColor: "#06b6d4",
  backgroundColor: "#ffffff",
  surfaceColor: "#f9fafb",
  textColor: "#111827",
  textColorMode: "AUTO",
  fontFamily: "Inter, sans-serif",
  borderRadius: "0.5rem",
  spacingUnit: "1rem",
  maxWidth: "1200px",
  isActive: true,
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Convert hex color to HSL format
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    // Return default blue HSL if invalid
    return { h: 217, s: 91, l: 60 };
  }

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Parse HSL string format "220 70% 50%"
 */
export function parseHSLString(hslString: string): {
  h: number;
  s: number;
  l: number;
} {
  const parts = hslString.trim().split(/\s+/);
  if (parts.length === 3) {
    const h = parseInt(parts[0]);
    const s = parseInt(parts[1].replace("%", ""));
    const l = parseInt(parts[2].replace("%", ""));

    if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
      return { h, s, l };
    }
  }

  // Default to blue if parsing fails
  return { h: 217, s: 91, l: 60 };
}

/**
 * Get HSL values from a color (supports hex and HSL string formats)
 */
export function getHSLFromColor(color: string): {
  h: number;
  s: number;
  l: number;
} {
  if (color.startsWith("#")) {
    return hexToHSL(color);
  }
  return parseHSLString(color);
}

/**
 * Calculate appropriate text color based on background color and mode
 */
export function calculateTextColor(
  primaryColor: string,
  textColorMode: string = "AUTO",
  customTextColor?: string | null,
): string {
  const mode = textColorMode.toUpperCase();

  if (mode === "WHITE") {
    return "0 0% 98%";
  } else if (mode === "BLACK") {
    return "0 0% 10%";
  } else if (mode === "CUSTOM" && customTextColor) {
    const customHSL = hexToHSL(customTextColor);
    return `${customHSL.h} ${customHSL.s}% ${customHSL.l}%`;
  }

  // Auto: contrast-based
  const hsl = getHSLFromColor(primaryColor);
  return `${hsl.h} ${hsl.s}% ${hsl.l > 50 ? 10 : 98}%`;
}

/**
 * Generate CSS custom properties object for theme
 */
export function generateThemeCSSVariables(
  theme: Theme,
): Record<string, string> {
  const hsl = getHSLFromColor(theme.primaryColor);
  const primaryHSL = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
  const foregroundHSL = calculateTextColor(
    theme.primaryColor,
    theme.textColorMode,
    theme.customTextColor,
  );

  return {
    "--primary": primaryHSL,
    "--primary-foreground": foregroundHSL,
    "--ring": primaryHSL,
    "--accent": `${hsl.h} ${Math.min(hsl.s, 100)}% 97%`,
    "--accent-foreground": primaryHSL,
  };
}
