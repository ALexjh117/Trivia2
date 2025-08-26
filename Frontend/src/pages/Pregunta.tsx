import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import fondo from "../assets/fondo.jpg";
import "../App.css";

const Pregunta: React.FC = () => {
  const [preguntaActual, setPreguntaActual] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const location = useLocation();
  const { codigoSala: sala } = location.state || {};
  const [codigoSala] = useState(sala);

  useEffect(() => {
    // 👉 Conexión del socket al montar el componente
    const socket: Socket = io("http://localhost:3333", {
      transports: ["websocket"], // fuerza websocket (evita polling raro)
    });

    socket.on("connect", () => {
      console.log("✅ Conectado con id:", socket.id);

      // opcional: unirse a la sala apenas conecte
      if (codigoSala) {
        socket.emit("join-room", { roomCode: codigoSala });
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión:", err.message);
    });

    socket.on("question-started", (data) => {
      if (data.roomCode === codigoSala) {
        setPreguntaActual(data.question);
        setTimeLeft(data.question.limitSec);
      }
    });

    socket.on("disconnect", () => {
      console.log("⚡ Cliente desconectado del servidor");
    });

    // 👉 limpiar al desmontar
    return () => {
      socket.disconnect();
    };
  }, [codigoSala]);

  // temporizador
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // responder preguntas
  const handleResponder = async (opcionIndex: number) => {
    if (!preguntaActual) return;

    try {
      const res = await fetch(`http://localhost:3333/answers/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode: codigoSala,
          questionId: preguntaActual.id,
          playerId: "demo-player", // ⚠️ pon un id real
          selected: opcionIndex,
        }),
      });

      if (!res.ok) throw new Error("Error al enviar la respuesta");
      const data = await res.json();

      alert(data.correct ? "✅ Correcto" : "❌ Incorrecto");
    } catch (error) {
      console.error(error);
      alert(" Hubo un error al enviar la respuesta");
    }
  };

  return (
    <div className="inicio" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="pregunta-card">
        <div className="pregunta-header">
          <span className="pregunta-numero">Pregunta 1 de 10</span>
          <span className="pregunta-tiempo">⏰ 00:{timeLeft}</span>
        </div>

        <h2 className="pregunta-texto">
          {preguntaActual ? preguntaActual.text : "Esperando pregunta..."}
        </h2>

        <div className="opciones-grid">
          {preguntaActual?.options?.map((op: string, index: number) => (
            <button
              key={index}
              className="opcion-btn"
              onClick={() => handleResponder(index)}
            >
              {String.fromCharCode(65 + index)}) {op}
            </button>
          ))}
        </div>

        <p className="nota-texto">
          Selecciona tu respuesta antes de que se acabe el tiempo
        </p>
      </div>
    </div>
  );
};

export default Pregunta;
