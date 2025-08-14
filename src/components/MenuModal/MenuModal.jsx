import { Link, useNavigate } from "react-router-dom";
import "./css/MenuModal.css";

export default function MenuModal() {
  const navigate = useNavigate();
  const cerrar = () => navigate(-1);

  return (
    <div className="menuOverlay" onClick={cerrar} role="presentation">
      {/* panel que sale de la izquierda */}
      <aside
        className="menuPanel"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="menuClose" onClick={cerrar} aria-label="Cerrar">×</button>

        {/* Header/brand (opcional) */}
        <div className="menuHeader">
          <span className="menuTitle">Menú</span>
        </div>

        {/* Items del menú */}
        <nav className="menuNav">
          <Link className="menuItem" to="/inicio" onClick={cerrar}>Inicio</Link>
          <Link className="menuItem" to="/productos" onClick={cerrar}>Productos</Link>
          <Link className="menuItem" to="/ofertas" onClick={cerrar}>Ofertas</Link>
          <Link className="menuItem" to="/nosotros" onClick={cerrar}>Nosotros</Link>
          <Link className="menuItem" to="/contacto" onClick={cerrar}>Contacto</Link>
          <div className="menuDivider" />
          <Link className="menuItem" to="/login" state={{ modal: true }} onClick={cerrar}>
            Iniciar sesión
          </Link>
          <Link className="menuItem" to="/registro" state={{ modal: true }} onClick={cerrar}>
            Crear cuenta
          </Link>
          <div className="menuDivider" />
          <Link className="menuItem" to="/carrito" onClick={cerrar}>Carrito</Link>
        </nav>
      </aside>
    </div>
  );
}
