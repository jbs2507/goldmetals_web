import { useId } from "react";

/**
 * Selector de documentos reutilizable para mantener el mismo diseño
 * en Compras, Proveedores, Clientes y Ventas.
 * Al pulsar "Adjuntar documento" se abre la biblioteca/selector de archivos
 * del equipo y el nombre del archivo queda visible en el formulario.
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
  const reactId = useId();
  const inputId = `documento-${name}-${reactId.replace(/:/g, "")}`;

  return (
    <div className="documento-unificado">
      <div className="documento-unificado-info">
        <strong>{titulo}</strong>
        <small>{value?.name || descripcion}</small>
      </div>

      <label
        htmlFor={inputId}
        className={`btn-adjuntar-unificado${disabled ? " disabled" : ""}`}
      >
        Adjuntar documento
        <input
          id={inputId}
          type="file"
          name={name}
          accept={accept}
          onChange={onChange}
          disabled={disabled}
        />
      </label>

      {error && <span className="err documento-unificado-error">{error}</span>}
    </div>
  );
}
