import {
  Anchor,
  Card,
  Code,
  List,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import classes from "./Welcome.module.css";

/**
 * Welcome component displaying project information and features
 * Shows the main title, description, and project capabilities
 */
export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{" "}
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: "pink", to: "yellow" }}
        >
          Electron + Vite
        </Text>
      </Title>

      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Este projeto demonstra a integração entre Electron e Vite com React.
        Experimente as funcionalidades abaixo para explorar as capacidades do
        sistema.
      </Text>

      <Card withBorder radius="md" mt="xl" mx="auto" maw={600}>
        <Title order={4} mb="md">
          Recursos Disponíveis:
        </Title>

        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <ThemeIcon color="teal" size={20} radius="xl">
              ✓
            </ThemeIcon>
          }
        >
          <List.Item>
            <strong>Drag & Drop:</strong> Arraste arquivos para visualizar
            metadados
          </List.Item>
          <List.Item>
            <strong>File Explorer:</strong> Abra e visualize conteúdo de
            arquivos
          </List.Item>
          <List.Item>
            <strong>Theme Toggle:</strong> Alterne entre tema claro e escuro
          </List.Item>
          <List.Item>
            <strong>System Tray:</strong> Aplicação roda em background
          </List.Item>
        </List>

        <Code block mt="lg" ta="center" style={{ fontFamily: "monospace" }}>
          Construído com: React + TypeScript + Mantine + Electron
        </Code>

        <Text size="xs" c="dimmed" ta="center" mt="sm">
          Para começar, explore os controles acima ou{" "}
          <Anchor
            href="https://mantine.dev/guides/vite/"
            size="xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            consulte a documentação do Mantine
          </Anchor>
        </Text>
      </Card>
    </>
  );
}
