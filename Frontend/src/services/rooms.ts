import { api } from "./api";

export async function crearSala(nickname: string) {
  const res = await api.post("/rooms", { nickname });
  return res.data; // { room, player }
}
export async function unirseSala(code: string, nickname: string) {
  const res = await api.post(`/rooms/${code}/join`, { nickname });
  return res.data; // { player, room }
}

export async function obtenerJugadores(roomId: number) {
  const res = await api.get(`/rooms/${roomId}/players`);
  return res.data;
}
