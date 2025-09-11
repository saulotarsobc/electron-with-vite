/**
 * File system related type definitions
 */

export interface OpenedFile {
  path: string;
  content: string;
}

export interface FileMetadata {
  path: string;
  size: number;
  mtimeMs: number;
  isDir: boolean;
}

export interface FileDialogOptions {
  multiple?: boolean;
  filters?: Array<{
    name: string;
    extensions: string[];
  }>;
}

export interface FileOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
