import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Backlog from "./components/Backlog";
import Auth from "./components/Auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Backlog />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
