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

// Todos los tipos de documento están disponibles para cualquier cliente
// (una persona natural también puede tener NIT, y una jurídica extranjera usa Tax ID o similar).
// El tipo de persona solo define cuál se propone por defecto.
export const tiposDocumentoPorPersona = () => TIPOS_DOCUMENTO;

export const tipoDocumentoPorDefecto = (tipoPersona) => (tipoPersona === "NATURAL" ? "CC" : "NIT");
