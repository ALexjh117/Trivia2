import { api } from "./api";

export async function crearPregunta(
  roomCode: string,
  text: string,
  options: string[]
) {
  const res = await api.post(`/rooms/${roomCode}/questions`, {
    text,
    options,
  });
  return res.data.question;
}

export async function obtenerSiguientePregunta(roomCode: string) {
  const res = await api.get(`/rooms/${roomCode}/next-question`);
  return res.data.question;
}
