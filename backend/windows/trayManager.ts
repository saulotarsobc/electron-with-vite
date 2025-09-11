import { BrowserWindow, Menu, Tray, app, nativeTheme } from "electron";
import fsSync from "node:fs";
import path from "node:path";
import { displayName } from "../../package.json";

/**
 * Resolves the correct path for public assets
 */
function resolvePublicPath(
  appRoot: string,
  vitePublic: string,
  devServerUrl?: string
): string {
  if (devServerUrl) {
    const candidate = path.join(appRoot, "public");
    if (fsSync.existsSync(path.join(candidate, "icon.ico"))) {
      return candidate;
    }
  }
  return vitePublic || path.join(appRoot, "public");
}

/**
 * Creates and manages the system tray
 */
export function createTray(
  appRoot: string,
  vitePublic: string,
  mainWindow: BrowserWindow | null,
  devServerUrl?: string
): Tray {
  const publicPath = resolvePublicPath(appRoot, vitePublic, devServerUrl);
  const trayIconPath = path.join(publicPath, "icon.ico");

  const tray = new Tray(trayIconPath);

  /**
   * Updates the tray context menu based on current theme
   */
  const updateTrayMenu = () => {
    const themeLabel = nativeTheme.shouldUseDarkColors ? "Dark" : "Light";
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Show",
        click: () => {
          mainWindow?.show();
          mainWindow?.focus();
        },
      },
      {
        label: "Hide",
        click: () => mainWindow?.hide(),
      },
      { type: "separator" },
      {
        label: `Theme: ${themeLabel}`,
        enabled: false,
      },
      {
        label: "Toggle Theme (renderer)",
        click: () =>
          mainWindow?.webContents.send("theme:updated", {
            action: "toggle",
          }),
      },
      { type: "separator" },
      {
        label: "Quit",
        click: () => app.quit(),
      },
    ]);

    tray.setToolTip(displayName);
    tray.setContextMenu(contextMenu);
  };

  // Initial menu setup
  updateTrayMenu();

  // Update menu when theme changes
  nativeTheme.on("updated", updateTrayMenu);

  return tray;
}
