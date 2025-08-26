import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fondo from "../assets/fondo.jpg";
import "../App.css";

const Puntaje: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nickname, score, roomCode } = location.state || {};

  return (
    <div className="inicio" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="puntaje-box">
        <h2 className="subtitulo">🏆 Tu Puntaje</h2>
        <p className="arcade-label">Jugador: {nickname}</p>
        <p className="arcade-label">Puntos: {score}</p>
        <button
          className="arcade-btn mt-4"
          onClick={() =>
            navigate("/pregunta", { state: { roomCode, nickname, score } })
          }
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Puntaje;
