import { useThemeSync } from "@/hooks";
import { MantineProvider } from "@mantine/core";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import { HomePage } from "./pages/Home.page";
import { SplashPage } from "./pages/Splash.page";
import theme from "./theme";

/**
 * App content component that handles routing and theme synchronization
 */
function AppContent() {
  // Use custom hook to handle theme synchronization with Electron
  useThemeSync();

  return (
    <Router>
      <main className="App">
        <Routes>
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<Navigate to="/splash" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

/**
 * Main App component with Mantine provider
 */
function App() {
  return (
    <MantineProvider theme={theme}>
      <AppContent />
    </MantineProvider>
  );
}

export default App;
