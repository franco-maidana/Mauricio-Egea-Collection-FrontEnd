import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./css/Registro.css";
import { http } from "../services/http";
import { UseAuth } from "../context/AuthContext";

export default function Registro({ onSuccessClose = true, closeDelayMs = 1500, onSwitchMode }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ver1, setVer1] = useState(false);
  const [ver2, setVer2] = useState(false);

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = UseAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setOk(""); setError("");

    if (!name.trim()) return setError("Ingresá tu nombre");
    if (!email.trim()) return setError("Ingresá tu email");
    if (!password) return setError("Ingresá una contraseña");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres");
    if (password !== confirm) return setError("Las contraseñas no coinciden");

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("name", name);
      fd.append("last_name", lastName);
      fd.append("email", email);
      fd.append("password", password);

      const data = await http("/users/create", { method: "POST", body: fd });

      setUser(data?.user || null);
      setOk(data?.message || "Registro exitoso");

      if (onSuccessClose) {
        setTimeout(() => {
          if (location.state?.backgroundLocation) navigate(-1);
          else navigate("/inicio");
        }, closeDelayMs);
      }
    } catch (err) {
      setError(err.message || "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="registro-container">
      <h1>Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="registro-form" autoComplete="on" aria-busy={loading}>
        {ok && <p className="form-ok">{ok}</p>}
        {error && <p className="form-error">{error}</p>}

        <div className="form-row">
          <div className="form-field">
            <label>Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} required />
          </div>
          <div className="form-field">
            <label>Apellido</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} />
          </div>
        </div>

        <div className="form-field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Contraseña</label>
            <div className="pwd-group">
              <input
                type={ver1 ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button type="button" onClick={() => setVer1(v => !v)}>
                {ver1 ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
          <div className="form-field">
            <label>Repetir contraseña</label>
            <div className="pwd-group">
              <input
                type={ver2 ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                required
              />
              <button type="button" onClick={() => setVer2(v => !v)}>
                {ver2 ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Creando…" : "Crear cuenta"}
        </button>

        <p className="login-link">
          {typeof onSwitchMode === "function" ? (
            <button type="button" className="drawerLinkBtn" onClick={onSwitchMode}>
              ¿Ya tenés cuenta? Iniciar sesión
            </button>
          ) : (
            <Link to="/login" state={{ modal: true }}>¿Ya tenés cuenta? Iniciar sesión</Link>
          )}
        </p>
      </form>
    </section>
  );
}
