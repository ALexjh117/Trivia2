import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Estructura en memoria para salas y jugadores
const rooms = {}; // { [codigoSala]: { jugadores: [], preguntas: [] } }

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);

  // Crear sala
  socket.on("createRoom", ({ codigoSala }, callback) => {
    if (rooms[codigoSala]) return callback({ error: "Sala ya existe" });
    rooms[codigoSala] = { jugadores: [], preguntas: [] };
    console.log("Sala creada:", codigoSala);
    callback({ success: true });
  });

  // Unirse a sala
  socket.on("joinRoom", ({ codigoSala, nickname }, callback) => {
    const room = rooms[codigoSala];
    if (!room) return callback({ error: "Sala no existe" });

    const jugador = { id: socket.id, nickname, score: 0, answered: false };
    room.jugadores.push(jugador);
    socket.join(codigoSala);

    // Emitir lista actualizada
    io.to(codigoSala).emit(
      "updatePlayers",
      room.jugadores.map(({ id, nickname, score, answered }) => ({
        id,
        nickname,
        score,
        answered,
      }))
    );

    callback({ jugadores: room.jugadores });
  });

  // Lanzar pregunta
  socket.on("startQuestion", ({ codigoSala, pregunta }, callback) => {
    const room = rooms[codigoSala];
    if (!room) return callback({ error: "Sala no existe" });

    // Marcar jugadores como no respondidos
    room.jugadores.forEach((j) => (j.answered = false));
    room.preguntas.push(pregunta);

    io.to(codigoSala).emit("newQuestion", pregunta);
    callback({ success: true });

    // Fin automático de la pregunta después de tiempo
    setTimeout(() => {
      io.to(codigoSala).emit("endQuestion");
      // Opcional: calcular puntuaciones
      io.to(codigoSala).emit(
        "updatePlayers",
        room.jugadores.map(({ id, nickname, score,answered }) => ({
          id,
          nickname,
          score,
          answered,
        }))
      );
    }, pregunta.tiempo * 1000);
  });

  // Responder pregunta
  socket.on("answer", ({ codigoSala, respuesta }, callback) => {
    const room = rooms[codigoSala];
    if (!room) return callback({ error: "Sala no existe" });

    const jugador = room.jugadores.find((j) => j.id === socket.id);
    if (!jugador) return callback({ error: "Jugador no encontrado" });
    if (jugador.answered) return callback({ error: "Ya respondiste" });

    const ultimaPregunta = room.preguntas[room.preguntas.length - 1];
    if (!ultimaPregunta) return callback({ error: "No hay pregunta activa" });
    const correcta = respuesta === ultimaPregunta.respuestaCorrecta;

    if (correcta) jugador.score += 1;
    jugador.answered = true;

    io.to(codigoSala).emit(
  "updatePlayers",
  room.jugadores.map(({ id, nickname, score, answered }) => ({
    id,
    nickname,
    score,
    answered,
  }))
);


   callback({ success: true, correcta }); // <-- devolvemos si acertó
  });

  // Cerrar sala
  socket.on("closeRoom", ({ codigoSala }) => {
    delete rooms[codigoSala];
    io.to(codigoSala).emit("roomClosed");
  });


  // Finalizar juego
socket.on("endGame", ({ codigoSala }, callback) => {
  const room = rooms[codigoSala];
  if (!room) return callback({ error: "Sala no existe" });

  // Preparar puntajes finales
  const finalScores = room.jugadores.map(({ nickname, score }) => ({ nickname, score }));

  // Emitir a todos los jugadores
  io.to(codigoSala).emit("gameEnded", finalScores);

  // Opcional: cerrar la sala
  delete rooms[codigoSala];

  callback({ success: true });
});

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
    // Opcional: remover jugador de todas las salas
    Object.values(rooms).forEach((room) => {
      room.jugadores = room.jugadores.filter((j) => j.id !== socket.id);
    });
  });
});

server.listen(3001, () => console.log("Servidor escuchando en puerto 3001"));
