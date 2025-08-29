import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Moderador from "./components/Moderador";
import JugadorVista from "./components/JugadorVista";
import "./styles/Home.css";


const Home: React.FC = () => (
  <div className="home-container">
    <div className="home-title">
      <h1>Trivia Multijugador</h1>
    </div>
    <div className="home-buttons">
      <Link to="/moderador"><button>Moderador</button></Link>
      <Link to="/jugador"><button>Jugador</button></Link>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moderador" element={<Moderador />} />
        <Route path="/jugador" element={<JugadorVista />} />
      </Routes>
    </Router>
  );
};

export default App;
