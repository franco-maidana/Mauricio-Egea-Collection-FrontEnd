import { createContext, useContext, useEffect, useState } from "react";
import { http } from "../services/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hidratar sesión al montar
  useEffect(() => {
    (async () => {
      try {
        const me = await http("/auth/me");      // debe devolver { user } o 401
        setUser(me?.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Cerrar sesión (CSRF + POST /auth/logout)
  async function logout() {
    try {
      const { csrfToken } = await http("/csrf-token");
      await http("/auth/logout", {
        method: "POST",
        headers: { "x-csrf-token": csrfToken },
      });
      setUser(null);
    } catch (e) {
      if (import.meta.env.DEV) console.debug("Error al cerrar sesión:", e);
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
