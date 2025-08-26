import { io } from "socket.io-client";

export const socket = io("http://localhost:3333", { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Conectado con id:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Error de conexión:", err);
});
