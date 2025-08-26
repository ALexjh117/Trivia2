import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import { obtenerScore } from "../services/score";
import fondo from "../assets/fondo.jpg";
import "../App.css";

interface Player {
  playerId: number;
  nickname: string;
  score: number;
}

const Marcador: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode } = location.state || {};
  const [jugadores, setJugadores] = useState<Player[]>([]);

  const cargarMarcador = async () => {
    try {
      const data = await obtenerScore(roomCode);
      setJugadores(data);
    } catch (err) {
      console.error("Error cargando marcador:", err);
    }
  };

  useEffect(() => {
    if (!roomCode) return;

    cargarMarcador();

    socket.on("scoreboard-updated", (payload) => {
      if (payload.roomCode === roomCode) {
        setJugadores(payload.scoreboard);
     
      }
    });
    socket.on("round-ended", (data) => {
  if (data.roomCode === roomCode) {
    alert("⏹️ Ronda finalizada");
    setJugadores(data.scoreboard); // Actualiza el marcador
  }
});


    return () => {
      socket.off("scoreboard-updated");
      socket.off("round-ended") //limpiarr el listener
    };
  }, [roomCode]);

  return (
    <div
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "30px",
          borderRadius: "16px",
          maxWidth: "700px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        }}
      >
        <h2
          style={{
            fontFamily: "Press Start 2P, cursive",
            marginBottom: "20px",
            fontSize: "22px",
          }}
        >
          🏆 Marcador
        </h2>

        {jugadores.length === 0 ? (
          <p
            style={{
              fontSize: "16px",
              color: "#555",
              fontFamily: "monospace",
            }}
          >
            Aún no hay jugadores
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ background: "#ff9800", color: "white" }}>
                <th style={{ padding: "12px" }}>#</th>
                <th style={{ padding: "12px" }}>Jugador</th>
                <th style={{ padding: "12px" }}>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {jugadores.map((j, i) => (
                <tr
                  key={j.playerId}
                  style={{
                    background: i % 2 === 0 ? "#fff" : "#f5f5f5",
                    fontWeight: i === 0 ? "bold" : "normal",
                  }}
                >
                  <td style={{ padding: "10px" }}>{i + 1}</td>
                  <td style={{ padding: "10px" }}>{j.nickname}</td>
                  <td style={{ padding: "10px" }}>{j.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          onClick={() => navigate("/crear-pregunta", { state: { roomCode } })}
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "12px 30px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontFamily: "Press Start 2P, cursive",
            cursor: "pointer",
          }}
        >
          ⬅️ Volver
        </button>
      </div>
    </div>
  );
};

export default Marcador;
