import { useState } from "react";

const hoyISO = () => new Date().toISOString().slice(0, 10);

/**
 * Botón "Revincular" para empleados que ya no están vinculados.
 * Pide la nueva fecha de ingreso y, al confirmar, onConfirmar(fecha) deja al empleado
 * ACTIVO y sin fecha de finalización.
 */
export default function RevincularEmpleado({ empleado, onConfirmar }) {
  const [abierto, setAbierto] = useState(false);
  const [fecha, setFecha] = useState(hoyISO());
  const [error, setError] = useState("");

  const minima = empleado.fecha_finalizacion || undefined;

  const abrir = () => {
    setFecha(hoyISO());
    setError("");
    setAbierto(true);
  };

  const confirmar = () => {
    if (!fecha) return setError("Indica la fecha de revinculación");
    if (minima && fecha < minima) return setError("No puede ser anterior a la fecha de finalización");
    onConfirmar(fecha);
    setAbierto(false);
  };

  return (
    <>
      <button type="button" className="btn-revincular-empleado" onClick={abrir}>
        Revincular
      </button>

      {abierto && (
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
        </div>
      )}
    </>
  );
}
