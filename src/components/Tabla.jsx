import { usePermisos } from "../permisos.js";

/* Íconos de línea (24x24). Heredan el color del texto. */
const RUTAS = {
  ver: (
    <>
      <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  editar: (
    <>
      <path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" />
      <path d="m15 5 4 4" />
    </>
  ),
  clip: (
    <path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" />
  ),
  historial: (
    <>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m4.9 4.9 14.2 14.2" />
    </>
  ),
  papelera: (
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  revincular: (
    <>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </>
  ),
  power: (
    <>
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
    </>
  ),
};

export function Ico({ nombre, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {RUTAS[nombre]}
    </svg>
  );
}

/** Botón cuadrado con ícono para la columna de acciones. tono: "peligro" | "dorado" | "" */
export function BotonIcono({ icono, titulo, onClick, tono = "", deshabilitado = false, children }) {
  return (
    <button
      type="button"
      className={`ico-btn ${tono}`}
      title={titulo}
      aria-label={titulo}
      disabled={deshabilitado}
      onClick={onClick}
    >
      <Ico nombre={icono} />
      {children}
    </button>
  );
}

/**
 * Tabla de listado.
 *  columnas: [{ titulo, render(fila), alinear: "der", dato: "precios" | "cantidades", fuerte, sinSalto }]
 *  acciones: (fila) => botones (usa BotonIcono o los botones de la app con la prop `icono`)
 *  claseFila: (fila) => string opcional (por ejemplo, para atenuar registros anulados)
 *  interruptor: { titulo, render(fila) } columna angosta al final con el interruptor de estado
 *  vacio: contenido que se muestra cuando no hay filas
 */
export default function Tabla({ columnas, filas, clave, acciones, claseFila, interruptor, vacio = null }) {
  const { puedeVerDato } = usePermisos();
  const visibles = columnas.filter((c) => !c.dato || puedeVerDato(c.dato));

  if (!filas || filas.length === 0) return vacio;

  const clases = (c) =>
    [c.alinear === "der" ? "der" : "", c.fuerte ? "tabla-fuerte" : "", c.sinSalto ? "nw" : ""]
      .filter(Boolean)
      .join(" ");

  return (
    <div className="tabla-datos">
      <div className="tabla-scroll">
        <table>
          <thead>
            <tr>
              {visibles.map((c) => (
                <th key={c.titulo} className={c.alinear === "der" ? "der" : ""}>
                  {c.titulo}
                </th>
              ))}
              {acciones && <th className="tabla-acc der">Acciones</th>}
              {interruptor && <th className="tabla-sw">{interruptor.titulo || "Estado"}</th>}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={clave(fila)} className={claseFila ? claseFila(fila) : ""}>
                {visibles.map((c) => (
                  <td key={c.titulo} className={clases(c)}>
                    {c.render(fila)}
                  </td>
                ))}
                {acciones && (
                  <td className="tabla-acc">
                    <div className="tabla-acciones">{acciones(fila)}</div>
                  </td>
                )}
                {interruptor && <td className="tabla-sw">{interruptor.render(fila)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Texto principal con una línea secundaria debajo (por ejemplo, nombre y correo). */
export const Doble = ({ principal, secundario }) => (
  <>
    <span className="tabla-principal">{principal}</span>
    {secundario ? <span className="tabla-sec">{secundario}</span> : null}
  </>
);


/**
 * Interruptor de estado (Activo / Inactivo) para el final de la fila.
 * Si el rol no puede editar el módulo, se muestra bloqueado.
 */
export function InterruptorEstado({ activo, onCambiar, nombre = "", deshabilitado = false }) {
  const { puede } = usePermisos();
  const bloqueado = deshabilitado || !puede("editar");
  const accion = activo ? "Inactivar" : "Activar";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={`${accion}${nombre ? ` ${nombre}` : ""}`}
      title={bloqueado ? (activo ? "Activo" : "Inactivo") : accion}
      className={`interruptor-estado ${activo ? "on" : ""}`}
      disabled={bloqueado}
      onClick={onCambiar}
    >
      <span className="interruptor-estado-bola" />
    </button>
  );
}
