import { MantineProvider } from "@mantine/core";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { HomePage } from "./pages/Home.page";
import theme from "./theme";

function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <main className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </Router>
    </MantineProvider>
  );
}

export default App;
