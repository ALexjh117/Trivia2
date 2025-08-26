import React from "react";
import { useNavigate } from "react-router-dom";
import panda from "../assets/panda.png";
import fondo from "../assets/fondo.jpg"; 
import "../App.css";

const Inicio: React.FC = () => {
  const navigate = useNavigate();

  return (
      <div
      className="inicio"
      style={{ backgroundImage: `url(${fondo})` }}
    >
    <div className="inicio">
      {/* Contenido */}
      <div className="contenido">
        <h1 className="titulo">TRIVIA TIME</h1>
        <h2 > Juego Multijugador en Tiempo Real</h2>
        <img src={panda} alt="panda" className="panda" />
        <h2>¡Pon a prueba tus conocimientos en el juego de trivia más divertido!</h2>
        <button
          className="arcade-btn"
          onClick={() => navigate("/pantalla-principal")}>Empezar a Jugar</button>
      </div>

      {/* Brick inferior */}
      <div className="brick"></div>
    </div>
    </div>
  );
};

export default Inicio;
