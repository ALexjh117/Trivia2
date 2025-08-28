import React from "react";
import type { Pregunta as PreguntaType } from "../types";

interface Props {
  pregunta: PreguntaType;
  responder?: (resp: string) => void;
}

const Pregunta: React.FC<Props> = ({ pregunta, responder }) => (
  <div style={{ marginTop: 20 }}>
    <h3>{pregunta.texto}</h3>
    {pregunta.opciones.map((o, i) => (
      <button key={i} onClick={() => responder && responder(o)}>
        {o}
      </button>
    ))}
    <p>Ronda {pregunta.ronda} - Tiempo: {pregunta.tiempo}s</p>
  </div>
);

export default Pregunta;
