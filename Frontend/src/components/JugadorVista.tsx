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
  const [puntajesFinales, setPuntajesFinales] = useState<{ nickname: string; puntos: number }[] | null>(null);

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

    socket.emit("answer", { codigoSala: codigo, respuesta: resp }, (res: { error?: string; correcta?: boolean }) => {
      if (res.error) alert(res.error);
    });
  };

  useEffect(() => {
    if (!pregunta) return;
    setContador(pregunta.tiempo);
    setRespondido(false);
    setFeedback("");
    const tick = () => {
      setContador((prev) => {
        if (prev <= 1) {
          setPregunta(null);
          setRespondido(false);
          setFeedback("");
          return 0;
        }
        setTimeout(tick, 1000);
        return prev - 1;
      });
    };
    setTimeout(tick, 1000);
  }, [pregunta]);

  useEffect(() => {
    socket.on("updatePlayers", (players: JugadorType[]) => setJugadores(players));
    socket.on("newQuestion", (q: PreguntaType) => setPregunta(q));
    socket.on("endQuestion", () => setPregunta(null));
    socket.on("roomClosed", () => alert("Sala cerrada"));
    socket.on("gameEnded", (finalScores: { nickname: string; puntos: number }[]) => {
      setPuntajesFinales(finalScores);
    });

    return () => {
      socket.off("updatePlayers");
      socket.off("newQuestion");
      socket.off("endQuestion");
      socket.off("roomClosed");
      socket.off("gameEnded");
    };
  }, []);

  return (
    <div className="jugador-container">
      <div className="jugador-card">
        <h2>Jugador</h2>
        <p>Puntos: {puntos}</p>
        <input placeholder="Código sala" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
        <input placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <button onClick={joinRoom}>Unirse</button>

        <div className="lista-jugadores">
          <ListaJugadores jugadores={jugadores} />
        </div>

        {pregunta && (
          <div className="pregunta-container">
            <h3>{pregunta.texto}</h3>
            <p>Tiempo restante: {contador}s</p>
            <Pregunta pregunta={pregunta} responder={answer} disabled={respondido || contador === 0} />
            {feedback && <p className="feedback">{feedback}</p>}
          </div>
        )}

        {puntajesFinales && (
          <div className="final-scores">
            <h3>Puntajes finales</h3>
            <ul>
              {puntajesFinales.map((j) => (
                <li key={j.nickname}>{j.nickname}: {j.puntos} puntos</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default JugadorVista;
