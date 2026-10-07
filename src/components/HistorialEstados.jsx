import { useState } from "react";
import { createPortal } from "react-dom";
import { formatearFecha } from "../data/insumosVinculos.js";

const capitalizar = (t) =>
  String(t || "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());

/**
 * Botón "Historial" que abre una ventana con todos los estados por los que ha
 * pasado un registro y la fecha de cada cambio (del más reciente al más antiguo).
 */
export default function HistorialEstados({
  titulo = "Historial",
  historial = [],
  etiqueta = capitalizar,
  className = "btn-historial-produccion",
}) {
  const [abierto, setAbierto] = useState(false);
  const lista = [...historial].reverse();

  return (
    <>
      <button type="button" className={className} onClick={() => setAbierto(true)}>
        Historial
      </button>

      {abierto && createPortal(
        <div className="modal-eliminar-overlay" onClick={() => setAbierto(false)}>
          <div
            className="modal-eliminar modal-historial"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{titulo}</h3>
            <p>Estados por los que ha pasado y sus fechas.</p>

            {lista.length === 0 ? (
              <p>Aún no hay movimientos registrados.</p>
            ) : (
              <ol className="historial-lista">
                {lista.map((h, i) => (
                  <li key={`${h.estado}-${h.fecha}-${i}`} className="historial-item">
                    <span className={`historial-punto historial-${String(h.estado).toLowerCase()}`} />
                    <div>
                      <strong>{etiqueta(h.estado)}</strong>
                      <small>{formatearFecha(h.fecha)}</small>
                      {h.motivo && <em>{h.motivo}</em>}
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <div className="modal-eliminar-actions">
              <button type="button" className="btn-modal-cancelar" onClick={() => setAbierto(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
