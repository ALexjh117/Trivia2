import React, { useState, useEffect } from "react";
import socket from "../services/socket";
import Pregunta from "./Pregunta";
import type { Jugador as JugadorType, Pregunta as PreguntaType } from "../types";
import "../styles/Moderador.css";

const Moderador: React.FC = () => {
  const [codigo, setCodigo] = useState("");
  const [jugadores, setJugadores] = useState<JugadorType[]>([]);
  const [textoPregunta, setTextoPregunta] = useState("");
  const [opciones, setOpciones] = useState<string[]>(["", "", "", ""]);
  const [correcta, setCorrecta] = useState("");
  const [tiempo, setTiempo] = useState<number>(10);
  const [preguntaActiva, setPreguntaActiva] = useState<PreguntaType | null>(null);
  const [contador, setContador] = useState<number>(0);
  const [puntajesFinales, setPuntajesFinales] = useState<{ nickname: string; puntos: number }[] | null>(null);
  const [puntajesActuales, setPuntajesActuales] = useState<{ nickname: string; puntos: number }[]>([]);

  // Generar código aleatorio
  const generarCodigo = (longitud = 4) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < longitud; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Crear sala
  const crearSala = () => {
    const nuevoCodigo = generarCodigo();
    setCodigo(nuevoCodigo);
    socket.emit("createRoom", { codigoSala: nuevoCodigo }, (res: { error?: string }) => {
      if (res.error) alert(res.error);
      else alert(`Sala creada! Código: ${nuevoCodigo}`);
    });
  };

  // Iniciar pregunta
  const startQuestion = () => {
    if (!textoPregunta || !correcta) return alert("Completa la pregunta y la respuesta correcta");
    const pregunta: PreguntaType = { texto: textoPregunta, opciones, respuestaCorrecta: correcta, tiempo };
    socket.emit("startQuestion", { codigoSala: codigo, pregunta }, (res: { error?: string }) => {
      if (res.error) alert(res.error);
    });
  };

  // Finalizar juego
  const endGame = () => {
    const audio = new Audio("../../src/sounds/game-over.mp3"); 
    audio.play();
    socket.emit("endGame", { codigoSala: codigo }, (res: { error?: string }) => {
      if (res.error) alert(res.error);
      else alert("Juego finalizado!");
      setPreguntaActiva(null);
    });
  };

  // Contador de pregunta corregido
  useEffect(() => {
    if (!preguntaActiva) return;

    setContador(preguntaActiva.tiempo);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = preguntaActiva.tiempo - elapsed;
      if (remaining <= 0) {
        setContador(0);
        clearInterval(interval);
      } else {
        setContador(remaining);
      }
    }, 200); // actualizamos cada 200ms para mayor precisión

    return () => clearInterval(interval);
  }, [preguntaActiva]);

  // Socket listeners
  useEffect(() => {
    socket.on("updatePlayers", (players: JugadorType[]) => {
      setJugadores(players);
      setPuntajesActuales(players.map(p => ({ nickname: p.nickname, puntos: p.score || 0 })));
    });
    socket.on("newQuestion", (q: PreguntaType) => setPreguntaActiva(q));
    socket.on("endQuestion", () => setPreguntaActiva(null));
    socket.on("roomClosed", () => alert("Sala cerrada"));
    socket.on("gameEnded", (finalScores: { nickname: string; score: number }[]) => {
      setPuntajesFinales(finalScores.map(f => ({ nickname: f.nickname, puntos: f.score })));
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
    <div className="moderador-container">
      <div className="moderador-card">
        <h2>Moderador</h2>
        <p>Código de sala: <strong>{codigo || "Generando..."}</strong></p>
        <button onClick={crearSala}>Crear Sala</button>
        <img src="../img/mario.png" alt="" width={200} height={200} className="img-mario"/>

        <h3>Jugadores conectados</h3>
        <ul>
          {jugadores.map(j => <li key={j.nickname}>{j.nickname}</li>)}
        </ul>

        <h3>Lanzar Pregunta</h3>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          <input
            placeholder="Texto pregunta"
            value={textoPregunta}
            onChange={(e) => setTextoPregunta(e.target.value)}
          />
          {opciones.map((o, i) => (
            <input
              key={i}
              placeholder={`Opción ${i + 1}`}
              value={o}
              onChange={(e) => {
                const newOpts = [...opciones];
                newOpts[i] = e.target.value;
                setOpciones(newOpts);
              }}
            />
          ))}
          <input
            placeholder="Respuesta correcta"
            value={correcta}
            onChange={(e) => setCorrecta(e.target.value)}
          />
          <input
            type="number"
            placeholder="Tiempo (s)"
            value={tiempo}
            onChange={(e) => setTiempo(Number(e.target.value))}
          />
        </div>
        <div>
          <button onClick={startQuestion}>Iniciar Pregunta</button>
          <button className="finalizar" onClick={endGame}>Finalizar Juego</button>
        </div>

        {preguntaActiva && (
          <div style={{ marginTop: 20 }}>
            <h3>Pregunta activa: {preguntaActiva.texto}</h3>
            <p>Tiempo restante: {contador}s</p>
            <Pregunta pregunta={preguntaActiva} />
          </div>
        )}

        {/* Ranking en tiempo real */}
        {puntajesActuales.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3>Ranking Actual</h3>
            <ul>
              {puntajesActuales
                .sort((a, b) => b.puntos - a.puntos)
                .map(j => (
                  <li key={j.nickname}>{j.nickname}: {j.puntos} pts</li>
                ))}
            </ul>
          </div>
        )}

        {/* Puntajes finales */}
        {puntajesFinales && puntajesFinales.length > 0 && (
          <div style={{ marginTop: 20 }}>
            {(() => {
              const maxPuntos = Math.max(...puntajesFinales.map(j => j.puntos));
              const ganadores = puntajesFinales.filter(j => j.puntos === maxPuntos);
              const textoGanador = ganadores.map(g => g.nickname).join(", ");
              return <h3>¡Ganador{ganadores.length > 1 ? "es" : ""}: {textoGanador}!</h3>;
            })()}
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

export default Moderador;
