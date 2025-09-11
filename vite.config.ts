import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";

// === Configuration Constants ===
const PATHS = {
  FRONTEND_OUT: "dist/frontend",
  BACKEND_OUT: "dist/backend",
  BACKEND_ENTRY: "backend/main.ts",
  PRELOAD_ENTRY: "backend/preload.ts",
  SRC_ALIAS: "./src",
} as const;

// === Plugin Configurations ===
/**
 * Creates electron plugin configuration with proper build paths
 */
const createElectronConfig = () => ({
  main: {
    entry: PATHS.BACKEND_ENTRY,
    vite: {
      build: {
        outDir: PATHS.BACKEND_OUT,
      },
    },
  },
  preload: {
    input: path.join(__dirname, PATHS.PRELOAD_ENTRY),
    vite: {
      build: {
        outDir: PATHS.BACKEND_OUT,
      },
    },
  },
  // Disable renderer in test environment
  renderer: process.env.NODE_ENV === "test" ? undefined : {},
});

/**
 * Creates build configuration for frontend assets
 */
const createBuildConfig = () => ({
  outDir: PATHS.FRONTEND_OUT,
  assetsDir: ".",
});

/**
 * Creates resolver configuration with path aliases
 */
const createResolverConfig = () => ({
  alias: {
    "@": path.resolve(__dirname, PATHS.SRC_ALIAS),
  },
});

// === Main Configuration ===
export default defineConfig({
  build: createBuildConfig(),
  plugins: [react(), electron(createElectronConfig())],
  resolve: createResolverConfig(),
});
