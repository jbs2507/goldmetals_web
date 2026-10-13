// Minas y acopios (datos de ejemplo; vendrán de la base de datos).
// Cada acopio pertenece a una mina. Se guardan en el almacén, así que las minas y acopios
// que se agreguen desde el formulario de insumos quedan disponibles en todo el sistema.
import { CLAVES } from "./semillas.js";
import { guardarLista, leerLista } from "../utils/almacen.js";

export const MINAS_SEMILLA = [{ nombre: "Mina Chocó" }, { nombre: "Mina Bolívar" }];

export const ACOPIOS_SEMILLA = [
  { nombre: "Acopio principal", mina: "Mina Chocó" },
  { nombre: "Acopio Chocó", mina: "Mina Chocó" },
  { nombre: "Acopio Bolívar", mina: "Mina Bolívar" },
];

const igual = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();

export const leerMinas = () => leerLista(CLAVES.minas, MINAS_SEMILLA).map((m) => m.nombre);

/** Acopios de una mina (o todos si no se indica mina). */
export const leerAcopios = (mina) =>
  leerLista(CLAVES.acopios, ACOPIOS_SEMILLA)
    .filter((a) => !mina || a.mina === mina)
    .map((a) => a.nombre);

/** Agrega una mina nueva. Devuelve { ok, nombre } o { ok:false, error }. */
export function agregarMina(nombre) {
  const limpio = String(nombre || "").trim();
  if (!limpio) return { ok: false, error: "Escribe el nombre de la mina." };
  const minas = leerLista(CLAVES.minas, MINAS_SEMILLA);
  if (minas.some((m) => igual(m.nombre, limpio))) return { ok: false, error: "Esa mina ya existe." };
  guardarLista(CLAVES.minas, [...minas, { nombre: limpio }]);
  return { ok: true, nombre: limpio };
}

/** Agrega un acopio nuevo a una mina. Devuelve { ok, nombre } o { ok:false, error }. */
export function agregarAcopio(nombre, mina) {
  const limpio = String(nombre || "").trim();
  if (!mina) return { ok: false, error: "Primero selecciona la mina." };
  if (!limpio) return { ok: false, error: "Escribe el nombre del acopio." };
  const acopios = leerLista(CLAVES.acopios, ACOPIOS_SEMILLA);
  if (acopios.some((a) => a.mina === mina && igual(a.nombre, limpio))) {
    return { ok: false, error: "Esa mina ya tiene un acopio con ese nombre." };
  }
  guardarLista(CLAVES.acopios, [...acopios, { nombre: limpio, mina }]);
  return { ok: true, nombre: limpio };
}

/** Mina a la que pertenece un acopio (o "" si no se encuentra). */
export const minaDeAcopio = (acopio) =>
  leerLista(CLAVES.acopios, ACOPIOS_SEMILLA).find((a) => igual(a.nombre, acopio || ""))?.mina || "";
