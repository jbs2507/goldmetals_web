// Lista de países para los formularios (en español, ordenada de la A a la Z).
// Se pide a la API pública REST Countries; si no responde (sin internet o caída),
// se arma la misma lista con los nombres de países que trae el propio navegador.

const URL_API = "https://restcountries.com/v3.1/all?fields=name,translations";
const TIEMPO_MAXIMO_MS = 8000;

// Códigos que no son países (regiones del mundo, códigos en desuso o reservados).
const NO_SON_PAISES = new Set([
  "EU", "UN", "EZ", "QO", "XA", "XB", "ZZ", "AC", "CP", "DG", "EA", "IC", "TA",
  "AN", "BU", "CS", "DD", "FX", "NT", "SU", "TP", "YD", "YU", "ZR",
]);

const ordenar = (lista) =>
  [...new Set(lista.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));

function paisesDelNavegador() {
  try {
    const nombres = new Intl.DisplayNames(["es"], { type: "region", fallback: "none" });
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lista = [];
    for (const a of letras) {
      for (const b of letras) {
        const codigo = a + b;
        if (NO_SON_PAISES.has(codigo)) continue;
        const nombre = nombres.of(codigo);
        if (nombre && nombre !== codigo) lista.push(nombre);
      }
    }
    return ordenar(lista);
  } catch {
    return [];
  }
}

let guardada = null;

export function cargarPaises() {
  if (guardada) return guardada;

  guardada = (async () => {
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), TIEMPO_MAXIMO_MS);
    try {
      const respuesta = await fetch(URL_API, { signal: control.signal });
      if (!respuesta.ok) throw new Error("Respuesta no válida");
      const datos = await respuesta.json();
      const lista = ordenar(datos.map((p) => p.translations?.spa?.common || p.name?.common));
      if (lista.length < 100) throw new Error("Lista incompleta");
      return lista;
    } catch {
      return paisesDelNavegador();
    } finally {
      clearTimeout(temporizador);
    }
  })();

  return guardada;
}
