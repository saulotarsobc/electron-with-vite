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

function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <main className="App">
          <Routes>
            <Route path="/splash" element={<SplashPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<Navigate to="/splash" replace />} />
          </Routes>
        </main>
      </Router>
    </MantineProvider>
  );
}

export default App;
