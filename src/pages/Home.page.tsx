import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import { Welcome } from "@/components/Welcome/Welcome";
import {
  Badge,
  Button,
  Group,
  Paper,
  ScrollArea,
  Table,
  Text,
  Textarea,
} from "@mantine/core";
import { useEffect, useState } from "react";

interface OpenedFile {
  path: string;
  content: string;
}

export function HomePage() {
  const [theme, setTheme] = useState<string>("");
  const [file, setFile] = useState<OpenedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dropped, setDropped] = useState<
    Array<{ path: string; size: number; mtimeMs: number; isDir: boolean }>
  >([]);
  const [dragOver, setDragOver] = useState(false);
  const [dropInfo, setDropInfo] = useState<string>("");

  const loadTheme = async () => {
    try {
      const res = await window.api.invoke("theme:get");
      if (res?.data?.theme) setTheme(res.data.theme);
    } catch (e: any) {
      /* ignore */
    }
  };

  const openFile = async () => {
    setError(null);
    const res = await window.api.invoke("fs:open-file", { multiple: false });
    if (res?.success && !res.data.cancelled && res.data.filePaths?.length) {
      const path = res.data.filePaths[0];
      const read = await window.api.invoke("fs:read-file", { path });
      if (read.success) setFile({ path, content: read.data.content });
      else setError(read.error);
    }
  };

  useEffect(() => {
    loadTheme();
    const off = window.api.on("theme:updated", (payload: any) =>
      setTheme(payload.theme)
    );
    // Evita que o navegador tente navegar para o arquivo solto fora da área designada
    const prevent = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return off;
  }, []);

  const onDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const filePaths: string[] = [];
    const files = Array.from(e.dataTransfer.files) as Array<
      File & { path?: string }
    >;
    setDropInfo(`Recebidos ${files.length} arquivos`);
    for (const f of files) {
      if (f.path) filePaths.push(f.path);
    }
    if (!filePaths.length) {
      // Fallback: exibe somente nome e tamanho proveniente da File API
      const pseudo = files.map((f) => ({
        path: f.name + " (sandbox)",
        size: f.size,
        mtimeMs: Date.now(),
        isDir: false,
      }));
      setDropped(pseudo);
      setDropInfo(
        (prev) =>
          prev + " (usando fallback File API – sem acesso a caminho completo)"
      );
      return;
    }
    try {
      const res = await window.api.invoke("fs:stat-files", {
        paths: filePaths,
      });
      if (res.success && res.data?.files) {
        setDropped(res.data.files);
        setDropInfo(`Processados ${res.data.files.length} itens`);
      } else {
        setDropInfo(`Falha ao obter metadados: ${res.error || "desconhecido"}`);
      }
    } catch (err: any) {
      setDropInfo(`Erro: ${err.message}`);
    }
  };

  const dropEvents = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      if (!dragOver) setDragOver(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
    },
    onDrop,
  };

  return (
    <div
      style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}
    >
      <Group justify="space-between">
        <div>
          <Badge>{`Theme: ${theme}`}</Badge>
        </div>
        <ColorSchemeToggle />
      </Group>
      <Welcome />
      <Paper
        p="md"
        radius="md"
        withBorder
        {...dropEvents}
        style={{
          borderStyle: "dashed",
          borderColor: dragOver ? "var(--mantine-color-blue-5)" : undefined,
          background: dragOver
            ? "var(--mantine-color-blue-light)"
            : "transparent",
          transition: "150ms",
        }}
      >
        <Text size="sm" fw={500}>
          Drag & Drop arquivos aqui
        </Text>
        <Text size="xs" c="dimmed">
          Mostra metadados locais (path, tamanho, modificação)
        </Text>
        {dropInfo && (
          <Text size="xs" c="blue" mt={4}>
            {dropInfo}
          </Text>
        )}
        {dropped.length > 0 && (
          <ScrollArea h={180} mt="sm">
            <Table stickyHeader withRowBorders={false} highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Path</Table.Th>
                  <Table.Th ta="right">Size (KB)</Table.Th>
                  <Table.Th ta="right">Modified</Table.Th>
                  <Table.Th ta="center">Dir?</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {dropped.map((f) => (
                  <Table.Tr key={f.path}>
                    <Table.Td
                      style={{
                        maxWidth: 260,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={f.path}
                    >
                      {f.path}
                    </Table.Td>
                    <Table.Td ta="right">{(f.size / 1024).toFixed(1)}</Table.Td>
                    <Table.Td ta="right">
                      {new Date(f.mtimeMs).toLocaleDateString()}
                    </Table.Td>
                    <Table.Td ta="center">{f.isDir ? "📁" : ""}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Paper>
      <Group>
        <Button onClick={openFile}>Open File</Button>
        {file && <Text size="sm">{file.path}</Text>}
      </Group>
      {error && <Text c="red">{error}</Text>}
      {file && <Textarea value={file.content} minRows={12} readOnly />}
    </div>
  );
}
