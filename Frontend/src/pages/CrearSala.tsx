import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../assets/fondo.jpg";
import "../App.css";

const CrearSala: React.FC = () => {
  const navigate = useNavigate();
  const [codigoSala, setCodigoSala] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [estado] = useState("Esperando jugadores");

   const handleCerrar = () => {
    if (window.confirm("¿Seguro que quieres cerrar la sala?")) {
      navigate("/");
    }
  };


  const handleCrearsala = async () => {
    if (!nicknameInput) {
      alert("ingresa tu nombre antes de crear la sala");
      return;
    }
  

  // Codigo de sala

      try {
        const res = await fetch("http://localhost:3333/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({nickname:nicknameInput}),
        });

        if (!res.ok) 
          throw new Error("Error al crear sala");
        

        const data = await res.json();
        const roomcode = data.room?.code || data.codigo
        setCodigoSala(roomcode);
        navigate("/CrearPregunta", { state: { codigoSala:roomcode , creador:nicknameInput} });
      } catch (error) {
        console.error("Error al crear sala:", error);
      }
    };

 



  return (
    <div className="inicio" style={{ backgroundImage: `url(${fondo})` }}>
      {/* Icono de cerrar */}
      <button className="btn-cerrar " onClick={handleCerrar}></button>

      <div className="contenido">
        <div className="card moderador">
          <h2 className="titulo">Crear Nueva Sala</h2>

          {/* Código de la sala */}
          <div className="sala-codigo">
            <p>Código de tu sala:</p>
            <h1 className="codigo">{codigoSala || "Cargando..."}</h1>
            <p>Los jugadores usarán este código para unirse</p>
          </div>

          {/* escribir el nombre del usuario*/}

          <div className="input-creador">
            <label>Tu nombre:</label>
            <input
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder="Ingresa tu nombre"
            />
          </div>

          {/* Jugadores conectados */}
          <div className="jugadores">
            <p>Jugadores conectados:</p>
            {/*    <span className="jugadores-count">{jugadores}</span> */}
          </div>

          {/* Estado de la sala */}
          <div className="estado">
            <p>Estado de la sala:</p>
            <span className="estado-label">{estado}</span>
          </div>

          {/* Botón de inicio */}
          <button
            className="arcade-btn btn-iniciar"
            onClick={() =>
              navigate("/CrearPregunta", { state: { codigoSala } })
            }
          >
            Iniciar Juego
          </button>
          <button className="arcade-btn btn-iniciar" onClick={handleCrearsala}>
            Crear Sala
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearSala;
