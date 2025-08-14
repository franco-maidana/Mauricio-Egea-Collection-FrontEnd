// src/pages/Inicio.jsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./css/Inicio.css";
import { http } from "../services/http";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

export default function Inicio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await http("/productos/list");
        const list = res?.data || res?.productos || [];
        if (!cancel) setItems(list);
      } catch (e) {
        if (!cancel) setErr(e.message || "Error cargando productos");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  const hasItems = useMemo(() => items && items.length > 0, [items]);

  if (loading) return <div className="home-wrap"><p>Cargando productos…</p></div>;
  if (err)     return <div className="home-wrap"><p>Error: {err}</p></div>;

  return (
    <div className="home-wrap">
      {!hasItems ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ul className="products-grid">
          {items.map((p, idx) => {
            const id = p.id_producto ?? p.id ?? p.producto_id ?? null;
            const nombre = p.nombre || "Producto";
            const img = p.imagen_url || p.imagen || "/no-image.png";

            // precios + descuento
            const precioBase  = Number(p.precio_base ?? p.precio ?? 0);
            const precioFinal = Number(p.precio_final ?? p.precio_unitario ?? precioBase);
            const tieneDesc   = precioBase > 0 && precioFinal < precioBase;
            const pct         = tieneDesc ? Math.round((1 - precioFinal / precioBase) * 100) : 0;

            return (
              <li key={id ?? `p-${idx}`} className="card">
                <Link to={`/producto/${id ?? ""}`} className="card-link" aria-label={nombre}>
                  <div className="card-img">
                    <img src={img} alt={nombre} loading="lazy" />
                    {tieneDesc && <span className="img-badge">-{pct}%</span>}
                  </div>

                  <div className="card-body">
                    <h3 className="card-title">{nombre}</h3>

                    <div className="price-row">
                      {tieneDesc && <span className="price-old">{money.format(precioBase)}</span>}
                      <span className="price-now">{money.format(precioFinal)}</span>
                    </div>

                    <div className="meta-row">
                      {p.marca && <span className="pill">{p.marca}</span>}
                      {(p.categoria_nombre || p.categoria) && (
                        <span className="pill">{p.categoria_nombre || p.categoria}</span>
                      )}
                      {/* {p.descuento_global_activo && <span className="pill outline">Desc. global</span>} */}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
