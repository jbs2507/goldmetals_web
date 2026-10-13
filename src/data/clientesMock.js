// Datos de contacto de los clientes. Se usan para asociar nombre y número de contacto
// de la entrega a cada venta. Se leen del módulo Clientes (almacén), así que incluyen
// también los clientes que se registren.
import { CLAVES, CLIENTES_SEMILLA } from "./semillas.js";
import { leerLista } from "../utils/almacen.js";

export const contactoDeCliente = (nombre) => {
  const cliente = leerLista(CLAVES.clientes, CLIENTES_SEMILLA).find((c) => c.nombre === nombre);
  return cliente ? { nombre: cliente.nombre, telefono: cliente.telefono } : null;
};
