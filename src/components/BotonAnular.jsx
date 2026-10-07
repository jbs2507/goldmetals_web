import { useState } from "react";
import { createPortal } from "react-dom";
import { usePermisos } from "../permisos.js";

/**
 * Botón "Anular" con confirmación y motivo obligatorio.
 * Los registros no se eliminan ni se editan: se anulan y queda el rastro.
 */
export default function BotonAnular({ entidad = "registro", nombre = "", deshabilitado = false, onConfirmar }) {
  const { puede } = usePermisos();
  const [abierto, setAbierto] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");

  const cerrar = () => {
    setAbierto(false);
    setMotivo("");
    setError("");
  };

  const confirmar = () => {
    if (motivo.trim().length < 5) {
      setError("Escribe el motivo de la anulación (mínimo 5 caracteres)");
      return;
    }
    onConfirmar && onConfirmar(motivo.trim());
    cerrar();
  };

  if (!puede("eliminar")) return null;

  return (
    <>
      <button type="button" className="btn-eliminar" disabled={deshabilitado} onClick={() => setAbierto(true)}>
        Anular
      </button>

      {abierto && createPortal(
        <div className="modal-eliminar-overlay" onClick={cerrar}>
          <div className="modal-eliminar" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>Anular {entidad}</h3>
            <p>
              ¿Seguro que deseas anular
              {nombre ? <strong> {nombre}</strong> : ` este ${entidad}`}? El registro se conserva con el
              estado ANULADO y no podrá modificarse.
            </p>
            <label className="motivo-anulacion">
              Motivo <span>*</span>
              <textarea rows="3" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
            </label>
            {error && <span className="err">{error}</span>}
            <div className="modal-eliminar-actions">
              <button type="button" className="btn-modal-cancelar" onClick={cerrar}>
                Volver
              </button>
              <button type="button" className="btn-modal-eliminar" onClick={confirmar}>
                Sí, anular
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
