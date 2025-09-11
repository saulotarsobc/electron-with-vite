import { DragDropArea, FileOpener, ThemeHeader } from "@/components/FileSystem";
import { Welcome } from "@/components/Welcome/Welcome";

/**
 * Home page component showcasing file operations and drag & drop functionality
 */
export function HomePage() {
  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        minHeight: "100vh",
      }}
    >
      {/* Theme controls */}
      <ThemeHeader />

      {/* Welcome section */}
      <Welcome />

      {/* Drag and drop area */}
      <DragDropArea />

      {/* File opener */}
      <FileOpener />
    </div>
  );
}
