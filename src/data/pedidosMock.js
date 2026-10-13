import { CLAVES } from "./semillas.js";
import { leerLista } from "../utils/almacen.js";

// Pedidos de ejemplo compartidos entre Pedidos y Ventas (semilla del módulo).
// Un pedido pasa a ser venta cuando se entrega y se paga el 10 % restante.
const pedidosBase = [
  {
    id_pedido: 1,
    cliente: "M&M Trading S.A.S.",
    mina: "Mina Chocó",
    acopio: "Acopio Chocó",
    fecha_pedido: "2026-09-20",
    estado: "ABIERTO",
    fecha_estado: "2026-09-20",
    historial: [{ estado: "ABIERTO", fecha: "2026-09-20", motivo: "" }],
    moneda: "COP",
    tasa_cambio: null,
    valor_total: 125000000,
    valor_pagado: 112500000,
    detalles: [{ insumo: "Oro", producto: "Oro en lingote", cantidad: 500, precio_unitario: 250000 }],
  },
  {
    id_pedido: 2,
    cliente: "Global Metals International",
    mina: "Mina Bolívar",
    acopio: "Acopio Bolívar",
    fecha_pedido: "2026-09-18",
    estado: "EN_PRODUCCION",
    fecha_estado: "2026-09-21",
    historial: [{ estado: "ABIERTO", fecha: "2026-09-18", motivo: "" }, { estado: "EN_PRODUCCION", fecha: "2026-09-21", motivo: "" }],
    moneda: "USD",
    tasa_cambio: 4200,
    valor_total: 28500,
    valor_pagado: 25650,
    detalles: [{ insumo: "Material polimetálico", producto: "Arenas polimetálicas", cantidad: 19, precio_unitario: 1500 }],
  },
  {
    id_pedido: 3,
    cliente: "M&M Trading S.A.S.",
    mina: "Mina Chocó",
    acopio: "Acopio Chocó",
    fecha_pedido: "2026-09-15",
    estado: "LISTO",
    fecha_estado: "2026-09-28",
    historial: [{ estado: "ABIERTO", fecha: "2026-09-15", motivo: "" }, { estado: "EN_PRODUCCION", fecha: "2026-09-20", motivo: "" }, { estado: "LISTO", fecha: "2026-09-28", motivo: "" }],
    moneda: "COP",
    tasa_cambio: null,
    valor_total: 85000000,
    valor_pagado: 85000000,
    detalles: [{ insumo: "Material polimetálico", producto: "Arenas polimetálicas", cantidad: 10, precio_unitario: 8500000 }],
  },
  {
    id_pedido: 4,
    cliente: "Global Metals International",
    mina: "Mina Bolívar",
    acopio: "Acopio Bolívar",
    fecha_pedido: "2026-09-25",
    estado: "LISTO",
    fecha_estado: "2026-09-29",
    historial: [{ estado: "ABIERTO", fecha: "2026-09-25", motivo: "" }, { estado: "EN_PRODUCCION", fecha: "2026-09-26", motivo: "" }, { estado: "LISTO", fecha: "2026-09-29", motivo: "" }],
    moneda: "COP",
    tasa_cambio: null,
    valor_total: 96000000,
    valor_pagado: 96000000,
    detalles: [{ insumo: "Oro", producto: "Oro en lingote", cantidad: 200, precio_unitario: 480000 }],
  },
];

// Se completan los datos que usa la pantalla de consulta (fecha de entrega, pagos, valores).
const sumarUnMes = (iso) => {
  const [a, m, d] = iso.split("-").map(Number);
  const f = new Date(a, m, d);
  const pad = (n) => String(n).padStart(2, "0");
  return `${f.getFullYear()}-${pad(f.getMonth() + 1)}-${pad(f.getDate())}`;
};

export const pedidosMock = pedidosBase.map((p) => ({
  ...p,
  fecha_entrega: sumarUnMes(p.fecha_pedido),
  detalles: p.detalles.map((d) => ({
    detalle_producto: "",
    valor_total: d.cantidad * d.precio_unitario,
    ...d,
  })),
  pagos: [{ fecha_pago: p.fecha_pedido, cuenta_bancaria: "BANCOLOMBIA", comprobante: null }],
}));

export const codigoPedido = (id) => `PED-${String(id).padStart(3, "0")}`;

/** Un pedido está pagado al 100 % cuando lo pagado cubre el valor total. */
export const pagoCompletoPedido = (p) =>
  Number(p.valor_total) > 0 && Number(p.valor_pagado) >= Number(p.valor_total);

// Pedidos que ya pueden pasar a venta: listos o entregados (no anulados) y pagados al 100 %.
// Se lee del almacén para incluir los pedidos registrados o cambiados de estado.
export const pedidosParaVenta = () =>
  leerLista(CLAVES.pedidos, pedidosMock).filter(
    (p) => (p.estado === "LISTO" || p.estado === "ENTREGADO") && pagoCompletoPedido(p)
  );

// Flujo del pedido: solo se puede avanzar (la anulación tiene su propio botón).
export const FLUJO_ESTADOS_PEDIDO = ["ABIERTO", "EN_PRODUCCION", "LISTO", "ENTREGADO"];

export const estadosSiguientesPedido = (estado) => {
  const i = FLUJO_ESTADOS_PEDIDO.indexOf(estado);
  return i === -1 ? [] : FLUJO_ESTADOS_PEDIDO.slice(i + 1);
};

export const etiquetaEstadoPedido = (estado) =>
  ({
    ABIERTO: "Abierto",
    EN_PRODUCCION: "En producción",
    LISTO: "Listo",
    ENTREGADO: "Entregado",
    ANULADO: "Anulado",
  }[estado] || estado || "—");

export const materialDeInsumo = (insumo) =>
  insumo === "Oro" ? "Oro en lingote" : "Arenas polimetálicas";

// Acopios e insumos disponibles al registrar un pedido (los clientes salen del módulo Clientes).
export const ACOPIOS_PEDIDO = [
  { id_acopio: 1, nombre: "Acopio Chocó" },
  { id_acopio: 2, nombre: "Acopio Bolívar" },
];

export const INSUMOS_PEDIDO = [
  { id_insumo: 1, nombre: "Oro" },
  { id_insumo: 2, nombre: "Material polimetálico" },
];

/** "2026-09-23" -> "23/09/2026" (formato de la columna Fecha de producción). */
const fechaLatina = (iso) => {
  const [a, m, d] = String(iso).slice(0, 10).split("-");
  return a && m && d ? `${d}/${m}/${a}` : iso;
};

/**
 * Convierte lo que entrega el formulario de pedido en el registro que usan las pantallas
 * (nombres de cliente, acopio e insumo, historial, pagos).
 */
export function construirPedido(datos, clientes) {
  const hoy = new Date().toISOString().slice(0, 10);
  const cliente = clientes.find((c) => Number(c.id_cliente) === Number(datos.id_cliente));
  const acopio = ACOPIOS_PEDIDO.find((a) => a.id_acopio === Number(datos.id_acopio));
  const estado = datos.estado || "ABIERTO";
  return {
    id_cliente: Number(datos.id_cliente),
    cliente: cliente?.nombre || "",
    id_acopio: datos.id_acopio != null ? Number(datos.id_acopio) : null,
    mina: datos.mina || "",
    acopio: datos.acopio || acopio?.nombre || "",
    fecha_pedido: datos.fecha_pedido,
    fecha_entrega: datos.fecha_entrega,
    estado,
    fecha_estado: hoy,
    historial: [{ estado, fecha: hoy, motivo: "" }],
    moneda: datos.moneda,
    tasa_cambio: datos.tasa_cambio,
    valor_total: datos.valor_total,
    valor_pagado: datos.valor_pagado,
    detalles: (datos.detalles_pedido || []).map((d) => ({
      producto: d.producto,
      detalle_producto: d.detalle_producto,
      id_insumo: d.id_insumo,
      insumo: INSUMOS_PEDIDO.find((i) => i.id_insumo === Number(d.id_insumo))?.nombre || "",
      cantidad: d.cantidad,
      precio_unitario: d.precio_unitario,
      valor_total: d.valor_total,
    })),
    pagos: (datos.pagos_pedido || []).map((p) => ({
      fecha_pago: p.fecha_pago,
      cuenta_bancaria: p.cuenta_bancaria,
      comprobante: p.comprobante ? p.comprobante.name || "comprobante.pdf" : null,
    })),
  };
}

/** Producciones que el sistema crea solas al generarse un pedido (una por cada insumo del detalle). */
export function produccionesDePedido(pedido, producciones) {
  const hoy = new Date().toISOString().slice(0, 10);
  let idOrden = producciones.reduce((m, p) => Math.max(m, Number(p.id_orden_produccion) || 0), 0);
  let consecutivo = producciones.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0);
  return pedido.detalles.map((d) => {
    idOrden += 1;
    consecutivo += 1;
    const esOroDetalle = d.insumo === "Oro";
    const tasa = pedido.moneda === "USD" ? Number(pedido.tasa_cambio) || 1 : 1;
    return {
      id: String(consecutivo).padStart(3, "0"),
      id_orden_produccion: idOrden,
      id_acopio: pedido.id_acopio,
      insumo: d.insumo,
      cantidad: `${d.cantidad} ${esOroDetalle ? "g" : "t"}`,
      fecha: fechaLatina(hoy),
      cliente: pedido.cliente,
      pedido: codigoPedido(pedido.id_pedido),
      mina: pedido.mina || "Por asignar",
      monto: Math.round(Number(d.valor_total || 0) * tasa),
      estado: "PENDIENTE",
      historial: [
        {
          estado: "PENDIENTE",
          fecha: hoy,
          motivo: "Producción creada automáticamente al generarse el pedido",
        },
      ],
    };
  });
}
