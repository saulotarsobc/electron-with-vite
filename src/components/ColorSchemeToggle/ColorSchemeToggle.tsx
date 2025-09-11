import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";

/**
 * Toggle button for switching between light and dark themes
 * Uses Mantine's color scheme system to handle theme changes
 */
export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  /**
   * Toggles between light and dark color schemes
   */
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  return (
    <ActionIcon
      onClick={toggleColorScheme}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
      title={`Switch to ${
        computedColorScheme === "dark" ? "light" : "dark"
      } theme`}
    >
      <span style={{ fontSize: "1.2rem" }}>
        {computedColorScheme === "dark" ? "☀️" : "🌙"}
      </span>
    </ActionIcon>
  );
}
