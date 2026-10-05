// Vínculos de un insumo con compras (de dónde ingresó) y ventas (a dónde salió).
// Datos de ejemplo: se reemplazarán por la información real de la base de datos.
import { ventasMock, ventaVisible } from "./ventasMock.js";

export const COMPRAS_VINCULO = [
  { id: "001", proveedor: "Proveedor asociado 1", fecha: "2026-09-23", anulada: false },
  { id: "002", proveedor: "Proveedor asociado 2", fecha: "2026-09-22", anulada: false },
  { id: "003", proveedor: "Proveedor asociado 3", fecha: "2026-09-20", anulada: true },
];

/** "2026-09-23" -> "23/09/2026" */
export function formatearFecha(iso) {
  if (!iso) return "No registrada";
  const [a, m, d] = String(iso).slice(0, 10).split("-");
  return a && m && d ? `${d}/${m}/${a}` : iso;
}

/** Compras que se pueden asociar a un insumo (se excluyen las anuladas). */
export function comprasDisponibles() {
  return COMPRAS_VINCULO.filter((c) => !c.anulada);
}

/** Ventas que se pueden asociar según el tipo de insumo (se excluyen las anuladas). */
export function ventasDisponibles(tipo) {
  const patron = tipo === "ORO" ? /^oro/i : /polimet/i;
  return ventasMock.filter(
    (v) => ventaVisible(v) && v.estado !== "ANULADA" && patron.test(v.tipo_material || "")
  );
}

export function textoCompra(id) {
  if (!id) return "Sin compra asociada";
  const c = COMPRAS_VINCULO.find((x) => x.id === String(id));
  return c ? `Compra #${c.id} · ${c.proveedor}` : `Compra #${id}`;
}

export function textoVenta(id) {
  if (!id) return "Aún no ha salido";
  const v = ventasMock.find((x) => x.id_venta === Number(id));
  return v ? `Venta #${v.id_venta} · ${v.cliente}` : `Venta #${id}`;
}
