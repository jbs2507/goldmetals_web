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

function hoySinHora() {
  const h = new Date();
  h.setHours(0, 0, 0, 0);
  return h;
}

/**
 * Valida un campo según sus reglas y devuelve el mensaje de error
 * (igual que en móvil) o "" si es válido.
 *
 * opciones:
 *  - requerido: campo obligatorio
 *  - tipo: 'text' | 'number' | 'email' | 'date'
 *  - soloLetras / soloDigitos: restricciones de contenido
 */
export function validarCampo(valor, opciones = {}) {
  const { requerido = false, tipo = "text", soloLetras = false, soloDigitos = false } = opciones;
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

  if (tipo === "date" && txt) {
    const d = new Date(txt);
    if (!Number.isNaN(d.getTime()) && d < hoySinHora()) {
      return "La fecha no puede ser anterior a hoy";
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
