import type { ThemeUpdatePayload } from "@/types";
import { useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";

/**
 * Custom hook for managing theme synchronization with Electron
 * Handles theme updates from the main process and provides theme controls
 */
export function useThemeSync() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    /**
     * Listen for theme updates from Electron main process
     */
    const unsubscribe = window.api.on(
      "theme:updated",
      (payload: ThemeUpdatePayload) => {
        if (payload.action === "toggle") {
          setColorScheme(colorScheme === "dark" ? "light" : "dark");
        } else if (payload.theme) {
          setColorScheme(payload.theme);
        }
      }
    );

    return unsubscribe;
  }, [setColorScheme, colorScheme]);

  return {
    colorScheme,
    setColorScheme,
  };
}
