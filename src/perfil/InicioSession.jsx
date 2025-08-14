import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./css/InicioSession.css";
import { http } from "../services/http";
import { UseAuth } from "../context/AuthContext";

export default function InicioSession({
  onSuccessClose = false,
  closeDelayMs = 2000,
  onSwitchMode, // 👈 importante
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ver, setVer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const navigate = useNavigate();
  const { setUser } = UseAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    if (!email || !password) {
      setError("Completá email y contraseña");
      return;
    }

    try {
      setLoading(true);
      const data = await http("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      setUser(data?.user || null);
      setOk(data?.message || "Inicio de sesión exitoso");

      if (onSuccessClose) {
        setTimeout(() => navigate(-1), closeDelayMs);
      }
    } catch (err) {
      setOk("");
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    const API = import.meta.env.VITE_API_URL;
    window.location.href = `${API}/auth/google`;
  };

  return (
    <section className="login">
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit} className="login__form" autoComplete="on" aria-busy={loading}>
        {ok && <p className="login__ok" role="status" aria-live="polite">{ok}</p>}
        {error && <p className="login__error" role="alert">{error}</p>}

        <label>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </label>

        <label>
          Contraseña
          <div className="login__pwd">
            <input
              type={ver ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setVer((v) => !v)}
              className="login__toggle"
              disabled={loading}
            >
              {ver ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </label>

        <div className="login__actions">
          <button type="submit" disabled={loading}>
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </div>

        <div className="login__Google">
          <button type="button" onClick={handleGoogle} disabled={loading}>
            <img src="/Google.png" alt="Google" />
            {loading ? "Ingresando…" : "Continuar Con Google"}
          </button>
        </div>

        <div className="login__links">
          <a href="#" onClick={(e) => e.preventDefault()}> ¿ Olvidaste tu contraseña ? </a>

          {/* Si el modal nos dio onSwitchMode, usamos eso. Si no, linkeamos a /registro */}
          {typeof onSwitchMode === "function" ? (
            <button type="button" className="drawerLinkBtn" onClick={onSwitchMode}>
              Registrarme
            </button>
          ) : (
            <Link to="/registro" state={{ modal: true }}>Registrarme</Link>
          )}
        </div>
      </form>
    </section>
  );
}
