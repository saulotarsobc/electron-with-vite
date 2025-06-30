import { MantineProvider } from "@mantine/core";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { HomePage } from "./pages/Home.page";
import theme from "./theme";

function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <div className="App">
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </MantineProvider>
  );
}

export default App;
