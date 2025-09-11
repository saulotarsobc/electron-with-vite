import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import { Badge, Group, useMantineColorScheme } from "@mantine/core";

/**
 * Header component displaying current theme and theme toggle
 */
export function ThemeHeader() {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Group justify="space-between">
      <Badge variant="light" size="lg">
        Theme: {colorScheme}
      </Badge>
      <ColorSchemeToggle />
    </Group>
  );
}
