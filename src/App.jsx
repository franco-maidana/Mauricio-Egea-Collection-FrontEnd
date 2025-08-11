// src/App.jsx
import Header from "./components/Header/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import Inicio from "./pages/Inicio";
import InicioSession from "./perfil/InicioSession";
import AcercaDe from "./pages/AcercaDe";
import LoginModal from "./components/LoginModal/LoginModal"; // 👈 nuevo

export default function App() {
  const location = useLocation()
  const state = location.state
  const backgroundLocation = state && state.backgroundLocation

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-height)' }}>
        {/* Rutas “de fondo” */}
        <Routes location={backgroundLocation || location}>
          <Route path="/" element={<Inicio />} />
          <Route path="/nosotros" element={<AcercaDe />} />
          {/* Si entran directo a /login (sin state), se ve la página normal */}
          <Route path="/login" element={<InicioSession />} />
        </Routes>

        {/* Si venimos con state.backgroundLocation, mostramos el modal */}
        {backgroundLocation && (
          <Routes>
            <Route path="/login" element={<LoginModal />} />
          </Routes>
        )}
      </main>
    </>
  );
}
