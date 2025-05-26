import { Route, HashRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import "./components/Header.css";
import About from "./pages/About";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;