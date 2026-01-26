// Re-export Theme from api.ts for consistency
export type { Theme } from "./api";

export type TextColorMode = "AUTO" | "WHITE" | "BLACK" | "CUSTOM";

export interface PredefinedColor {
  name: string;
  value: string;
}
