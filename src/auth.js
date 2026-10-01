// Autenticación TEMPORAL en el navegador (localStorage).
// Cuando esté el backend, reemplazar estas funciones por llamadas a la API
// (POST /auth/login, POST /auth/registro, etc.) y usar el token que devuelva.

const K_USUARIOS = 'gm-usuarios'
const K_SESION = 'gm-sesion'
const K_USUARIO = 'gm-usuario'

// Usuario de prueba para poder entrar la primera vez (borrar al conectar el backend).
const SEMILLA = [
  {
    nombre_completo: 'Administrador',
    correo: 'admin@mmmetalsgold.com',
    telefono: '3001234567',
    contrasena: 'Admin12345',
    estado: 'ACTIVO',
  },
]

function leerUsuarios() {
  try {
    const raw = localStorage.getItem(K_USUARIOS)
    if (!raw) {
      localStorage.setItem(K_USUARIOS, JSON.stringify(SEMILLA))
      return [...SEMILLA]
    }
    return JSON.parse(raw)
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
  usuarios.push(datos)
  localStorage.setItem(K_USUARIOS, JSON.stringify(usuarios))
  return { ok: true }
}

/** Valida correo y contraseña contra los usuarios registrados. */
export function autenticar(correo, clave) {
  const u = leerUsuarios().find((x) => igual(x.correo, correo))
  if (!u) return { ok: false, campo: 'correo', error: 'Este correo no está registrado' }
  if (u.estado === 'INACTIVO') {
    return { ok: false, error: 'Tu usuario está inactivo. Contacta al administrador.' }
  }
  if (u.contrasena !== clave) return { ok: false, campo: 'clave', error: 'Contraseña incorrecta' }
  return { ok: true, usuario: u }
}

/** Guarda la sesión. Con "Recordarme" persiste; si no, se cierra al cerrar el navegador. */
export function iniciarSesion(usuario, recordar) {
  const guardar = recordar ? localStorage : sessionStorage
  const otro = recordar ? sessionStorage : localStorage
  otro.removeItem(K_SESION)
  otro.removeItem(K_USUARIO)
  guardar.setItem(K_SESION, 'true')
  guardar.setItem(
    K_USUARIO,
    JSON.stringify({ nombre_completo: usuario.nombre_completo, correo: usuario.correo })
  )
}

export function haySesion() {
  return localStorage.getItem(K_SESION) === 'true' || sessionStorage.getItem(K_SESION) === 'true'
}

export function usuarioActual() {
  const raw = localStorage.getItem(K_USUARIO) || sessionStorage.getItem(K_USUARIO)
  try {
    return raw ? JSON.parse(raw) : null
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
