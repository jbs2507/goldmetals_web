import { useState } from "react";
import { createPortal } from "react-dom";
import { Ico } from "../Tabla.jsx";
import { hoyISO } from "../../utils/validaciones.js";

/**
 * Botón "Revincular" para empleados que ya no están vinculados.
 * Pide la nueva fecha de ingreso y, al confirmar, onConfirmar(fecha) deja al empleado
 * ACTIVO y sin fecha de finalización.
 */
export default function RevincularEmpleado({ empleado, onConfirmar, icono = false }) {
  const [abierto, setAbierto] = useState(false);
  const [fecha, setFecha] = useState(hoyISO());
  const [error, setError] = useState("");

  // La revinculación no puede ser anterior a hoy ni a la fecha de finalización.
  const minima =
    empleado.fecha_finalizacion && empleado.fecha_finalizacion > hoyISO() ? empleado.fecha_finalizacion : hoyISO();

  const abrir = () => {
    setFecha(hoyISO());
    setError("");
    setAbierto(true);
  };

  const confirmar = () => {
    if (!fecha) return setError("Indica la fecha de revinculación");
    if (empleado.fecha_finalizacion && fecha < empleado.fecha_finalizacion)
      return setError("No puede ser anterior a la fecha de finalización");
    if (fecha < hoyISO()) return setError("La fecha no puede ser anterior a hoy");
    onConfirmar(fecha);
    setAbierto(false);
  };

  return (
    <>
      <button
        type="button"
        className={icono ? "ico-btn dorado" : "btn-revincular-empleado"}
        title={icono ? "Revincular" : undefined}
        aria-label={icono ? "Revincular" : undefined}
        onClick={abrir}
      >
        {icono ? <Ico nombre="revincular" /> : "Revincular"}
      </button>

      {abierto && createPortal(
        <div className="modal-eliminar-overlay" onClick={() => setAbierto(false)}>
          <div
            className="modal-eliminar"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Revincular empleado</h3>
            <p>
              <strong>{empleado.nombre_completo}</strong> volverá a estar activo. La nueva fecha de
              ingreso reemplaza a la anterior y se quita la fecha de finalización.
            </p>

            <label className="motivo-anulacion">
              Fecha de revinculación <span>*</span>
              <input
                type="date"
                value={fecha}
                min={minima}
                onChange={(e) => {
                  setFecha(e.target.value);
                  setError("");
                }}
              />
            </label>
            {error && <span className="err">{error}</span>}

            <div className="modal-eliminar-actions">
              <button type="button" className="btn-modal-cancelar" onClick={() => setAbierto(false)}>
                Cancelar
              </button>
              <button type="button" className="btn-modal-eliminar" onClick={confirmar}>
                Revincular
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
