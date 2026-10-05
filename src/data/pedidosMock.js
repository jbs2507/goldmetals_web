// Pedidos de ejemplo compartidos entre Pedidos y Ventas.
// Un pedido pasa a ser venta cuando se entrega y se paga el 10 % restante.
export const pedidosMock = [
  {
    id_pedido: 1,
    cliente: "M&M Trading S.A.S.",
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

export const codigoPedido = (id) => `PED-${String(id).padStart(3, "0")}`;

/** Un pedido está pagado al 100 % cuando lo pagado cubre el valor total. */
export const pagoCompletoPedido = (p) =>
  Number(p.valor_total) > 0 && Number(p.valor_pagado) >= Number(p.valor_total);

// Pedidos que ya pueden pasar a venta: listos o entregados (no anulados) y pagados al 100 %.
export const pedidosParaVenta = pedidosMock.filter(
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
