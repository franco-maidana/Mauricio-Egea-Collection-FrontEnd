const API = import.meta.env.VITE_API_URL;

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

export async function http(path, { method, body, headers, ...rest } = {}) {
  method = method || (body ? "POST" : "GET");

  const extraHeaders = {
    "Content-Type": "application/json",
    ...(headers || {}),
  };

  // 👉 si hay cookie CSRF, mandarla como header
  const unsafe = ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
  const csrf =
    getCookie("XSRF-TOKEN") ||
    getCookie("CSRF-TOKEN") ||
    getCookie("csrfToken");

  if (unsafe && csrf && !extraHeaders["X-CSRF-Token"]) {
    extraHeaders["X-CSRF-Token"] = decodeURIComponent(csrf);
  }

  const res = await fetch(`${API}${path}`, {
    method,
    credentials: "include",
    headers: extraHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!res.ok) {
    let msg = "Error en la solicitud";
    let data = null;
    try { data = await res.json(); } catch (e) { if (import.meta.env.DEV) console.debug("Respuesta no JSON", e); }
    msg = (data?.message || data?.error || data?.msg) || msg;
    throw new Error(msg);
  }

  try { return await res.json(); } catch (e) { if (import.meta.env.DEV) console.debug("Sin cuerpo JSON", e); return null; }
}
