// Datos de ejemplo con los que arranca cada módulo la primera vez.
// A partir de ahí todo lo que se registra, edita o elimina se guarda en el navegador
// (ver utils/almacen.js). Se reemplazarán por la base de datos.

export const CLAVES = {
  clientes: "clientes",
  empleados: "empleados",
  proveedores: "proveedores",
  compras: "compras",
  insumosOro: "insumos-oro",
  insumosPoli: "insumos-polimetalicos",
  pedidos: "pedidos",
  producciones: "producciones",
  ventas: "ventas",
  minas: "minas",
  acopios: "acopios",
};

export const CLIENTES_SEMILLA = [
  {
    id_cliente: 1,
    tipo_cliente: "JURIDICA",
    tipo_documento: "NIT",
    nombre: "M&M Trading S.A.S.",
    identificacion_tributaria: "900123456-1",
    representante_nombre: "Andrés Felipe Ramírez",
    representante_correo: "andres.ramirez@mmtrading.com",
    pais: "Colombia",
    telefono: "3001112233",
    correo: "contacto@mmtrading.com",
    camaraComercio: "camara_comercio.pdf",
    contrato: "contrato.pdf",
    estado: "ACTIVO",
  },
  {
    id_cliente: 2,
    tipo_cliente: "JURIDICA",
    tipo_documento: "NIT",
    nombre: "Global Metals International",
    identificacion_tributaria: "901234567-8",
    representante_nombre: "Sarah Johnson",
    representante_correo: "sarah.johnson@globalmetals.com",
    pais: "Estados Unidos",
    telefono: "3104445566",
    correo: "ventas@globalmetals.com",
    camaraComercio: "camara_comercio.pdf",
    contrato: "contrato.pdf",
    estado: "ACTIVO",
  },
];

export const EMPLEADOS_SEMILLA = [
  {
    id_empleado: 1,
    nombre_completo: "Carlos Andrés Gómez",
    tipo_documento: "CC",
    numero_documento: "1032456789",
    telefono: "3001234567",
    cargo: "Operario de fundición",
    direccion: "Calle 45 # 23-18, Medellín",
    correo: "carlos.gomez@mmmetalsgold.com",
    fecha_ingreso: "2024-02-01",
    fecha_finalizacion: null,
    estado: "ACTIVO",
  },
  {
    id_empleado: 2,
    nombre_completo: "Laura Marcela Pérez",
    tipo_documento: "CC",
    numero_documento: "1012456788",
    telefono: "3019876543",
    cargo: "Auxiliar administrativa",
    direccion: "Carrera 70 # 32-10, Medellín",
    correo: "laura.perez@mmmetalsgold.com",
    fecha_ingreso: "2025-06-16",
    fecha_finalizacion: null,
    estado: "ACTIVO",
  },
  {
    id_empleado: 3,
    nombre_completo: "Juan David Rodríguez",
    tipo_documento: "CE",
    numero_documento: "98567432",
    telefono: "3154567890",
    cargo: "Jefe de producción",
    direccion: "Calle 10 # 40-25, Envigado",
    correo: "juan.rodriguez@mmmetalsgold.com",
    fecha_ingreso: "2023-08-10",
    fecha_finalizacion: "2026-08-31",
    estado: "INACTIVO",
  },
];

export const PROVEEDORES_SEMILLA = [
  {
    id: "001",
    razon_social: "Proveedor Minero Chocó",
    tipo_persona: "JURIDICA",
    tipo_documento: "NIT",
    numero_documento: "900123456",
    estado: "ACTIVO",
    camaraComercio: "camara_comercio.pdf",
    rut: "rut.pdf",
    certificadoRucom: "rucom.pdf",
  },
  {
    id: "002",
    razon_social: "Proveedor Minero Bolívar",
    tipo_persona: "JURIDICA",
    tipo_documento: "NIT",
    numero_documento: "900234567",
    estado: "ACTIVO",
    camaraComercio: "camara_comercio.pdf",
    rut: "rut.pdf",
    certificadoRucom: "rucom.pdf",
  },
  {
    id: "003",
    razon_social: "Proveedor Natural",
    tipo_persona: "NATURAL",
    tipo_documento: "CC",
    numero_documento: "1234567890",
    estado: "INACTIVO",
    camaraComercio: "camara_comercio.pdf",
    rut: "rut.pdf",
    certificadoRucom: "rucom.pdf",
  },
];

// Acopios disponibles en el formulario de compras.
export const ACOPIOS_COMPRA = [
  { id: "1", nombre: "Acopio principal" },
  { id: "2", nombre: "Acopio secundario" },
];

export const nombreAcopioCompra = (id) =>
  ACOPIOS_COMPRA.find((a) => a.id === String(id))?.nombre || "";

// El valor total de una compra = peso × precio unitario + regalías.
export const totalCompra = (c) =>
  (Number(c.peso) || 0) * (Number(c.precioUnitario) || 0) + (Number(c.valorRegalias) || 0);

export const COMPRAS_SEMILLA = [
  {
    id: "001",
    fechaCompra: "2026-09-23",
    idProveedor: "001",
    proveedor: "Proveedor Minero Chocó",
    idAcopio: "1",
    acopio: "Acopio principal",
    moneda: "COP",
    tasaCambio: "1",
    idInsumo: "1",
    insumo: "Oro",
    peso: "500",
    ley: "90",
    precioUnitario: "10000",
    valorRegalias: "500000",
    valorTotal: 5500000,
    estado: "REGISTRADA",
    certificadoOrigen: "certificado_origen.pdf",
    resultadoLaboratorio: "resultado_laboratorio.pdf",
    factura: "factura.pdf",
  },
  {
    id: "002",
    fechaCompra: "2026-09-22",
    idProveedor: "002",
    proveedor: "Proveedor Minero Bolívar",
    idAcopio: "1",
    acopio: "Acopio principal",
    moneda: "COP",
    tasaCambio: "1",
    idInsumo: "1",
    insumo: "Oro",
    peso: "850",
    ley: "85",
    precioUnitario: "10000",
    valorRegalias: "0",
    valorTotal: 8500000,
    estado: "APROBADA",
    certificadoOrigen: "certificado_origen.pdf",
    resultadoLaboratorio: "resultado_laboratorio.pdf",
    factura: "factura.pdf",
  },
  {
    id: "003",
    fechaCompra: "2026-09-20",
    idProveedor: "003",
    proveedor: "Proveedor Natural",
    idAcopio: "2",
    acopio: "Acopio secundario",
    moneda: "USD",
    tasaCambio: "4200",
    idInsumo: "1",
    insumo: "Oro",
    peso: "32",
    ley: "88",
    precioUnitario: "100",
    valorRegalias: "0",
    valorTotal: 3200,
    estado: "ANULADA",
    certificadoOrigen: "certificado_origen.pdf",
    resultadoLaboratorio: "resultado_laboratorio.pdf",
    factura: "factura.pdf",
    historial: [
      { estado: "REGISTRADA", fecha: "2026-09-20", motivo: "" },
      { estado: "ANULADA", fecha: "2026-09-21", motivo: "" },
    ],
  },
];

export const INSUMOS_ORO_SEMILLA = [
  { id_insumo: 1, tipo_insumo: "ORO", nombre: "Oro", cantidad: 500, unidad_medida: "g", fecha_ingreso: "2026-09-23", compra_asociada: "001", venta_asociada: null },
  { id_insumo: 2, tipo_insumo: "ORO", nombre: "Oro en polvo", cantidad: 250, unidad_medida: "g", fecha_ingreso: "2026-09-22", compra_asociada: "002", venta_asociada: null },
  { id_insumo: 3, tipo_insumo: "ORO", nombre: "Oro en lingote", cantidad: 2, unidad_medida: "kg", fecha_ingreso: "2026-09-20", compra_asociada: "001", venta_asociada: 1 },
];

export const INSUMOS_POLI_SEMILLA = [
  { id_insumo: 1, tipo_insumo: "POLIMETALICO", nombre: "Arena polimetálica", cantidad: 500, unidad_medida: "kg", fecha_ingreso: "2026-09-22", compra_asociada: "002", venta_asociada: null, mina: "Mina Chocó", acopio: "Acopio principal" },
  { id_insumo: 2, tipo_insumo: "POLIMETALICO", nombre: "Arena polimetálica fina", cantidad: 250, unidad_medida: "kg", fecha_ingreso: "2026-09-23", compra_asociada: "001", venta_asociada: null, mina: "Mina Bolívar", acopio: "Acopio Bolívar" },
  { id_insumo: 3, tipo_insumo: "POLIMETALICO", nombre: "Material polimetálico de acopio", cantidad: 100, unidad_medida: "kg", fecha_ingreso: "2026-09-20", compra_asociada: "001", venta_asociada: 2, mina: "Mina Chocó", acopio: "Acopio Chocó" },
];
