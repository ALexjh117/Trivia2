import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import fondo from "../assets/fondo.jpg";
import "../App.css";
import "./style/CrearPregunta.css";

interface LocationState {
  codigoSala: string;
  creador: string;
}

const CrearPregunta: React.FC = () => {
  const socket = io("http://localhost:3333");
  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState(["", "", "", ""]);
  const [iscorrect, setIsCorrect] = useState<number | null>(null);
  const navigate = useNavigate();

  const location = useLocation();
  const { codigoSala, creador } = (location.state || {}) as LocationState;

  const handleChange = (index: number, value: string) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index] = value;
    setOpciones(nuevasOpciones);
  };

  const handleEnviarPregunta = async () => {
    if (!pregunta.trim() || opciones.some((op) => !op.trim())) {
      alert(" Debes completar la pregunta y todas las opciones.");
      return;
    }

    if (iscorrect === null) {
      alert("debes seleccionar la respuesta correcta");
      return;
    }
    // Aquí envías la pregunta al backend con fetch/axios/socket
    try {
      const res = await fetch(
        `http://localhost:3333/rooms/${codigoSala}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: pregunta,
            options: opciones,
            correct: iscorrect, // índice de la opción correcta
            limitSec: 30, // opcional
          }),
        }
      );

      if (!res.ok) throw new Error("Error al crear la pregunta");
      const data = await res.json();

      console.log("✅ Pregunta creada:", data);
      alert("Pregunta creada con éxito ✅");
      socket.emit("question-started", {
        roomcode: codigoSala,
        question: {
          text: pregunta,
          opctions: opciones,
          correct: iscorrect,
          limitsec: 30,
        },
      });
      // limpiar inputs
      setPregunta("");
      setOpciones(["", "", "", ""]);
      setIsCorrect(null);
    } catch (error) {
      console.error(error);
      alert("❌ Hubo un error al enviar la pregunta");
    }
  };
  // esto hace que todos los jugaodres que etsen conectados reciban la pregunta
  // en tiempo real

  return (
    <div
      className="inicio"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="moderador-card">
        {/* 🔹 Encabezado */}
        <div className="moderador-header">
          <span className="titulo">📋 Crear Pregunta</span>
          <span className="codigo-sala"> Código sala : {codigoSala}</span>
          <span className="codigo-sala"> creador: {creador} </span>
          <div className="header-derecha">
            <span>👥 Jugadores: 0</span>
            <span
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/marcador", { state: { codigoSala } })}
            >
              🏆 Marcador
            </span>
          </div>
        </div>

        {/* 🔹 Formulario */}
        <div className="moderador-body">
          <label className="label titulo-opciones">Pregunta</label>
          <input
            type="text"
            className="input"
            placeholder="Escribe la pregunta..."
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
          />

          <label className="label titulo-opciones">Opciones de Respuesta</label>
          <label className="label titulo-opciones">
            selecciona la respuesta correcta
          </label>
          {opciones.map((op, index) => (
            <div key={index} className="opcion-con-radio">
              <input
                type="radio"
                name="respuestaCorrecta"
                checked={iscorrect === index}
                onChange={() => setIsCorrect(index)}
              />
              <input
                type="text"
                className="input"
                placeholder={`Opción ${index + 1}...`}
                value={op}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
          ))}
          <button
            className="btn-finalizar"
            onClick={() => {
              socket.emit("end-round", { roomCode: codigoSala });
            }}
          >
            ⏹️ Finalizar Ronda
          </button>

          <button className="btn" onClick={handleEnviarPregunta}>
            🚀 Hacer Pregunta
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearPregunta;
