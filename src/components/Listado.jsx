import { useEffect, useState } from "react";
import { descargarExcel } from "../utils/listados.js";
import { usePermisos } from "../permisos.js";

/** Pagina un arreglo ya filtrado. */
export function usePaginacion(items, porPagina = 5) {
  const [pagina, setPagina] = useState(1);
  const total = Math.max(1, Math.ceil(items.length / porPagina));
  const actual = Math.min(pagina, total);
  // Al cambiar la búsqueda o los filtros (cambia la cantidad de resultados), vuelve a la página 1.
  useEffect(() => {
    setPagina(1);
  }, [items.length]);
  useEffect(() => {
    if (pagina > total) setPagina(total);
  }, [pagina, total]);
  const inicio = (actual - 1) * porPagina;
  return {
    items: items.slice(inicio, inicio + porPagina),
    todos: items,
    pagina: actual,
    total,
    cantidad: items.length,
    desde: items.length ? inicio + 1 : 0,
    hasta: Math.min(inicio + porPagina, items.length),
    setPagina,
  };
}

/** Barra superior: conteo de resultados y descarga a Excel. */
export function BarraListado({ pag, archivo = "listado", excel = false, columnas = null }) {
  const { puede } = usePermisos();
  return (
    <div className="barra-listado">
      <span>
        {pag.cantidad === 0
          ? "Sin resultados"
          : `Mostrando ${pag.desde}–${pag.hasta} de ${pag.cantidad}`}
      </span>
      {excel && puede("descargar") && (
      <button
        type="button"
        className="btn-descargar"
        disabled={pag.cantidad === 0}
        onClick={() => descargarExcel(pag.todos, archivo, columnas)}
      >
        ↓ Descargar Excel
      </button>
      )}
    </div>
  );
}

/** Controles de paginación. */
export function Paginador({ pag }) {
  if (pag.total <= 1) return null;
  const paginas = Array.from({ length: pag.total }, (_, i) => i + 1);
  return (
    <nav className="paginador" aria-label="Paginación">
      <button type="button" disabled={pag.pagina === 1} onClick={() => pag.setPagina(pag.pagina - 1)}>
        Anterior
      </button>
      {paginas.map((p) => (
        <button
          type="button"
          key={p}
          className={p === pag.pagina ? "on" : ""}
          onClick={() => pag.setPagina(p)}
        >
          {p}
        </button>
      ))}
      <button type="button" disabled={pag.pagina === pag.total} onClick={() => pag.setPagina(pag.pagina + 1)}>
        Siguiente
      </button>
    </nav>
  );
}
