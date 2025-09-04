# Copilot Instructions for Electron with Vite

## Architecture Overview
This is an Electron desktop app with a React frontend built using Vite. Key components:
- **Frontend**: React app in `src/` using Mantine UI, TypeScript, and React Router
- **Backend**: Electron main process in `backend/` with secure IPC via preload script
- **Build**: Vite compiles frontend to `dist/frontend`, Electron to `dist/backend`; electron-builder packages to `out/`

## Key Files
- `vite.config.ts`: Configures Vite with Electron plugins and aliases (`@` for `src/`)
- `electron-builder.json`: Defines packaging targets (NSIS for Windows, DMG for Mac, AppImage/DEB for Linux)
- `backend/main.ts`: Creates BrowserWindow, handles app lifecycle and menu
- `backend/preload.ts`: Exposes IPC methods securely to renderer
- `src/App.tsx`: Main React component with MantineProvider and routing
- `package.json`: Scripts like `npm run dist` for full build/package

## Developer Workflows
- **Development**: `npm run dev` starts Vite dev server loaded in Electron window
- **Build**: `npm run build` compiles TypeScript and builds Vite production bundle
- **Package**: `npm run dist` generates electron-builder config, builds, and creates installers in `out/`
- **Debug**: Use Electron DevTools in dev mode; preload logs to console for IPC debugging

## Conventions and Patterns
- Use `@/` alias for imports from `src/` (configured in `vite.config.ts` and `tsconfig.json`)
- Electron code in `backend/` directory, React in `src/`
- Components: Functional with hooks, styled via Mantine (e.g., `ColorSchemeToggle` in `src/components/`)
- Routing: HashRouter for client-side navigation (see `src/App.tsx`)
- IPC: Always use preload for secure communication (e.g., `window.ipcRenderer.invoke()`)
- Theming: Custom Mantine theme in `src/theme.ts`
- Build scripts: Use `scripts/generate-electron-builder.ts` to update packaging config dynamically

## Integration Points
- Electron APIs: Accessed via preload bridge (no direct Node.js in renderer)
- External deps: Mantine for UI, React Router for navigation
- No database; app appears stateless for now

## Examples
- Adding a new page: Create in `src/pages/`, add route in `src/App.tsx`
- IPC call: In renderer, `await window.ipcRenderer.invoke('channel', data)`
- Component: Use Mantine hooks like `useMantineColorScheme()` for theme toggling</content>
<parameter name="filePath">d:\sc\electron-apps\electron-with-vite\.github\copilot-instructions.md
