import Header from "./components/Header/Header";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Inicio from "./pages/Inicio";
import AcercaDe from "./pages/AcercaDe";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import Registro from "./perfil/Registro";

// Modales
import LoginModal from "./components/LoginModal/LoginModal";
import MenuModal from "./components/MenuModal/MenuModal";

export default function App() {
  const location = useLocation();
  const state = location.state;

  const isModal = state?.modal === true && !!state?.backgroundLocation;
  const backgroundLocation = isModal ? state.backgroundLocation : null;

  return (
    <>
      <Header />
      <main style={{ paddingTop: "var(--header-height)" }}>
        <Routes location={backgroundLocation || location}>
          {/* ✅ Ruta principal SOLO con /inicio */}
          <Route path="/inicio" element={<Inicio />} />

          <Route path="/nosotros" element={<AcercaDe />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/registro" element={<Registro />} />

          {/* ✅ Redireccionar "/" y cualquier ruta desconocida a /inicio */}
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="*" element={<Navigate to="/inicio" />} />
        </Routes>

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
