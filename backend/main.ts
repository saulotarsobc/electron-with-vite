import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  nativeTheme,
  Tray,
} from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { displayName } from "../package.json";
import { createAppMenu } from "./utils/menu";

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

// In dev we want actual public folder; in production packaged assets in renderer dist
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT!, "..", "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let tray: Tray | null = null;

import fsSync from "node:fs";
import { readFile as readFileAsync } from "node:fs/promises";

function resolvePublicPath() {
  if (VITE_DEV_SERVER_URL) {
    // when running dev, process.env.APP_ROOT points to project root/backend
    const candidate = path.join(process.env.APP_ROOT!, "public");
    if (fsSync.existsSync(path.join(candidate, "icon.ico"))) return candidate;
  }
  return process.env.VITE_PUBLIC || path.join(process.env.APP_ROOT!, "public");
}

function getTrayIconPath() {
  return path.join(resolvePublicPath(), "icon.ico");
}

function createWindow() {
  win = new BrowserWindow({
    title: `${displayName} - v${app.getVersion()}`,
    icon: path.join(process.env.VITE_PUBLIC, "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

function createTray() {
  if (tray) return;
  tray = new Tray(getTrayIconPath());
  const updateMenu = () => {
    const themeLabel = nativeTheme.shouldUseDarkColors ? "Dark" : "Light";
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Show",
        click: () => {
          win?.show();
          win?.focus();
        },
      },
      { label: "Hide", click: () => win?.hide() },
      { type: "separator" },
      { label: `Theme: ${themeLabel}`, enabled: false },
      {
        label: "Toggle Theme (renderer)",
        click: () =>
          win?.webContents.send("theme:updated", {
            theme: nativeTheme.shouldUseDarkColors ? "light" : "dark",
          }),
      },
      { type: "separator" },
      { label: "Quit", click: () => app.quit() },
    ]);
    tray?.setToolTip(displayName);
    tray?.setContextMenu(contextMenu);
  };
  updateMenu();
  nativeTheme.on("updated", updateMenu);
}

// IPC Handlers
ipcMain.handle("fs:open-file", async (_event, args) => {
  try {
    const result = await dialog.showOpenDialog(win!, {
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

ipcMain.handle("fs:read-file", async (_event, args) => {
  try {
    const content = await readFileAsync(args.path, "utf-8");
    return { success: true, data: { path: args.path, content } };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle("theme:get", async () => {
  const theme =
    nativeTheme.themeSource === "system"
      ? "system"
      : nativeTheme.shouldUseDarkColors
      ? "dark"
      : "light";
  return { success: true, data: { theme } };
});

nativeTheme.on("updated", () => {
  win?.webContents.send("theme:updated", {
    theme: nativeTheme.shouldUseDarkColors ? "dark" : "light",
  });
});

app.on("ready", () => {
  createWindow();
  createTray();
  createAppMenu();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
