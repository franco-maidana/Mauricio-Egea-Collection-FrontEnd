import Header from "./components/Header/Header";
import { Routes, Route, useLocation } from "react-router-dom";

import Inicio from "./pages/Inicio";
import AcercaDe from "./pages/AcercaDe";
import ProductoDetalle from "./pages/ProductoDetalle";

// Páginas (si querés mantenerlas como vistas de página)
import Registro from "./perfil/Registro";

// Modales
import LoginModal from "./components/LoginModal/LoginModal";
import MenuModal from "./components/MenuModal/MenuModal";

export default function App() {
  const location = useLocation();
  const state = location.state;

  // ¿Esta navegación pidió abrir un modal?
  const isModal = state?.modal === true && !!state?.backgroundLocation;
  const backgroundLocation = isModal ? state.backgroundLocation : null;

  return (
    <>
      <Header />
      <main style={{ paddingTop: "var(--header-height)" }}>
        {/* 1) Rutas de fondo (páginas). 
            Si hay modal, mostramos la location de fondo; si no, la actual. */}
        <Routes location={backgroundLocation || location}>
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/nosotros" element={<AcercaDe />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />

          {/* Página de registro opcional (el login modal ya incluye registro dentro) */}
          <Route path="/registro" element={<Registro />} />

          {/* fallback */}
          <Route path="*" element={<Inicio />} />
        </Routes>

        {/* 2) Rutas de modales: solo se montan cuando venís con state.modal */}
        {isModal && (
          <Routes>
            <Route path="/login" element={<LoginModal />} />
            <Route path="/menu" element={<MenuModal />} />
          </Routes>
        )}
      </main>
    </>
  );
}
