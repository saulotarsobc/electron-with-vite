import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerIpcHandlers } from "./ipc/handlers";
import { createAppMenu } from "./utils/menu";
import { createTray } from "./windows/trayManager";
import { createMainWindow, createSplashWindow } from "./windows/windowManager";

// === Path Configuration ===
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(
  process.env.APP_ROOT,
  "..",
  "dist",
  "backend"
);
export const RENDERER_DIST = path.join(
  process.env.APP_ROOT,
  "..",
  "dist",
  "frontend"
);

// Public folder path (dev vs production)
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT!, "..", "public")
  : RENDERER_DIST;

// === Application State ===
let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;

/**
 * Initialize the application windows and components
 */
function initializeApp() {
  const preloadPath = path.join(__dirname, "preload.mjs");

  // Create splash window first
  splashWindow = createSplashWindow(
    RENDERER_DIST,
    process.env.VITE_PUBLIC!,
    preloadPath,
    VITE_DEV_SERVER_URL
  );

  // Create main window (hidden initially)
  mainWindow = createMainWindow(
    RENDERER_DIST,
    process.env.VITE_PUBLIC!,
    preloadPath,
    VITE_DEV_SERVER_URL
  );

  // Create system tray
  createTray(
    process.env.APP_ROOT!,
    process.env.VITE_PUBLIC!,
    mainWindow,
    VITE_DEV_SERVER_URL
  );

  // Create application menu
  createAppMenu();

  // Register IPC handlers
  registerIpcHandlers(mainWindow);
}

// === Event Handlers ===

/**
 * Handle theme changes and notify renderer
 */
nativeTheme.on("updated", () => {
  mainWindow?.webContents.send("theme:updated", {
    theme: nativeTheme.shouldUseDarkColors ? "dark" : "light",
  });
});

/**
 * Handle app ready signal from renderer
 */
ipcMain.handle("app:ready", () => {
  // Destroy splash window and show main window
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.destroy();
    splashWindow = null;
  }

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
  }

  return { success: true };
});

// === App Lifecycle Events ===

app.on("ready", initializeApp);

app.on("window-all-closed", () => {
  // On macOS, keep the app running even when all windows are closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("second-instance", () => {
  // Focus main window if user tries to run a second instance
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
});

app.on("activate", () => {
  // On macOS, re-create window when dock icon is clicked
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    initializeApp();
  }
});
