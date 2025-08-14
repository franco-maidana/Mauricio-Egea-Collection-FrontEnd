// src/services/http.js
const API = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, ""); // ej: "http://localhost:8080/api"

export async function http(path, { method, body, headers, ...rest } = {}) {
  method = method || (body ? "POST" : "GET");

  const extraHeaders = { ...(headers || {}) };

  // No fuerces Content-Type si mandás FormData
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormData && !extraHeaders["Content-Type"]) {
    extraHeaders["Content-Type"] = "application/json";
  }

  // Útil para algunos backends (no molesta)
  if (!extraHeaders["X-Requested-With"]) {
    extraHeaders["X-Requested-With"] = "XMLHttpRequest";
  }

  const res = await fetch(`${API}${path}`, {
    method,
    credentials: "include", // para que envíe/reciba cookies de sesión
    headers: extraHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    cache: "no-store",
    ...rest,
  });

  if (!res.ok) {
    let msg = "Error en la solicitud";
    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      if (import.meta.env.DEV) console.debug("Respuesta no JSON:", e);
    }
    msg = data?.message || data?.error || data?.msg || msg;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  try {
    return await res.json();
  } catch (e) {
    if (import.meta.env.DEV) console.debug("Sin cuerpo JSON:", e);
    return null;
  }
}
