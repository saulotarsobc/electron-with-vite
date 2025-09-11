import type { FileMetadata, FileOperationResult } from "@/types";
import { useEffect, useState } from "react";

/**
 * Custom hook for drag and drop file handling
 * Manages drag state and processes dropped files
 */
export function useDragAndDrop() {
  const [dragOver, setDragOver] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<FileMetadata[]>([]);
  const [dropInfo, setDropInfo] = useState<string>("");

  /**
   * Prevent default browser behavior for drag and drop
   */
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("dragover", preventDefaults);
    window.addEventListener("drop", preventDefaults);

    return () => {
      window.removeEventListener("dragover", preventDefaults);
      window.removeEventListener("drop", preventDefaults);
    };
  }, []);

  /**
   * Handle drag over event
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragOver) setDragOver(true);
  };

  /**
   * Handle drag leave event
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  /**
   * Handle file drop event
   */
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files) as Array<
      File & { path?: string }
    >;
    setDropInfo(`Recebidos ${files.length} arquivos`);

    // Extract file paths
    const filePaths: string[] = [];
    for (const file of files) {
      if (file.path) {
        filePaths.push(file.path);
      }
    }

    // Fallback to File API if no paths available
    if (!filePaths.length) {
      const pseudoFiles = files.map((file) => ({
        path: `${file.name} (sandbox)`,
        size: file.size,
        mtimeMs: Date.now(),
        isDir: false,
      }));

      setDroppedFiles(pseudoFiles);
      setDropInfo(
        (prev) =>
          `${prev} (usando fallback File API – sem acesso a caminho completo)`
      );
      return;
    }

    // Process files through Electron IPC
    try {
      const result: FileOperationResult = await window.api.invoke(
        "fs:stat-files",
        {
          paths: filePaths.slice(0, 50), // Limit to 50 files
        }
      );

      if (result.success && result.data?.files) {
        setDroppedFiles(result.data.files);
        setDropInfo(`Processados ${result.data.files.length} itens`);
      } else {
        setDropInfo(
          `Falha ao obter metadados: ${result.error || "desconhecido"}`
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setDropInfo(`Erro: ${errorMessage}`);
    }
  };

  /**
   * Clear dropped files
   */
  const clearDroppedFiles = () => {
    setDroppedFiles([]);
    setDropInfo("");
  };

  return {
    dragOver,
    droppedFiles,
    dropInfo,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearDroppedFiles,
  };
}
