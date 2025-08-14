// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { http } from "../services/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hidratar sesión al montar
  useEffect(() => {
    let alive = true;

    async function loadMe() {
      try {
        // Backend debe exponer GET /auth/me -> { user } o 401
        const me = await http("/auth/me");
        if (!alive) return;
        setUser(me && me.user ? me.user : null);
      } catch (err) {
        if (alive) setUser(null);
        if (import.meta.env.DEV) console.debug("loadMe error:", err);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadMe();
    return () => { alive = false; };
  }, []);

  // Cerrar sesión (sin CSRF)
  async function logout() {
    try {
      // Backend debe exponer POST (o GET) /auth/logout
      await http("/auth/logout", { method: "POST" });
    } catch (err) {
      // Evita warnings de linter y ayuda en dev
      if (import.meta.env.DEV) console.debug("logout request error:", err);
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function UseAuth() {
  return useContext(AuthContext);
}
