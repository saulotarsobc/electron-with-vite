import { DragDropArea, FileOpener, ThemeHeader } from "@/components/FileSystem";
import { AppMenu } from "@/components/Navigation";
import { Welcome } from "@/components/Welcome/Welcome";
import { Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";

/**
 * Home page component showcasing file operations and drag & drop functionality
 */
export function HomePage() {
  return (
    <Container size="lg" py="xl">
      <Group mb="xl">
        <IconHome size={32} />
        <Title order={1}>Home</Title>
      </Group>

      <Text size="lg" c="dimmed" mb="xl">
        Welcome to your Electron + Vite application with multiple pages and
        navigation.
      </Text>

      <Stack gap="xl">
        {/* Menu Demo Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <div>
              <Text fw={500} size="lg">
                Mantine Menu Demo
              </Text>
              <Text size="sm" c="dimmed">
                Example of the menu component as requested from Mantine
                documentation
              </Text>
            </div>
            <AppMenu />
          </Group>
        </Card>

        {/* Theme controls */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={500} size="lg" mb="md">
            Theme Controls
          </Text>
          <ThemeHeader />
        </Card>

        {/* Welcome section */}
        <Welcome />

        {/* File Operations */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={500} size="lg" mb="md">
            File Operations
          </Text>
          <Stack gap="md">
            {/* Drag and drop area */}
            <DragDropArea />

            {/* File opener */}
            <FileOpener />
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
