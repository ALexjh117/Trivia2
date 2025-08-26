import { api } from "./api";

// 🔹 Obtener el marcador de una sala
export async function obtenerScore(roomId: number) {
  const res = await api.get(`/rooms/${roomId}/score`);
  return res.data.scoreboard; // devuelve [{ playerId, nickname, score }]
}
