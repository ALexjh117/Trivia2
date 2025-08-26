import React from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../assets/fondo.jpg";
import "../App.css";

const Reglas: React.FC = () => {
  const navigate = useNavigate();

  const handleIniciarJuego = () => {
    navigate("/Pregunta"); 
  };

  return (
    <div
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="reglas-box"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "12px",
          padding: "30px",
          textAlign: "center",
          maxWidth: "600px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <h2
          style={{
            fontFamily: "Press Start 2P, cursive",
            marginBottom: "20px",
          }}
        >
          REGLAS DE JUEGO
        </h2>

        <ul
          style={{ textAlign: "left", marginBottom: "30px", lineHeight: "1.8" }}
        >
          <li>
            🕑 Cada jugador tiene <b>30 segundos</b> para responder una
            pregunta.
          </li>
          <li>❌ Si no responde en ese tiempo, se considera incorrecta.</li>
          <li>
            🎮 El tiempo total de la partida puede ser de <b>5 rondas</b>.
          </li>
        </ul>

        <button
          onClick={handleIniciarJuego}
          style={{
            backgroundColor: "#166534",
            color: "white",
            padding: "15px 40px",
            fontSize: "18px",
            fontFamily: "Press Start 2P, cursive",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Iniciar Juego
        </button>
      </div>
    </div>
  );
};

export default Reglas;
