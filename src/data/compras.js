// Utilidades del módulo de compras: arma el registro completo a partir de lo que entrega el formulario.
import { CLAVES, PROVEEDORES_SEMILLA, nombreAcopioCompra, totalCompra } from "./semillas.js";
import { leerLista, sinArchivos } from "../utils/almacen.js";

/** Registro listo para guardar: datos del formulario + nombres legibles de proveedor y acopio. */
export function construirCompra(datos) {
  const proveedores = leerLista(CLAVES.proveedores, PROVEEDORES_SEMILLA);
  const proveedor = proveedores.find((p) => p.id === String(datos.idProveedor));
  const base = sinArchivos(datos);
  return {
    ...base,
    proveedor: proveedor?.razon_social || "",
    acopio: nombreAcopioCompra(datos.idAcopio),
    insumo: "Oro",
    valorTotal: Number(datos.valorTotal) || totalCompra(datos),
  };
}

/** $ 5.500.000 (COP) o $ 3.200,00 (USD), igual que el resto de listados. */
export const formatoValorCompra = (valor, moneda) =>
  `$${Number(valor || 0).toLocaleString(moneda === "USD" ? "en-US" : "es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: moneda === "USD" ? 2 : 0,
  })}`;
