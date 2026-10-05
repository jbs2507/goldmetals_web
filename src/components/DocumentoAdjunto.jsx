import { useId } from "react";
import { descargarArchivo, pdfEjemplo, verArchivo } from "../utils/documentos.js";
import { usePermisos } from "../permisos.js";

/**
 * Selector de documentos reutilizable (Compras, Proveedores, Clientes y Ventas).
 * - "Adjuntar documento" abre el selector de archivos del equipo.
 * - "Ver" y "Descargar" permiten revisar el documento (el administrador debe validarlos).
 * En modo consulta, si aún no hay archivo real (prototipo sin backend), se usa un PDF de ejemplo.
 */
export default function DocumentoAdjunto({
  titulo,
  descripcion = "Archivo PDF",
  name,
  value,
  onChange,
  accept = ".pdf",
  disabled = false,
  error = "",
}) {
  const { puede } = usePermisos();
  const reactId = useId();
  const inputId = `documento-${name}-${reactId.replace(/:/g, "")}`;

  const esArchivo = value instanceof Blob;
  // Documento ya cargado antes (llega solo el nombre del archivo desde el registro guardado).
  const esExistente = typeof value === "string" && value.length > 0;
  const hayDocumento = esArchivo || esExistente;
  const nombreArchivo = esArchivo ? value.name : esExistente ? value : `${titulo}.pdf`;
  const obtenerBlob = () => (esArchivo ? value : pdfEjemplo(titulo));

  return (
    <div className="documento-unificado">
      <div className="documento-unificado-info">
        <strong>{titulo}</strong>
        <small>{hayDocumento ? nombreArchivo : disabled ? "Sin documento cargado" : descripcion}</small>
      </div>

      <div className="documento-acciones">
        {hayDocumento && (
          <>
            {puede("ver") && (
              <button type="button" className="btn-doc-accion" onClick={() => verArchivo(obtenerBlob())}>
                Ver
              </button>
            )}
            {puede("descargar") && (
              <button
                type="button"
                className="btn-doc-accion"
                onClick={() => descargarArchivo(obtenerBlob(), nombreArchivo)}
              >
                Descargar
              </button>
            )}
          </>
        )}

        {!disabled && (
          <label htmlFor={inputId} className="btn-adjuntar-unificado">
            {esArchivo || esExistente ? "Cambiar documento" : "Adjuntar documento"}
            <input id={inputId} type="file" name={name} accept={accept} onChange={onChange} />
          </label>
        )}
      </div>

      {error && <span className="err documento-unificado-error">{error}</span>}
    </div>
  );
}
