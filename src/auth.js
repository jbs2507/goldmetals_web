// Autenticación TEMPORAL en el navegador (localStorage).
// Cuando esté el backend, reemplazar estas funciones por llamadas a la API
// (POST /auth/login, POST /auth/registro, etc.) y usar el token que devuelva.

const K_USUARIOS = 'gm-usuarios'
const K_ROLES = 'gm-roles'
const K_SESION = 'gm-sesion'
const K_USUARIO = 'gm-usuario'

// Usuario de prueba para poder entrar la primera vez (borrar al conectar el backend).
export const ROL_ADMIN = 'Administrador'
// Quien se registra por su cuenta entra con un rol de solo consulta (mínimo privilegio).
export const ROL_POR_DEFECTO = 'Contador'

const SEMILLA = [
  {
    nombre_completo: 'Administrador',
    correo: 'admin@mmmetalsgold.com',
    telefono: '3001234567',
    contrasena: 'Admin12345',
    estado: 'ACTIVO',
    rol: ROL_ADMIN,
  },
  {
    nombre_completo: 'Contador',
    correo: 'contador@mmmetalsgold.com',
    telefono: '3012345678',
    contrasena: 'Contador12345',
    estado: 'ACTIVO',
    rol: 'Contador',
  },
  {
    nombre_completo: 'Abogado',
    correo: 'abogado@mmmetalsgold.com',
    telefono: '3023456789',
    contrasena: 'Abogado12345',
    estado: 'ACTIVO',
    rol: 'Abogado',
  },
]

function leerUsuarios() {
  try {
    const raw = localStorage.getItem(K_USUARIOS)
    if (!raw) {
      localStorage.setItem(K_USUARIOS, JSON.stringify(SEMILLA))
      return [...SEMILLA]
    }
    const guardados = JSON.parse(raw)
    // Migración: usuarios guardados antes de existir los roles.
    let cambio = false
    guardados.forEach((u) => {
      if (!u.rol) {
        u.rol = u.correo?.toLowerCase() === SEMILLA[0].correo ? ROL_ADMIN : ROL_POR_DEFECTO
        cambio = true
      }
    })
    SEMILLA.slice(1).forEach((semilla) => {
      if (!guardados.some((u) => u.correo?.toLowerCase() === semilla.correo)) {
        guardados.push({ ...semilla })
        cambio = true
      }
    })
    if (cambio) localStorage.setItem(K_USUARIOS, JSON.stringify(guardados))
    return guardados
  } catch {
    return [...SEMILLA]
  }
}

const igual = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

/** Registra un usuario nuevo. Devuelve { ok } o { ok:false, error }. */
export function registrarUsuario(datos) {
  const usuarios = leerUsuarios()
  if (usuarios.some((u) => igual(u.correo, datos.correo))) {
    return { ok: false, error: 'Este correo ya está registrado' }
  }
  usuarios.push({ ...datos, rol: datos.rol || ROL_POR_DEFECTO })
  localStorage.setItem(K_USUARIOS, JSON.stringify(usuarios))
  return { ok: true }
}

// ¿El rol del usuario fue inactivado desde el módulo Roles? (el Administrador nunca se inactiva)
function rolInactivo(nombreRol) {
  if (!nombreRol || nombreRol === ROL_ADMIN) return false
  try {
    const roles = JSON.parse(localStorage.getItem(K_ROLES) || '[]')
    const rol = roles.find((r) => String(r.nombre).toLowerCase() === String(nombreRol).toLowerCase())
    return Boolean(rol && rol.estado === 'INACTIVO')
  } catch {
    return false
  }
}

/** Valida correo y contraseña contra los usuarios registrados. */
export function autenticar(correo, clave) {
  const u = leerUsuarios().find((x) => igual(x.correo, correo))
  if (!u) return { ok: false, campo: 'correo', error: 'Este correo no está registrado' }
  if (u.estado === 'INACTIVO') {
    return { ok: false, error: 'Tu usuario está inactivo. Contacta al administrador.' }
  }
  if (u.contrasena !== clave) return { ok: false, campo: 'clave', error: 'Contraseña incorrecta' }
  if (rolInactivo(u.rol)) {
    return { ok: false, error: 'Tu rol está inactivo. Contacta al administrador.' }
  }
  return { ok: true, usuario: u }
}

/** Guarda la sesión. Con "Recordarme" persiste; si no, se cierra al cerrar el navegador. */
export function iniciarSesion(usuario, recordar) {
  const guardar = recordar ? localStorage : sessionStorage
  const otro = recordar ? sessionStorage : localStorage
  otro.removeItem(K_SESION)
  otro.removeItem(K_USUARIO)
  guardar.setItem(K_SESION, 'true')
  const rol =
    usuario.rol ||
    leerUsuarios().find((x) => igual(x.correo, usuario.correo))?.rol ||
    ROL_POR_DEFECTO
  guardar.setItem(
    K_USUARIO,
    JSON.stringify({ nombre_completo: usuario.nombre_completo, correo: usuario.correo, rol })
  )
}

export function haySesion() {
  return localStorage.getItem(K_SESION) === 'true' || sessionStorage.getItem(K_SESION) === 'true'
}

export function usuarioActual() {
  const raw = localStorage.getItem(K_USUARIO) || sessionStorage.getItem(K_USUARIO)
  try {
    const u = raw ? JSON.parse(raw) : null
    // Sesiones iniciadas antes de existir los roles.
    if (u && !u.rol) {
      u.rol = leerUsuarios().find((x) => igual(x.correo, u.correo))?.rol || ROL_POR_DEFECTO
    }
    return u
  } catch {
    return null
  }
}

export function cerrarSesion() {
  ;[localStorage, sessionStorage].forEach((s) => {
    s.removeItem(K_SESION)
    s.removeItem(K_USUARIO)
  })
}

export function obtenerIniciales(nombre = '') {
  const p = nombre.trim().split(/\s+/).filter(Boolean)
  if (!p.length) return 'U'
  return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase()
}
