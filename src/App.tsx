import Header from "@/components/Header";
import About from "@/pages/about";
import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;