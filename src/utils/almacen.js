// Almacén de datos TEMPORAL en el navegador (localStorage).
//
// Todos los módulos (clientes, compras, pedidos, etc.) leen y guardan sus registros aquí,
// así lo que se registra o edita en un formulario aparece de inmediato en la tabla,
// en la consulta y en la edición, y se conserva al recargar la página.
//
// Cuando esté el backend, basta con reemplazar estas funciones por llamadas a la API.
import { useCallback, useEffect, useState } from "react";

const PREFIJO = "gm-datos-";
const EVENTO = "gm-datos-cambio";

const copiar = (v) => JSON.parse(JSON.stringify(v));

/** Lee la lista guardada. Si todavía no existe, guarda y devuelve la semilla (datos de ejemplo). */
export function leerLista(clave, semilla = []) {
  try {
    const raw = localStorage.getItem(PREFIJO + clave);
    if (raw) {
      const datos = JSON.parse(raw);
      if (Array.isArray(datos)) return datos;
    }
  } catch {
    /* si el dato está dañado se vuelve a la semilla */
  }
  const inicial = copiar(semilla);
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(inicial));
  } catch {
    /* sin almacenamiento: se trabaja solo en memoria */
  }
  return inicial;
}

/** Guarda la lista completa y avisa a las pantallas abiertas para que se actualicen. */
export function guardarLista(clave, lista) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(lista));
  } catch {
    /* sin almacenamiento: no se puede persistir */
  }
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: { clave } }));
  return lista;
}

/**
 * Los archivos (File/Blob) no se pueden guardar en localStorage: se conserva solo el nombre
 * del archivo, que es lo que ya entienden DocumentoAdjunto y DocumentosCargados.
 */
export function sinArchivos(valor) {
  if (typeof Blob !== "undefined" && valor instanceof Blob) return valor.name || "documento.pdf";
  if (Array.isArray(valor)) return valor.map(sinArchivos);
  if (valor && typeof valor === "object") {
    const salida = {};
    Object.keys(valor).forEach((k) => {
      salida[k] = sinArchivos(valor[k]);
    });
    return salida;
  }
  return valor;
}

/** Siguiente id numérico: el mayor existente + 1. */
export function siguienteId(lista, campo) {
  return lista.reduce((max, item) => Math.max(max, Number(item[campo]) || 0), 0) + 1;
}

/** Siguiente id con ceros a la izquierda ("004") para módulos cuyo id es texto. */
export function siguienteIdTexto(lista, campo, largo = 3) {
  return String(siguienteId(lista, campo)).padStart(largo, "0");
}

export const hoyISO = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Hook: devuelve [lista, setLista]. setLista funciona como el de useState y además guarda. */
export function useAlmacen(clave, semilla = []) {
  const [lista, setListaLocal] = useState(() => leerLista(clave, semilla));

  useEffect(() => {
    const refrescar = (e) => {
      if (!e.detail || e.detail.clave === clave) setListaLocal(leerLista(clave, semilla));
    };
    const desdeOtraPestana = (e) => {
      if (e.key === PREFIJO + clave) setListaLocal(leerLista(clave, semilla));
    };
    window.addEventListener(EVENTO, refrescar);
    window.addEventListener("storage", desdeOtraPestana);
    return () => {
      window.removeEventListener(EVENTO, refrescar);
      window.removeEventListener("storage", desdeOtraPestana);
    };
    // La semilla es constante por módulo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  const setLista = useCallback(
    (nuevo) => {
      const actual = leerLista(clave, semilla);
      const resultado = typeof nuevo === "function" ? nuevo(actual) : nuevo;
      guardarLista(clave, resultado);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clave]
  );

  return [lista, setLista];
}

/** Agrega un registro nuevo (sin hook, para usarlo en los manejadores de guardado). */
export function agregarRegistro(clave, semilla, registro) {
  const lista = leerLista(clave, semilla);
  guardarLista(clave, [...lista, registro]);
  return registro;
}

/** Mezcla cambios sobre el registro cuyo campo `campoId` coincide con `id`. */
export function actualizarRegistro(clave, semilla, campoId, id, cambios) {
  const lista = leerLista(clave, semilla);
  guardarLista(
    clave,
    lista.map((item) => (String(item[campoId]) === String(id) ? { ...item, ...cambios } : item))
  );
}

/** Quita el registro cuyo campo `campoId` coincide con `id`. */
export function eliminarRegistro(clave, semilla, campoId, id) {
  const lista = leerLista(clave, semilla);
  guardarLista(
    clave,
    lista.filter((item) => String(item[campoId]) !== String(id))
  );
}
