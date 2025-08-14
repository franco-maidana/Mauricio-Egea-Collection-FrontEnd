// src/pages/ProductoDetalle.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http } from "../services/http";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
      
        const res = await http(`/productos/list/${id}`);

        // Tolerancia al formato: {data}, {producto}, {productos}, o el objeto directo
        const raw = res?.data ?? res?.producto ?? res?.productos ?? res;
        const p = Array.isArray(raw) ? raw[0] : raw;

        if (!p) throw new Error("Producto no encontrado");

        // Intentamos varios nombres de campo para la imagen principal
        const imagen =
          p.imagen_url ?? p.imagen ?? p.imagenPrincipal ?? p.foto ?? "/no-image.png";

        if (!cancel) setImg(imagen);
      } catch (e) {
        if (!cancel) setErr(e.message || "Error cargando producto");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [id]);

  if (loading) return <div style={{ padding: "calc(var(--header-height) + 16px) 16px" }}>Cargando…</div>;
  if (err) return <div style={{ padding: "calc(var(--header-height) + 16px) 16px" }}>Error: {err}</div>;

  return (
    <div>
      <img
        src={img}
        alt="Producto"
      />
    </div>
  );
}
