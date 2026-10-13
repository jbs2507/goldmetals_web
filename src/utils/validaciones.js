// Reglas de validación de formularios.
// Portadas 1:1 desde la app móvil (lib/screens/module_form_screen.dart)
// para que web y móvil validen exactamente igual.

export const RE_CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Solo letras (con tildes y ñ), espacios y puntuación básica de nombres/razón social.
export const RE_SOLO_LETRAS = /^[A-Za-zÀ-ÿñÑ\s.,&'-]+$/;
const RE_SOLO_LETRAS_CHAR = /[A-Za-zÀ-ÿñÑ\s.,&'-]/;

// Solo dígitos (se permite el guion de documentos con dígito de verificación, ej. NIT).
export const RE_SOLO_DIGITOS = /^[0-9-]+$/;
const RE_SOLO_DIGITOS_CHAR = /[0-9-]/;

/** Quita en tiempo real cualquier carácter que no sea letra/espacio/puntuación de nombre. */
export function filtrarSoloLetras(valor) {
  return valor
    .split("")
    .filter((c) => RE_SOLO_LETRAS_CHAR.test(c))
    .join("");
}

/** Quita en tiempo real cualquier carácter que no sea dígito (o guion). */
export function filtrarSoloDigitos(valor) {
  return valor
    .split("")
    .filter((c) => RE_SOLO_DIGITOS_CHAR.test(c))
    .join("");
}

const dos = (n) => String(n).padStart(2, "0");

/** Fecha de hoy según la hora del computador (AAAA-MM-DD). toISOString() usa UTC y en Colombia
 *  cambia de día a las 7 p. m., por eso no se usa. */
export function hoyISO() {
  const h = new Date();
  return `${h.getFullYear()}-${dos(h.getMonth() + 1)}-${dos(h.getDate())}`;
}

/** Mínimo de un campo datetime-local para hoy (AAAA-MM-DDT00:00). */
export const inicioDeHoyLocal = () => `${hoyISO()}T00:00`;

/** Momento actual para un campo datetime-local (AAAA-MM-DDTHH:MM). */
export function ahoraLocal() {
  const h = new Date();
  return `${hoyISO()}T${dos(h.getHours())}:${dos(h.getMinutes())}`;
}

/** Interpreta "AAAA-MM-DD" o "AAAA-MM-DDTHH:MM" como fecha LOCAL (new Date("AAAA-MM-DD") la toma como UTC). */
export function fechaLocal(texto) {
  const m = String(texto ?? "").match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0));
  return Number.isNaN(d.getTime()) ? null : d;
}

function hoySinHora() {
  const h = new Date();
  h.setHours(0, 0, 0, 0);
  return h;
}

/** Fecha de hoy sumando años (para topes como "no más de un año adelante"). */
export function hoyMasAnios(anios) {
  const h = new Date();
  return `${h.getFullYear() + anios}-${dos(h.getMonth() + 1)}-${dos(h.getDate())}`;
}

/** Solo los dígitos de un teléfono (sin guiones ni espacios). */
const soloDigitosDe = (txt) => String(txt ?? "").replace(/\D/g, "");

/**
 * Valida un campo según sus reglas y devuelve el mensaje de error
 * (igual que en móvil) o "" si es válido.
 *
 * opciones:
 *  - requerido: campo obligatorio
 *  - tipo: 'text' | 'number' | 'email' | 'date'
 *  - soloLetras / soloDigitos: restricciones de contenido
 *  - telefono: entre 7 y 15 dígitos
 *  - longitudMin: mínimo de caracteres
 *  - tipo 'date': por defecto no admite fechas anteriores a hoy ni a más de un año adelante;
 *      permitirPasada: acepta fechas pasadas; noFutura: no acepta fechas posteriores a hoy;
 *      valorOriginal: si la fecha sigue igual que al abrir el registro (edición) no se revalida.
 */
export function validarCampo(valor, opciones = {}) {
  const {
    requerido = false,
    tipo = "text",
    soloLetras = false,
    soloDigitos = false,
    telefono = false,
    longitudMin = 0,
    permitirPasada = false,
    noFutura = false,
    valorOriginal,
  } = opciones;
  const txt = `${valor ?? ""}`.trim();

  if (requerido && !txt) return "Campo obligatorio";

  if (tipo === "number" && txt) {
    const n = Number(txt);
    if (Number.isNaN(n)) return "Número no válido";
    if (requerido && n <= 0) return "Debe ser mayor a 0";
  }

  if (tipo === "email" && txt && !RE_CORREO.test(txt)) return "Correo no válido";

  if (soloLetras && txt && !RE_SOLO_LETRAS.test(txt)) return "Solo se permiten letras";

  if (soloDigitos && txt && !RE_SOLO_DIGITOS.test(txt)) return "Solo se permiten números";

  if (longitudMin && txt && txt.length < longitudMin) return `Mínimo ${longitudMin} caracteres`;

  if (telefono && txt) {
    const n = soloDigitosDe(txt).length;
    if (n < 7 || n > 15) return "El teléfono debe tener entre 7 y 15 dígitos";
  }

  if (tipo === "date" && txt && txt !== `${valorOriginal ?? ""}`) {
    const d = fechaLocal(txt);
    if (!d) return "Fecha no válida";
    if (d.getFullYear() < 1900) return "Fecha no válida";
    if (!permitirPasada && d < hoySinHora()) return "La fecha no puede ser anterior a hoy";
    if (noFutura && d > new Date()) return "La fecha no puede ser posterior a hoy";
    if (!permitirPasada && !noFutura) {
      const tope = fechaLocal(hoyMasAnios(1));
      if (d > tope) return "La fecha no puede ser mayor a un año desde hoy";
    }
  }

  return "";
}

/**
 * Valida un objeto de formulario completo contra un mapa de reglas:
 *   { campo: { requerido, tipo, soloLetras, soloDigitos } }
 * Devuelve el objeto de errores (vacío si todo es válido).
 */
export function validarFormulario(valores, reglas) {
  const errores = {};
  for (const campo of Object.keys(reglas)) {
    const msg = validarCampo(valores[campo], reglas[campo]);
    if (msg) errores[campo] = msg;
  }
  return errores;
}

// ---------------------------------------------------------------------------
// Documentos de identificación
// ---------------------------------------------------------------------------

// Formato de cada tipo de documento (solo los que tienen un formato fijo).
const FORMATO_DOCUMENTO = {
  NIT: { re: /^\d{9,10}(-\d)?$/, msg: "El NIT debe tener 9 o 10 dígitos (con o sin guion y dígito de verificación)" },
  CC: { re: /^\d{6,10}$/, msg: "La cédula debe tener entre 6 y 10 dígitos" },
  CE: { re: /^\d{6,10}$/, msg: "La cédula de extranjería debe tener entre 6 y 10 dígitos" },
  TI: { re: /^\d{10,11}$/, msg: "La tarjeta de identidad debe tener 10 u 11 dígitos" },
  PASAPORTE: { re: /^[A-Za-z0-9-]{5,20}$/, msg: "El pasaporte debe tener entre 5 y 20 caracteres" },
  PEP: { re: /^[A-Za-z0-9-]{5,20}$/, msg: "El número debe tener entre 5 y 20 caracteres" },
  PPT: { re: /^[A-Za-z0-9-]{5,20}$/, msg: "El número debe tener entre 5 y 20 caracteres" },
  EXTRANJERO: { re: /^[A-Za-z0-9-]{4,25}$/, msg: "El documento debe tener entre 4 y 25 caracteres" },
};

/** Valida el formato del número según el tipo de documento. Devuelve el mensaje o "". */
export function validarNumeroDocumento(tipoDocumento, numero) {
  const txt = `${numero ?? ""}`.trim();
  if (!txt) return "";
  const formato = FORMATO_DOCUMENTO[tipoDocumento];
  if (formato && !formato.re.test(txt)) return formato.msg;
  if (/^0+$/.test(txt.replace(/-/g, ""))) return "Número de documento no válido";
  return "";
}

/** Placa colombiana: 3 letras + 3 números (carros) o 3 letras + 2 números + 1 letra (motos). */
export const RE_PLACA = /^[A-Z]{3}\d{2}[A-Z0-9]$/;
export const validarPlaca = (placa) =>
  `${placa ?? ""}`.trim() && !RE_PLACA.test(`${placa}`.trim().toUpperCase())
    ? "Placa no válida (ej. ABC123)"
    : "";
