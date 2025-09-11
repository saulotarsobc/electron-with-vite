import { AppLayout } from "@/components/Layout";
import { useThemeSync } from "@/hooks";
import { MantineProvider } from "@mantine/core";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { GalleryPage } from "./pages/Gallery.page";
import { HomePage } from "./pages/Home.page";
import { MessagesPage } from "./pages/Messages.page";
import { ProfilePage } from "./pages/Profile.page";
import { SearchPage } from "./pages/Search.page";
import { SettingsPage } from "./pages/Settings.page";
import { SplashPage } from "./pages/Splash.page";
import theme from "./theme";

/**
 * App content component that handles routing and theme synchronization
 */
function AppContent() {
  // Use custom hook to handle theme synchronization with Electron
  useThemeSync();
  const location = useLocation();

  // Don't use layout for splash page
  if (location.pathname === "/splash") {
    return (
      <Routes>
        <Route path="/splash" element={<SplashPage />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/" element={<Navigate to="/splash" replace />} />
      </Routes>
    </AppLayout>
  );
}

/**
 * Main App component with Mantine provider
 */
function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <main className="App">
          <AppContent />
        </main>
      </Router>
    </MantineProvider>
  );
}

export default App;
