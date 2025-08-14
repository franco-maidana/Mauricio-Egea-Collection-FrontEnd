// src/components/LoginModal/LoginModal.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InicioSession from "../../perfil/InicioSession";
import Registro from "../../perfil/Registro";
import "./LoginModal.css";

export default function LoginModal() {
  const navigate = useNavigate();
  const [modo, setModo] = useState("login"); // "login" | "registro"

  const cerrar = () => navigate(-1);

  return (
    <div className="drawerOverlay" onClick={cerrar}>
      <aside className="drawerPanel" onClick={(e) => e.stopPropagation()}>
        <button className="drawerClose" onClick={cerrar} aria-label="Cerrar">×</button>

        {modo === "login" ? (
          <>
            <InicioSession onSuccessClose closeDelayMs={3000} onSwitchMode={() => setModo("registro")} />
            {/* SOLO en login muestro el switch */}
            <p className="drawerSwitch">
              ¿No tenés cuenta?{" "}
              <button type="button" className="drawerLinkBtn" onClick={() => setModo("registro")}>
                Crear cuenta
              </button>
            </p>
          </>
        ) : (
          <>
            {/* En registro NO muestro el drawerSwitch porque Registro ya trae su botón */}
            <Registro onSuccessClose closeDelayMs={3000} onSwitchMode={() => setModo("login")} />
          </>
        )}
      </aside>
    </div>
  );
}
