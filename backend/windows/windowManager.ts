import { BrowserWindow } from "electron";
import path from "node:path";
import { displayName } from "../../package.json";

/**
 * Constants for window configuration
 */
export const WINDOW_CONFIG = {
  MAIN: {
    ROUTE: "#/home",
    SHOW_INITIALLY: false,
  },
  SPLASH: {
    WIDTH: 420,
    HEIGHT: 260,
    ROUTE: "#/splash",
    RESIZABLE: false,
    FRAME: false,
    ALWAYS_ON_TOP: true,
  },
} as const;

/**
 * Creates the main application window
 */
export function createMainWindow(
  rendererDist: string,
  publicPath: string,
  preloadPath: string,
  devServerUrl?: string
): BrowserWindow {
  const win = new BrowserWindow({
    show: WINDOW_CONFIG.MAIN.SHOW_INITIALLY,
    title: `${displayName} - v${process.env.npm_package_version || "1.0.0"}`,
    icon: path.join(publicPath, "icon.ico"),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the appropriate URL based on environment
  if (devServerUrl) {
    win.loadURL(devServerUrl + WINDOW_CONFIG.MAIN.ROUTE);
  } else {
    win.loadFile(path.join(rendererDist, "index.html"), {
      hash: WINDOW_CONFIG.MAIN.ROUTE.replace("#/", ""),
    });
  }

  return win;
}

/**
 * Creates the splash screen window
 */
export function createSplashWindow(
  rendererDist: string,
  publicPath: string,
  preloadPath: string,
  devServerUrl?: string
): BrowserWindow {
  const splash = new BrowserWindow({
    width: WINDOW_CONFIG.SPLASH.WIDTH,
    height: WINDOW_CONFIG.SPLASH.HEIGHT,
    resizable: WINDOW_CONFIG.SPLASH.RESIZABLE,
    frame: WINDOW_CONFIG.SPLASH.FRAME,
    transparent: false,
    show: true,
    alwaysOnTop: WINDOW_CONFIG.SPLASH.ALWAYS_ON_TOP,
    icon: path.join(publicPath, "icon.ico"),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the appropriate URL based on environment
  if (devServerUrl) {
    splash.loadURL(devServerUrl + WINDOW_CONFIG.SPLASH.ROUTE);
  } else {
    splash.loadFile(path.join(rendererDist, "index.html"), {
      hash: WINDOW_CONFIG.SPLASH.ROUTE.replace("#/", ""),
    });
  }

  return splash;
}
