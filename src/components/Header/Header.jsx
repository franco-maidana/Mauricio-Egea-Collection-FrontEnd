// src/components/Header/Header.jsx
import { Link, useLocation } from 'react-router-dom'
import { UseAuth } from '../../context/AuthContext'
import './Header.css'

export default function Header() {
  const location = useLocation()
  const { user, logout, loading } = UseAuth()

  // === BLOQUE NUEVO: datos para el avatar ===
  const avatarSrc = user?.avatar_url || '/avatar-default.png' // dejá este archivo en /public
  const avatarAlt = `Avatar de ${user?.name || user?.email || 'usuario'}`

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <button className="hamburger" aria-label="Abrir menú">☰</button>
          <img className="logo" src="/LogoTienda.png" alt="Mauricio Egea Collection" />
        </div>

        <nav className="header__right">
          {!loading && (
            user ? (
              <>
                {/* === AVATAR DEL USUARIO (en vez del nombre) === */}
                <Link to="/perfil" className="avatar" title="Ir a mi perfil">
                  <img src={avatarSrc} alt={avatarAlt} />
                </Link>
                {/* === BOTÓN CERRAR SESIÓN === */}
                <button type="button" className="link" onClick={logout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                state={{ modal: true, backgroundLocation: location }}
                className="link"
              >
                Iniciar sesión
              </Link>
            )
          )}

          <Link to="/nosotros" className="link">Nosotros</Link>

          <Link to="/carrito" className="cart-link">
            <img src="/shoppingCart.png" alt="Carrito" className="cart-icon" />
            <span className="cart-count">3</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
