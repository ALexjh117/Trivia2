import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Páginas
import Inicio from "./pages/Inicio";
import PantallaPrincipal from "./pages/PantallaPrincipal";

// Flujo Jugador
import Jugador from "./pages/Jugador";
import Reglas from "./pages/Reglas";
import Pregunta from "./pages/Pregunta";
import Puntaje from "./pages/Puntaje";

// Flujo Moderador
import Marcador from "./pages/Marcador";
import CrearSala from "./pages/CrearSala";
import CrearPregunta from "./pages/CrearPregunta";
import UnirseSala from "./pages/UnirseSala";

function App() {
  return (
    <Router>
      <Routes>
        {/* Pantalla inicial */}
        <Route path="/" element={<Inicio />} />

        {/* Menú principal */}
        <Route path="/pantalla-principal" element={<PantallaPrincipal />} />

        {/* === FLUJO JUGADOR === */}
        <Route path="/jugador" element={<Jugador />} />
        <Route path="/puntaje" element={<Puntaje />} />
        <Route path="/unirsesala" element={<UnirseSala />} />
        <Route path="/reglas" element={<Reglas />} />
        <Route path="/pregunta" element={<Pregunta />} />

        {/* === FLUJO MODERADOR === */}

        <Route path="/crearsala" element={<CrearSala />} />
        <Route path="/crearpregunta" element={<CrearPregunta />} />

        <Route path="/marcador" element={<Marcador />} />
      </Routes>
    </Router>
  );
}

export default App;
