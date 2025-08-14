import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UseAuth } from "../../context/AuthContext";
import "./Header.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = UseAuth();

  // --- buscador
  const [openSearch, setOpenSearch] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  const searchWrapRef = useRef(null);

  useEffect(() => {
    if (openSearch && inputRef.current) inputRef.current.focus();
  }, [openSearch]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenSearch(false);
    const onClickOutside = (e) => {
      if (openSearch && searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setOpenSearch(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [openSearch]);

  const toggleSearch = () => setOpenSearch((v) => !v);
  const submitSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/buscar?q=${encodeURIComponent(term)}`);
    setOpenSearch(false);
  };

  // --- swap de logo según scroll
  const [useAltLogo, setUseAltLogo] = useState(false);

  // Pre-carga de ambos logos (para evitar parpadeo)
  useEffect(() => {
    ["/LogoTienda.png", "/LogosinME.png"].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 480px)").matches;
    const THRESHOLD = small ? 220 : 280;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || window.pageYOffset;
          setUseAltLogo((prev) => (y > THRESHOLD ? true : y <= THRESHOLD ? false : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll(); // estado inicial
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="header">
      <div className={`header__container header--grid ${openSearch ? "is-search-open" : ""}`}>
        {/* IZQUIERDA */}
        <div className="header__left">
          <Link
            to="/menu"
            state={{ modal: true, backgroundLocation: location }}
            className="icon-btn"
            aria-label="Abrir menú"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          <span className="label">Menú</span>

          <div ref={searchWrapRef} className={`search-inline ${openSearch ? "open" : ""}`}>
            <button
              type="button"
              className="icon-btn search-trigger"
              onClick={toggleSearch}
              aria-expanded={openSearch}
              aria-controls="header-search-input"
            >
              <img src="/search.png" alt="" className="search-icon" />
              <span className="label">Buscar</span>
            </button>

            <form className="search-form" onSubmit={submitSearch}>
              <input
                id="header-search-input"
                ref={inputRef}
                type="search"
                className="search-input"
                placeholder="Buscar prendas…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Buscar productos"
              />
            </form>
          </div>
        </div>

        {/* CENTRO: swap de logos */}
        <div className="header__center">
          <Link
            to="/inicio"
            className="brand-link"
            aria-label="Ir al inicio"
            title="Inicio"
            onClick={(e) => {
              // si ya estás en / o /inicio, no cambia la ruta; forzamos scroll arriba
              if (location.pathname === "/" || location.pathname === "/inicio") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
              // además cerramos el buscador si estaba abierto
              setOpenSearch(false);
            }}
          >
            <span className="logoSwap">
              <img
                className={`logo variant v1 ${useAltLogo ? "is-hidden" : "is-visible"}`}
                src="/LogoTienda.png"
                alt="Mauricio Egea Collection"
              />
              <img
                className={`logo variant v2 ${useAltLogo ? "is-visible" : "is-hidden"}`}
                src="/LogosinME.png"
                alt="Mauricio Egea Collection"
              />
            </span>
          </Link>
        </div>



        {/* DERECHA */}
        <nav className="header__right">
          {!loading &&
            (user ? (
              <button type="button" className="link ghost" onClick={logout}>Cerrar sesión</button>
            ) : (
              <Link to="/login" state={{ modal: true, backgroundLocation: location }} className="link">Iniciar sesión</Link>
            ))}
          <Link to="/inicio" className="link">Inicio</Link>
          <Link to="/nosotros" className="link">Nosotros</Link>
          <Link to="/carrito" className="cart-link icon-btn" aria-label="Carrito">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M6 6h15l-1.5 9H7.5L6 6Zm0 0H4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </svg>
            <span className="cart-count">3</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
