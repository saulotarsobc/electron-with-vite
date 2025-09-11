import { MantineProvider, useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import { HomePage } from "./pages/Home.page";
import { SplashPage } from "./pages/Splash.page";
import theme from "./theme";

function AppContent() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    const off = window.api.on("theme:updated", (payload: any) => {
      if (payload.action === "toggle") {
        setColorScheme(colorScheme === "dark" ? "light" : "dark");
      } else if (payload.theme) {
        setColorScheme(payload.theme);
      }
    });
    return off;
  }, [setColorScheme, colorScheme]);

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

function App() {
  return (
    <MantineProvider theme={theme}>
      <AppContent />
    </MantineProvider>
  );
}

export default App;
