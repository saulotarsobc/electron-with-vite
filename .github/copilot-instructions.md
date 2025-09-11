# Electron + Vite Codebase Instructions

## Architecture Overview

This is a **type-safe Electron application** built with **Vite**, **React 19**, **Mantine UI**, and **TypeScript**. The codebase follows a **modular architecture** with strict separation between frontend and backend processes.

### Key Architectural Decisions

- **Dual-Process Architecture**: Main process (`backend/`) and renderer process (`src/`) with typed IPC communication
- **Splash-to-Main Window Pattern**: Shows splash screen during initialization, then switches to main window
- **Typed IPC Contracts**: All IPC communication uses Zod schemas in `shared/ipc/contracts.ts`
- **Custom Hook Architecture**: Business logic encapsulated in reusable React hooks
- **Modular Backend**: Window management, tray functionality, and IPC handlers are separated into modules

## Development Workflow

### Build & Run Commands

```bash
npm run dev          # Vite dev server with Electron hot reload
npm run build        # TypeScript compilation + Vite build
npm run dist         # Full build + electron-builder packaging
```

### Generated Configuration

- `electron-builder.json` is **generated** by `scripts/generate-electron-builder.ts` - modify the script, not the JSON
- Build outputs: `dist/frontend/` (Vite) and `dist/backend/` (Electron main process)

## Critical File Relationships

### IPC Communication Flow

1. **Contracts**: `shared/ipc/contracts.ts` defines typed channels using Zod schemas
2. **Handlers**: `backend/ipc/handlers.ts` implements server-side logic
3. **Preload**: `backend/preload.ts` exposes typed API to renderer via `contextBridge`
4. **Frontend**: Hooks like `useFileOperations.ts` consume the typed API

### Window Management

- `backend/windows/windowManager.ts`: Creates main and splash windows with routing
- Windows load specific React routes: splash (`#/splash`) → main (`#/home`)
- `backend/main.ts` orchestrates window lifecycle and app initialization

### Theme System

- **Bidirectional sync**: System theme ↔ Electron nativeTheme ↔ Mantine colorScheme
- `useThemeSync` hook handles renderer-side theme updates
- Tray menu reflects current theme and allows toggling

## Project-Specific Patterns

### Custom Hooks Pattern

Each feature gets its own hook (see `src/hooks/`):

```typescript
// File operations
const { file, openFile, clearFile } = useFileOperations();

// Drag & drop with metadata
const { droppedFiles, handleDrop } = useDragAndDrop();

// Theme synchronization
const { colorScheme } = useThemeSync();
```

### Typed IPC Pattern

Always use typed channels from contracts:

```typescript
// ✅ Correct: Type-safe IPC call
const result = await window.api.invoke("fs:read-file", { path: filePath });

// ❌ Wrong: Untyped IPC
ipcRenderer.invoke("some-channel", data);
```

### Component Organization

- `src/components/` contains reusable UI components
- `src/pages/` contains route-level components
- Components export both logic and UI, with clear separation

### File Operation Security

- All file operations go through IPC handlers with error handling
- Drag & drop supports both File API (sandbox) and Electron paths
- File metadata fetching is batched and limited (max 50 files)

## Development Guidelines

### Adding New IPC Channels

1. Define contract in `shared/ipc/contracts.ts` with Zod schemas
2. Add handler in `backend/ipc/handlers.ts`
3. Update type guards (`isInvokeChannel`, `isEventChannel`)
4. Create or update corresponding hook in `src/hooks/`

### Window Management

- New windows should follow the pattern in `windowManager.ts`
- Always configure `webPreferences` with security best practices
- Use routing for different window content rather than separate HTML files

### Error Handling

- IPC handlers return `{ success: boolean, data?, error? }` pattern
- Frontend hooks handle loading states and error display
- File operations include fallback mechanisms for restricted environments

## Key Dependencies & Integrations

- **Mantine**: UI components and theme system - follow Mantine patterns
- **React Router**: Hash-based routing for Electron compatibility
- **Zod**: Schema validation for IPC contracts - always validate inputs
- **electron-builder**: Packaging via generated config script

## Testing & Debugging

- Vite config disables renderer in test environment
- Console logs in preload script indicate successful initialization
- Theme changes are logged and reflected in tray menu
- File operations provide detailed error messages with fallback information
