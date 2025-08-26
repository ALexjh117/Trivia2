import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../assets/fondo.jpg";
import "../App.css";

const UnirseSala: React.FC = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [nickname, setNickname] = useState("");

const handleJoin = async () => {
  if (codigo.length === 4 && nickname.trim() !== "") {
    try {
      const res = await fetch(`http://localhost:3333/rooms/${codigo}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(" Error: " + errorData.message);
        return;
      }

      const data = await res.json();
      console.log("Respuesta backend:", data);

      // Te devuelve { player, room }
      navigate("/Pregunta", { 
        state: { 
          codigo, 
          nickname, 
          playerId: data.player.id, 
          roomId: data.room.id 
        } 
      });

    } catch (err) {
      console.error(err);
      alert(" Error de conexión con el servidor");
    }
    
  } else {
    alert(" Ingresa un código válido de 4 caracteres y un nickname.");
  }
};

  return (
    <div className="inicio" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="contenido">
        {/* Card principal */}
        <div className="card unirse">
          {/* Icono + Título */}
          <div className="header-card">
            <div className="icono-sala">👥</div>
            <h2 className="titulo">Unirse a Sala</h2>
            <div className="decoracion"></div>
          </div>

          {/* Código de Sala */}
          <div className="campo">
            <label className="campo-label">🏠 Código de Sala:</label>
            <input
              type="text"
              placeholder="AB12"
              maxLength={4}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              className="input-codigo"
            />
            <p className="hint">
              Ingresa el código de 4 caracteres proporcionado por el moderador
            </p>
          </div>

          {/* Nickname */}
          <div className="campo">
            <label className="campo-label">🎮 Tu Nickname:</label>
            <input
              type="text"
              placeholder="Ej: SuperPlayer123"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <p className="hint">Debe ser único en la sala</p>
          </div>

          {/* Botón */}
          <button className="arcade-btn btn-unirse" onClick={handleJoin}>
            👥 Unirse a la Sala
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnirseSala;
