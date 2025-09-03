import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Moderador from "./components/Moderador";
import JugadorVista from "./components/JugadorVista";
import LandingPage from "./components/LandinPage";
import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/Home.css";

const Home: React.FC = () => {
    useEffect(() => {
    const audio = new Audio("../../src/sounds/super.mp3");
    audio.play();



    const timeout = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0; 
    }, 3000);

    return () => {
      clearTimeout(timeout);
      audio.pause();
    };

  }, []);
  const playClick = () => {
    const audio = new Audio("../../src/sounds/mariotuberia.mp3");
    audio.play();
  };

  return (
    <div className="home-container">
      <div className="home-title">
        <h1 className="titulo-trivia">Trivia Multijugador</h1>
      </div>
      <div className="home-buttons">
        <Link to="/moderador">
          <button onClick={playClick}>Moderador</button>
        </Link>
        <Link to="/jugador">
          <button onClick={playClick}>Jugador</button>
        </Link>
      </div>
      <img
        src="../img/mario.png"
        alt=""
        width={200}
        height={200}
        className="img-mario"
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/juego" element={<Home />} />
        <Route path="/moderador" element={<Moderador />} />
        <Route path="/jugador" element={<JugadorVista />} />
        <Route path="/home" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
