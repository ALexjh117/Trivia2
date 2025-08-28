import React from "react";
import type { Jugador as JugadorType } from "../types";


interface Props {
  jugadores: JugadorType[];
}

const ListaJugadores: React.FC<Props> = ({ jugadores }) => (
  <div>
    <h3>Jugadores:</h3>
    <ul>
      {jugadores.map((j, i) => (
        <li key={i}>
          {j.nickname} - {j.score}
        </li>
      ))}
    </ul>
  </div>
);

export default ListaJugadores;
