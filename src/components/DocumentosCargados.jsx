import { useState } from "react";
import { createPortal } from "react-dom";
import { descargarArchivo, pdfEjemplo, verArchivo } from "../utils/documentos.js";
import { usePermisos } from "../permisos.js";

/**
 * Botón "Documentos" que abre una ventana con los documentos cargados en el registro.
 * Cada documento se puede ver o descargar. Si falta alguno, se marca como pendiente.
 *
 * documentos: [{ titulo: "Factura", valor: "factura.pdf" | File | null }]
 */
export default function DocumentosCargados({
  titulo = "Documentos cargados",
  documentos = [],
  className = "btn-historial-produccion",
}) {
  const [abierto, setAbierto] = useState(false);
  const { puede } = usePermisos();
  const cargados = documentos.filter((d) => d.valor).length;

  const nombreDe = (d) => (d.valor instanceof Blob ? d.valor.name : String(d.valor));
  const blobDe = (d) => (d.valor instanceof Blob ? d.valor : pdfEjemplo(d.titulo));

  return (
    <>
      <button type="button" className={className} onClick={() => setAbierto(true)}>
        Documentos ({cargados}/{documentos.length})
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
            <p>Documentos que se cargaron en este registro.</p>

            <ul className="documentos-cargados-lista">
              {documentos.map((d) => (
                <li key={d.titulo} className="documento-unificado">
                  <div className="documento-unificado-info">
                    <strong>{d.titulo}</strong>
                    <small>{d.valor ? nombreDe(d) : "Pendiente de cargar"}</small>
                  </div>
                  {d.valor && (
                    <div className="documento-acciones">
                      {puede("ver") && (
                        <button type="button" className="btn-doc-accion" onClick={() => verArchivo(blobDe(d))}>
                          Ver
                        </button>
                      )}
                      {puede("descargar") && (
                        <button
                          type="button"
                          className="btn-doc-accion"
                          onClick={() => descargarArchivo(blobDe(d), nombreDe(d))}
                        >
                          Descargar
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>

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
