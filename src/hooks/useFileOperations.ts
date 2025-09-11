import type {
  FileDialogOptions,
  FileOperationResult,
  OpenedFile,
} from "@/types";
import { useState } from "react";

/**
 * Custom hook for file operations through Electron IPC
 * Provides methods to open and read files with error handling
 */
export function useFileOperations() {
  const [file, setFile] = useState<OpenedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Opens a file dialog and reads the selected file
   */
  const openFile = async (options?: FileDialogOptions) => {
    setError(null);
    setIsLoading(true);

    try {
      const dialogResult: FileOperationResult = await window.api.invoke(
        "fs:open-file",
        {
          multiple: false,
          ...options,
        }
      );

      if (!dialogResult.success) {
        setError(dialogResult.error || "Failed to open file dialog");
        return;
      }

      if (dialogResult.data.cancelled || !dialogResult.data.filePaths?.length) {
        return; // User cancelled
      }

      const filePath = dialogResult.data.filePaths[0];
      const readResult: FileOperationResult = await window.api.invoke(
        "fs:read-file",
        {
          path: filePath,
        }
      );

      if (readResult.success) {
        setFile({
          path: filePath,
          content: readResult.data.content,
        });
      } else {
        setError(readResult.error || "Failed to read file");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clears the current file and any errors
   */
  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return {
    file,
    error,
    isLoading,
    openFile,
    clearFile,
  };
}
