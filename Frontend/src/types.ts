// src/types.ts
export interface Jugador {
id:string;
  nickname: string;
  score: number;
  answered?: boolean;
}

export interface Pregunta {
  texto: string;
  opciones: string[];
  respuestaCorrecta: string;
  tiempo: number;
  ronda?: number;
}
