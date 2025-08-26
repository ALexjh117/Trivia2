import { api } from "./api";

// Evaluar respuestas de un jugador (o varios)
export const enviarRespuestas = async (roomCode: string, answers: any[]) => {
  try {
    const res = await api.post("/answers/evaluate", {
      roomCode,
      answers,
    });
    return res.data; // { results, scoreboard }
  } catch (error) {
    console.error("Error al enviar respuestas:", error);
    throw error;
  }
};
