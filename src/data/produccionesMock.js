// Producciones de ejemplo.
// Regla de negocio: la producción NO se registra a mano; el sistema la crea
// automáticamente en cuanto se genera el pedido (estado inicial PENDIENTE).
// `historial` guarda cada estado por el que ha pasado y la fecha del cambio.
// `monto` está en COP.
export const produccionesMock = [
  {
    id: "001",
    id_orden_produccion: 1,
    id_acopio: 1,
    insumo: "Material polimetálico",
    cantidad: "500 kg",
    fecha: "23/09/2026",
    cliente: "Cliente 1",
    pedido: "Pedido 001",
    mina: "Mina principal",
    monto: 42500000,
    estado: "FINALIZADA",
    historial: [
      { estado: "PENDIENTE", fecha: "2026-09-23", motivo: "Producción creada automáticamente al generarse el pedido" },
      { estado: "EN_PROCESO", fecha: "2026-09-24", motivo: "" },
      { estado: "FINALIZADA", fecha: "2026-09-27", motivo: "" },
    ],
  },
  {
    id: "002",
    id_orden_produccion: 2,
    id_acopio: 2,
    insumo: "Oro",
    cantidad: "250 g",
    fecha: "22/09/2026",
    cliente: "Cliente 1",
    pedido: "Pedido 001",
    mina: "Mina principal",
    monto: 62500000,
    estado: "EN_PROCESO",
    historial: [
      { estado: "PENDIENTE", fecha: "2026-09-22", motivo: "Producción creada automáticamente al generarse el pedido" },
      { estado: "EN_PROCESO", fecha: "2026-09-23", motivo: "" },
    ],
  },
  {
    id: "003",
    id_orden_produccion: 3,
    id_acopio: 3,
    insumo: "Material polimetálico",
    cantidad: "300 kg",
    fecha: "20/09/2026",
    cliente: "Cliente 1",
    pedido: "Pedido 001",
    mina: "Mina principal",
    monto: 25500000,
    estado: "PENDIENTE",
    historial: [
      { estado: "PENDIENTE", fecha: "2026-09-20", motivo: "Producción creada automáticamente al generarse el pedido" },
    ],
  },
];

export const esOro = (p) => String(p.insumo).toLowerCase() === "oro";

export const formatoMonto = (n) =>
  Number(n || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

export const etiquetaEstadoProduccion = (estado) =>
  ({
    PENDIENTE: "Pendiente",
    EN_PROCESO: "En proceso",
    FINALIZADA: "Finalizada",
    ANULADA: "Anulada",
  }[estado] || estado || "—");

/** "23/09/2026" -> "2026-09-23" (para inputs de tipo date). */
export const fechaAISO = (f) => {
  const m = String(f || "").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : f || "";
};
