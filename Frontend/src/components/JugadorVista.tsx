import React, { useState, useEffect } from "react";
import socket from "../services/socket";
import ListaJugadores from "./ListaJugadores";
import Pregunta from "./Pregunta";
import type { Jugador as JugadorType, Pregunta as PreguntaType } from "../types";
import "../styles/Jugador.css";

const JugadorVista: React.FC = () => {
  const [codigo, setCodigo] = useState("");
  const [nickname, setNickname] = useState("");
  const [jugadores, setJugadores] = useState<JugadorType[]>([]);
  const [pregunta, setPregunta] = useState<PreguntaType | null>(null);
  const [contador, setContador] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [respondido, setRespondido] = useState(false);
  const [puntos, setPuntos] = useState<number>(0);

  const joinRoom = () => {
    socket.emit("joinRoom", { codigoSala: codigo, nickname }, (res: { error?: string; jugadores?: JugadorType[] }) => {
      if (res.error) alert(res.error);
      else setJugadores(res.jugadores || []);
    });
  };

  const answer = (resp: string) => {
    if (!pregunta) return;
    const correcta = pregunta.respuestaCorrecta ?? "";
    const isCorrect = resp.trim().toLowerCase() === correcta.trim().toLowerCase();
    setRespondido(true);
    setFeedback(isCorrect ? "✅ Correcto!" : "❌ Incorrecto!");
    if (isCorrect) setPuntos((prev) => prev + 10);

    socket.emit("answer", { codigoSala: codigo, respuesta: resp }, (res: { error?: string }) => {
      if (res.error) alert(res.error);
    });
  };

  // Contador corregido usando Date.now()
  useEffect(() => {
    if (!pregunta) return;

    setContador(pregunta.tiempo);
    setRespondido(false);
    setFeedback("");

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = pregunta.tiempo - elapsed;

      if (remaining <= 0) {
        setContador(0);
        setPregunta(null);
        setRespondido(false);
        setFeedback("");
        clearInterval(interval);
      } else {
        setContador(remaining);
      }
    }, 200); // cada 200ms para mayor precisión

    return () => clearInterval(interval);
  }, [pregunta]);

  useEffect(() => {
    socket.on("updatePlayers", (players: JugadorType[]) => setJugadores(players));
    socket.on("newQuestion", (q: PreguntaType) => setPregunta(q));
    socket.on("endQuestion", () => setPregunta(null));
    socket.on("roomClosed", () => alert("Sala cerrada"));

    return () => {
      socket.off("updatePlayers");
      socket.off("newQuestion");
      socket.off("endQuestion");
      socket.off("roomClosed");
    };
  }, []);

  return (
    <div className="jugador-container">
      <div className="jugador-card">
        <h2>Jugador</h2>
        <p>Mi puntos: {puntos}</p>
        <input placeholder="Código sala" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
        <input placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <button onClick={joinRoom}>Unirse</button>

        <div className="lista-jugadores">
          <ListaJugadores jugadores={jugadores} />
        </div>
        <img src="../img/mario.png" alt="" width={200} height={200} className="img-mario"/>

        {pregunta && (
          <div className="pregunta-container">
            <h3>{pregunta.texto}</h3>
            <p>Tiempo restante: {contador}s</p>
            <Pregunta pregunta={pregunta} responder={answer} disabled={respondido || contador === 0} />
            {feedback && <p className="feedback">{feedback}</p>}
          </div>
        )}

        {/* Ranking en tiempo real */}
        {jugadores.length > 0 && (
          <div className="ranking">
            <h3>Ranking Actual</h3>
            <ul>
              {jugadores
                .sort((a, b) => (b.score || 0) - (a.score || 0))
                .map(j => (
                  <li key={j.nickname}>{j.nickname}: {j.score || 0} pts</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default JugadorVista;
