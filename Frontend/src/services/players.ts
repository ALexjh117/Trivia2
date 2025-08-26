import { api } from "./api";

// Obtener un jugador por ID
export const obtenerJugador = async (id: number) => {
  try {
    const res = await api.get(`/players/${id}`);
    return res.data.player;
  } catch (error) {
    console.error("Error al obtener jugador:", error);
    throw error;
  }
};

// Listar jugadores de una sala
export const obtenerJugadores = async (roomId: number) => {
  try {
    const res = await api.get(`/rooms/${roomId}/players`);
    return res.data.players;
  } catch (error) {
    console.error("Error al obtener jugadores:", error);
    return [];
  }
};
