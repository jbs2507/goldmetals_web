// Tipos de documento de identificación de un cliente.
// soloDigitos: el número solo admite dígitos (y guion para el dígito de verificación).
export const TIPOS_DOCUMENTO = [
  { valor: "NIT", etiqueta: "NIT", soloDigitos: true },
  { valor: "CC", etiqueta: "Cédula de ciudadanía (CC)", soloDigitos: true },
  { valor: "CE", etiqueta: "Cédula de extranjería (CE)", soloDigitos: true },
  { valor: "TI", etiqueta: "Tarjeta de identidad (TI)", soloDigitos: true },
  { valor: "PASAPORTE", etiqueta: "Pasaporte", soloDigitos: false },
  { valor: "PEP", etiqueta: "Permiso especial de permanencia (PEP)", soloDigitos: false },
  { valor: "PPT", etiqueta: "Permiso por protección temporal (PPT)", soloDigitos: false },
  { valor: "EXTRANJERO", etiqueta: "Documento extranjero / Tax ID", soloDigitos: false },
];

export const etiquetaTipoDocumento = (valor) =>
  TIPOS_DOCUMENTO.find((t) => t.valor === valor)?.etiqueta || valor || "—";

export const tipoDocumentoSoloDigitos = (valor) =>
  TIPOS_DOCUMENTO.find((t) => t.valor === valor)?.soloDigitos ?? true;

// Proveedores: los tipos de documento dependen del tipo de persona.
// - Jurídica: NIT (o el documento tributario de una empresa extranjera).
// - Natural: documentos de identidad de una persona.
const DOCUMENTOS_PROVEEDOR = {
  JURIDICA: ["NIT", "EXTRANJERO"],
  NATURAL: ["CC", "CE", "PASAPORTE", "PEP", "PPT"],
};

export const tiposDocumentoProveedor = (tipoPersona) =>
  (DOCUMENTOS_PROVEEDOR[tipoPersona] || [])
    .map((valor) => TIPOS_DOCUMENTO.find((t) => t.valor === valor))
    .filter(Boolean);

export const documentoProveedorPorDefecto = (tipoPersona) =>
  DOCUMENTOS_PROVEEDOR[tipoPersona]?.[0] || "";

// Clientes: mismos tipos de documento según el tipo de persona.
export const tiposDocumentoPorPersona = (tipoPersona) => tiposDocumentoProveedor(tipoPersona);
export const tipoDocumentoPorDefecto = (tipoPersona) => documentoProveedorPorDefecto(tipoPersona);
