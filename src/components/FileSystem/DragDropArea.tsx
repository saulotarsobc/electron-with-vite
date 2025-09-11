import { useDragAndDrop } from "@/hooks";
import { Paper, ScrollArea, Table, Text } from "@mantine/core";

interface DragDropAreaProps {
  className?: string;
}

/**
 * Component for drag and drop file handling
 * Displays a drop zone and shows metadata for dropped files
 */
export function DragDropArea({ className }: DragDropAreaProps) {
  const {
    dragOver,
    droppedFiles,
    dropInfo,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop();

  return (
    <Paper
      className={className}
      p="md"
      radius="md"
      withBorder
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        borderStyle: "dashed",
        borderColor: dragOver ? "var(--mantine-color-blue-5)" : undefined,
        background: dragOver
          ? "var(--mantine-color-blue-light)"
          : "transparent",
        transition: "all 150ms ease",
        cursor: "pointer",
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

      {droppedFiles.length > 0 && (
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
              {droppedFiles.map((file, index) => (
                <Table.Tr key={`${file.path}-${index}`}>
                  <Table.Td
                    style={{
                      maxWidth: 260,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={file.path}
                  >
                    {file.path}
                  </Table.Td>
                  <Table.Td ta="right">
                    {(file.size / 1024).toFixed(1)}
                  </Table.Td>
                  <Table.Td ta="right">
                    {new Date(file.mtimeMs).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td ta="center">{file.isDir ? "📁" : "📄"}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </Paper>
  );
}
