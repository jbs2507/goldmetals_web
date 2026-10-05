import { useState } from "react";
import { usePermisos } from "../permisos.js";

/**
 * Botón "Eliminar" con ventana de confirmación.
 * Uso:
 *   <BotonEliminar
 *     entidad="cliente"
 *     nombre={cliente.nombre}
 *     onConfirmar={() => eliminarCliente(cliente.id_cliente)}
 *   />
 */
export default function BotonEliminar({
  entidad = "registro",
  nombre = "",
  onConfirmar,
}) {
  const { puede } = usePermisos();
  const [abierto, setAbierto] = useState(false);

  const confirmar = () => {
    setAbierto(false);
    if (onConfirmar) onConfirmar();
  };

  if (!puede("eliminar")) return null;

  return (
    <>
      <button
        type="button"
        className="btn-eliminar"
        onClick={() => setAbierto(true)}
      >
        Eliminar
      </button>

      {abierto && (
        <div
          className="modal-eliminar-overlay"
          onClick={() => setAbierto(false)}
        >
          <div
            className="modal-eliminar"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Eliminar {entidad}</h3>

            <p>
              ¿Seguro que deseas eliminar
              {nombre ? <strong> {nombre}</strong> : ` este ${entidad}`}?
              Esta acción no se puede deshacer.
            </p>

            <div className="modal-eliminar-actions">
              <button
                type="button"
                className="btn-modal-cancelar"
                onClick={() => setAbierto(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-modal-eliminar"
                onClick={confirmar}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
