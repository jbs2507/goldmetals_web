import { usePermisos } from "../permisos.js";

/**
 * Muestra a sus hijos solo si el rol tiene el privilegio.
 *   <Permiso accion="crear"> ... </Permiso>      -> según el módulo de la pantalla actual
 *   <Permiso dato="precios"> ... </Permiso>       -> información sensible (precios, cantidades, estadisticas)
 * Con `alternativa` se muestra otro contenido cuando no hay permiso.
 */
export default function Permiso({ accion, dato, modulo, alternativa = null, children }) {
  const permisos = usePermisos();
  const permitido = dato ? permisos.puedeVerDato(dato) : permisos.puede(accion, modulo);
  return permitido ? children : alternativa;
}
