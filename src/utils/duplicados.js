// Control de documentos repetidos: nadie se puede registrar dos veces con el mismo número.
// Se compara sin puntos, espacios ni mayúsculas, y en NIT sin el dígito de verificación
// (900123456 y 900.123.456-1 son el mismo NIT).
import { leerLista } from "./almacen.js";

/** Forma "limpia" de un número de documento para poder compararlo. */
export function normalizarDocumento(valor, tipoDocumento) {
  let txt = String(valor ?? "").trim().toUpperCase().replace(/[\s.]/g, "");
  if (tipoDocumento === "NIT") txt = txt.split("-")[0];
  return txt;
}

/**
 * Busca en la lista guardada un registro con el mismo número de documento.
 *  - clave / semilla: de la lista (ej. CLAVES.clientes, CLIENTES_SEMILLA)
 *  - campoDocumento: nombre del campo con el número (ej. "identificacion_tributaria")
 *  - campoId + idActual: para no compararse consigo mismo al editar
 * Devuelve el registro repetido o null.
 */
export function buscarDocumentoRepetido({ clave, semilla, campoDocumento, campoId, idActual, numero, tipoDocumento }) {
  const buscado = normalizarDocumento(numero, tipoDocumento);
  if (!buscado) return null;
  return (
    leerLista(clave, semilla).find(
      (r) =>
        (idActual === undefined || idActual === null || String(r[campoId]) !== String(idActual)) &&
        normalizarDocumento(r[campoDocumento], r.tipo_documento) === buscado
    ) || null
  );
}
