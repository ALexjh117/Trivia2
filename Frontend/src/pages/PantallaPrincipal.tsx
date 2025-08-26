import React from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../assets/fondo.jpg";
import "../App.css";

const PantallaPrincipal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="inicio" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="contenido">
        <h1 className="titulo-principal">SELECCIONA TU ROL</h1>

        <div className="roles-container">
          {/* Card Moderador */}
          <div className="card moderador">
            <h2>MODERADOR</h2>
            <p>
              Crea salas, lanza preguntas con tiempo límite y controla el juego
            </p>
            <ul>
              <li>Crear sala con código único</li>
              <li>Lanzar preguntas con timer</li>
              <li>Ver puntuaciones en tiempo real</li>
            </ul>
            <button
              className="btn-moderador"
              onClick={() => navigate("/CrearSala")}
            >
              Crear Sala
            </button>
          </div>

          {/* Card Jugador */}
          <div className="card jugador">
            <h2>JUGADOR</h2>
            <p>Únete a una sala existente y compite con otros jugadores</p>
            <ul>
              <li>Ingresar con nickname único</li>
              <li>Responder en tiempo límite</li>
              <li>Competir por el primer lugar</li>
            </ul>
            <button
              className="btn-jugador"
              onClick={() => navigate("/UnirseSala")}
            >
              Unirse a Sala
            </button>
          </div>
        </div>

        {/* Brick inferior */}
        <div className="brick"></div>
      </div>
    </div>
  );
};

export default PantallaPrincipal;
