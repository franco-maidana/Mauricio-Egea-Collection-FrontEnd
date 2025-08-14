import { useNavigate, useLocation } from "react-router-dom";
import "./css/MenuModal.css";

export default function MenuModal() {
  const navigate = useNavigate();
  const location = useLocation();

  // Si llegaste a /menu con state.backgroundLocation, usalo; 
  // si no, usa la ubicación actual como fallback.
  const baseBg = location.state?.backgroundLocation || location;

  const cerrar = () => navigate(-1);
  const go = (to) => navigate(to, { replace: true });

  const abrirLoginModal = () =>
    navigate("/login", {
      state: { modal: true, backgroundLocation: baseBg },
    });


  return (
    <div className="menuOverlay" onClick={cerrar} role="presentation">
      <aside
        className="menuPanel"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="menuClose" onClick={cerrar} aria-label="Cerrar">×</button>

        <div className="menuHeader">
          <span className="menuTitle">Menú</span>
        </div>

        <nav className="menuNav">
          <button className="menuItem" onClick={() => go("/inicio")}>Inicio</button>
          <button className="menuItem" onClick={() => go("/productos")}>Productos</button>
          <button className="menuItem" onClick={() => go("/ofertas")}>Ofertas</button>
          <button className="menuItem" onClick={() => go("/nosotros")}>Nosotros</button>
          <button className="menuItem" onClick={() => go("/contacto")}>Contacto</button>

          <div className="menuDivider" />

          {/* OJO: acá NO cerramos con navigate(-1).
              Navegamos a /login con estado de modal y el background correcto */}
          <button className="menuItem" onClick={abrirLoginModal}>Iniciar sesión</button>
          {/* <button className="menuItem" onClick={abrirRegistroModal}>Crear cuenta</button> */}

          <div className="menuDivider" />
          <button className="menuItem" onClick={() => go("/carrito")}>Carrito</button>
        </nav>
      </aside>
    </div>
  );
}
