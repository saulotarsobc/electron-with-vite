/**
 * Theme related type definitions
 */

export type ColorScheme = "light" | "dark" | "auto";

export interface ThemeUpdatePayload {
  action?: "toggle";
  theme?: ColorScheme;
}
