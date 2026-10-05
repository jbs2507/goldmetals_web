import { useState } from "react";

/**
 * Botón "Cambiar estado" con ventana de confirmación.
 * opciones: [{ valor, etiqueta }] con los estados a los que se puede pasar.
 * onConfirmar(nuevoEstado) deja el estado, la fecha y el historial actualizados en el listado.
 */
export default function CambiarEstado({
  titulo = "Cambiar estado",
  estadoActual,
  opciones = [],
  deshabilitado = false,
  onConfirmar,
  className = "btn-historial-produccion",
}) {
  const [abierto, setAbierto] = useState(false);
  const [nuevo, setNuevo] = useState("");

  const abrir = () => {
    setNuevo(opciones[0]?.valor || "");
    setAbierto(true);
  };

  const confirmar = () => {
    if (!nuevo) return;
    onConfirmar(nuevo);
    setAbierto(false);
  };

  return (
    <>
      <button
        type="button"
        className={className}
        disabled={deshabilitado || opciones.length === 0}
        onClick={abrir}
      >
        Cambiar estado
      </button>

      {abierto && (
        <div className="modal-eliminar-overlay" onClick={() => setAbierto(false)}>
          <div
            className="modal-eliminar"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{titulo}</h3>
            <p>
              Estado actual: <strong>{estadoActual}</strong>. Elige el nuevo estado; se guardará con la fecha de hoy.
            </p>

            <select value={nuevo} onChange={(e) => setNuevo(e.target.value)}>
              {opciones.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.etiqueta}
                </option>
              ))}
            </select>

            <div className="modal-eliminar-actions">
              <button type="button" className="btn-modal-cancelar" onClick={() => setAbierto(false)}>
                Cancelar
              </button>
              <button type="button" className="btn-modal-eliminar" onClick={confirmar}>
                Guardar estado
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
