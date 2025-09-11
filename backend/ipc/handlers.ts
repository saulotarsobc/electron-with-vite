import { BrowserWindow, dialog, ipcMain, nativeTheme } from "electron";
import { readFile as readFileAsync, stat as statAsync } from "node:fs/promises";

/**
 * Registers all IPC handlers for the application
 */
export function registerIpcHandlers(mainWindow: BrowserWindow | null) {
  /**
   * File system: Open file dialog
   */
  ipcMain.handle("fs:open-file", async (_event, args) => {
    try {
      const result = await dialog.showOpenDialog(mainWindow!, {
        properties: [args?.multiple ? "multiSelections" : "openFile"],
        filters: args?.filters,
      });
      return {
        success: true,
        data: { cancelled: result.canceled, filePaths: result.filePaths },
      };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  /**
   * File system: Read file content
   */
  ipcMain.handle("fs:read-file", async (_event, args) => {
    try {
      const content = await readFileAsync(args.path, "utf-8");
      return { success: true, data: { path: args.path, content } };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  /**
   * File system: Get file statistics for multiple files
   */
  ipcMain.handle("fs:stat-files", async (_event, args) => {
    try {
      const paths: string[] = Array.isArray(args?.paths)
        ? args.paths.slice(0, 50) // Limit to 50 files for performance
        : [];

      const files = [] as Array<{
        path: string;
        size: number;
        mtimeMs: number;
        isDir: boolean;
      }>;

      for (const filePath of paths) {
        try {
          const stats = await statAsync(filePath);
          files.push({
            path: filePath,
            size: stats.size,
            mtimeMs: stats.mtimeMs,
            isDir: stats.isDirectory(),
          });
        } catch (e) {
          // Ignore individual file errors and continue with others
          console.warn(`Failed to get stats for ${filePath}:`, e);
        }
      }

      return { success: true, data: { files } };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  /**
   * Theme: Get current theme information
   */
  ipcMain.handle("theme:get", async () => {
    const theme =
      nativeTheme.themeSource === "system"
        ? "system"
        : nativeTheme.shouldUseDarkColors
        ? "dark"
        : "light";
    return { success: true, data: { theme } };
  });
}
