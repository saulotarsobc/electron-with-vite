import { useFileOperations } from "@/hooks";
import type { FileDialogOptions } from "@/types";
import { Button, Group, Text, Textarea } from "@mantine/core";

interface FileOpenerProps {
  className?: string;
}

/**
 * Component for opening and displaying file contents
 * Provides a button to open file dialog and displays selected file content
 */
export function FileOpener({ className }: FileOpenerProps) {
  const { file, error, isLoading, openFile } = useFileOperations();

  const handleOpenFile = () => {
    const options: FileDialogOptions = {
      multiple: false,
      // You can add file filters here if needed
      // filters: [{ name: 'Text Files', extensions: ['txt', 'md'] }]
    };
    openFile(options);
  };

  return (
    <div className={className}>
      <Group>
        <Button
          onClick={handleOpenFile}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Opening..." : "Open File"}
        </Button>
        {file && (
          <Text size="sm" c="dimmed" style={{ maxWidth: 400 }} truncate>
            {file.path}
          </Text>
        )}
      </Group>

      {error && (
        <Text c="red" size="sm" mt="xs">
          {error}
        </Text>
      )}

      {file && (
        <Textarea
          value={file.content}
          minRows={12}
          readOnly
          mt="md"
          placeholder="File content will appear here..."
          styles={{
            input: {
              fontFamily: "monospace",
            },
          }}
        />
      )}
    </div>
  );
}
