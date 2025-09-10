import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import { Welcome } from "@/components/Welcome/Welcome";
import { Badge, Button, Group, Text, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";

interface OpenedFile {
  path: string;
  content: string;
}

export function HomePage() {
  const [theme, setTheme] = useState<string>("");
  const [file, setFile] = useState<OpenedFile | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    return off;
  }, []);

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
      <Group>
        <Button onClick={openFile}>Open File</Button>
        {file && <Text size="sm">{file.path}</Text>}
      </Group>
      {error && <Text c="red">{error}</Text>}
      {file && <Textarea value={file.content} minRows={12} readOnly />}
    </div>
  );
}
