// Ventas de ejemplo.
// Regla de negocio: una venta nace de dos formas:
//  1) Venta directa de oro (no requiere procesamiento, no tiene pedido).
//  2) Pedido pagado en su totalidad (todo lo que lleva producción pasa primero por pedido).
export const ventasMock = [
  {
    id_venta: 1,
    direccion_puerto: "Puerto de Cartagena, Terminal de Contenedores Contecar",
    contacto_entrega_nombre: "Carlos Gómez",
    contacto_entrega_telefono: "3001112233",
    origen: "DIRECTA",
    cliente: "M&M Trading S.A.S.",
    pedido: "Venta directa",
    tipo_material: "Oro en lingote",
    cantidad: "500 g",
    precio: "120000000",
    moneda: "COP",
    fecha: "2026-09-20",
    pais_destino: "India",
    encargado_transporte: "Carlos Gómez",
    placa_vehiculo: "ABC123",
    acopio: "Acopio principal",
    mina: "Mina Chocó",
    factura: "factura.pdf",
    resultado_laboratorio: "resultado_laboratorio.pdf",
    historial: [{ estado: "REGISTRADA", fecha: "2026-09-20", motivo: "" }],
    estado: "REGISTRADA",
    documentos: true,
    pago_completo: true,
    produccion_lista: true,
  },
  {
    id_venta: 2,
    direccion_puerto: "Puerto de Buenaventura, Muelle TCBUEN",
    contacto_entrega_nombre: "Juan Rodríguez",
    contacto_entrega_telefono: "3001112233",
    origen: "PEDIDO",
    cliente: "M&M Trading S.A.S.",
    pedido: "PED-003",
    tipo_material: "Arenas polimetálicas",
    cantidad: "10 t",
    ley: 12.5,
    precio: "85000000",
    moneda: "COP",
    fecha: "2026-09-15",
    pais_destino: "Estados Unidos",
    encargado_transporte: "Juan Rodríguez",
    placa_vehiculo: "XYZ789",
    acopio: "Acopio Chocó",
    mina: "Mina Chocó",
    factura: "factura.pdf",
    resultado_laboratorio: "resultado_laboratorio.pdf",
    historial: [
      { estado: "REGISTRADA", fecha: "2026-09-15", motivo: "" },
      { estado: "DESPACHADA", fecha: "2026-09-17", motivo: "" },
    ],
    estado: "DESPACHADA",
    documentos: true,
    pago_completo: true,
    produccion_lista: true,
  },
  {
    id_venta: 3,
    direccion_puerto: "Puerto de Santa Marta, Muelle 5",
    contacto_entrega_nombre: "Laura Pérez",
    contacto_entrega_telefono: "3104445566",
    origen: "DIRECTA",
    cliente: "Global Metals International",
    pedido: "Venta directa",
    tipo_material: "Oro en lingote",
    cantidad: "250 g",
    precio: "62000000",
    moneda: "COP",
    fecha: "2026-09-10",
    pais_destino: "Estados Unidos",
    encargado_transporte: "Laura Pérez",
    placa_vehiculo: "DEF456",
    acopio: "Acopio Bolívar",
    mina: "Mina Bolívar",
    factura: null,
    resultado_laboratorio: null,
    historial: [
      { estado: "REGISTRADA", fecha: "2026-09-10", motivo: "" },
      { estado: "ANULADA", fecha: "2026-09-12", motivo: "Operación cancelada por el cliente" },
    ],
    estado: "ANULADA",
    documentos: false,
    pago_completo: true,
    produccion_lista: true,
  },
];

/**
 * Una venta solo existe/se muestra cuando el pedido está pagado al 100 %.
 * Mientras el pago no esté completo no aparece en ningún lado.
 */
export const ventaVisible = (venta) => venta.pago_completo === true;
export const ventasVisibles = ventasMock.filter(ventaVisible);

/** Fecha (ISO) del último estado por el que pasó la venta. */
export const fechaUltimoEstado = (venta) => {
  const h = venta.historial || [];
  return h.length ? h[h.length - 1].fecha : venta.fecha_estado || venta.fecha;
};

export const etiquetaEstadoVenta = (estado) =>
  ({
    REGISTRADA: "Registrada",
    DESPACHADA: "Despachada",
    ENTREGADA: "Entregada",
    ANULADA: "Anulada",
  }[estado] || estado || "—");

/** Suma el dinero de las ventas vigentes (sin anuladas), separado por moneda. */
export const totalesPorMoneda = (ventas) => {
  const t = {};
  ventas
    .filter((v) => v.estado !== "ANULADA")
    .forEach((v) => {
      const m = v.moneda || "COP";
      t[m] = (t[m] || 0) + (Number(v.precio) || 0);
    });
  return t;
};

export const formatoDinero = (valor, moneda = "COP") =>
  `${moneda} ${Number(valor || 0).toLocaleString(moneda === "USD" ? "en-US" : "es-CO", {
    minimumFractionDigits: moneda === "USD" ? 2 : 0,
    maximumFractionDigits: moneda === "USD" ? 2 : 0,
  })}`;
