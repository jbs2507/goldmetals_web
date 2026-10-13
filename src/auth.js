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

// Cada usuario lleva un id_usuario para poder consultarlo, editarlo y eliminarlo desde el módulo Usuarios.
function conIds(usuarios) {
  let max = usuarios.reduce((m, u) => Math.max(m, Number(u.id_usuario) || 0), 0)
  let cambio = false
  usuarios.forEach((u) => {
    if (!u.id_usuario) {
      max += 1
      u.id_usuario = max
      cambio = true
    }
  })
  return cambio
}

function leerUsuariosConId() {
  const usuarios = leerUsuarios()
  if (conIds(usuarios)) localStorage.setItem(K_USUARIOS, JSON.stringify(usuarios))
  return usuarios
}

/** Registra un usuario nuevo. Devuelve { ok } o { ok:false, error }. */
export function registrarUsuario(datos) {
  const usuarios = leerUsuariosConId()
  if (usuarios.some((u) => igual(u.correo, datos.correo))) {
    return { ok: false, error: 'Este correo ya está registrado' }
  }
  const id = usuarios.reduce((m, u) => Math.max(m, Number(u.id_usuario) || 0), 0) + 1
  usuarios.push({ ...datos, id_usuario: id, rol: datos.rol || ROL_POR_DEFECTO })
  localStorage.setItem(K_USUARIOS, JSON.stringify(usuarios))
  return { ok: true }
}

/** Usuarios para el módulo Usuarios (nunca se expone la contraseña). */
export function listarUsuarios() {
  return leerUsuariosConId().map((u) => {
    // eslint-disable-next-line no-unused-vars
    const { contrasena, ...publico } = u
    return publico
  })
}

/** Actualiza nombre, correo, teléfono, rol y estado de un usuario. Devuelve { ok } o { ok:false, error }. */
export function actualizarUsuario(id, cambios) {
  const usuarios = leerUsuariosConId()
  const i = usuarios.findIndex((u) => Number(u.id_usuario) === Number(id))
  if (i === -1) return { ok: false, error: 'Usuario no encontrado' }
  if (cambios.correo && usuarios.some((u, k) => k !== i && igual(u.correo, cambios.correo))) {
    return { ok: false, error: 'Este correo ya está registrado' }
  }
  const anterior = usuarios[i]
  usuarios[i] = { ...anterior, ...cambios, id_usuario: anterior.id_usuario }
  localStorage.setItem(K_USUARIOS, JSON.stringify(usuarios))

  // Si se edita al usuario con la sesión abierta, se actualizan los datos de la sesión.
  const almacen = localStorage.getItem(K_USUARIO) ? localStorage : sessionStorage.getItem(K_USUARIO) ? sessionStorage : null
  if (almacen) {
    try {
      const sesion = JSON.parse(almacen.getItem(K_USUARIO))
      if (sesion && igual(sesion.correo || '', anterior.correo)) {
        almacen.setItem(
          K_USUARIO,
          JSON.stringify({
            ...sesion,
            nombre_completo: usuarios[i].nombre_completo,
            correo: usuarios[i].correo,
            rol: usuarios[i].rol,
          })
        )
      }
    } catch {
      /* sesión dañada: se ignora */
    }
  }
  return { ok: true }
}

/** Elimina un usuario. No permite borrar la cuenta administradora principal ni la sesión actual. */
export function eliminarUsuario(id) {
  const usuarios = leerUsuariosConId()
  const usuario = usuarios.find((u) => Number(u.id_usuario) === Number(id))
  if (!usuario) return { ok: false, error: 'Usuario no encontrado' }
  if (igual(usuario.correo, SEMILLA[0].correo)) {
    return { ok: false, error: 'La cuenta del administrador principal no se puede eliminar' }
  }
  const sesion = (() => {
    try {
      return JSON.parse(localStorage.getItem(K_USUARIO) || sessionStorage.getItem(K_USUARIO) || 'null')
    } catch {
      return null
    }
  })()
  if (sesion && igual(sesion.correo || '', usuario.correo)) {
    return { ok: false, error: 'No puedes eliminar el usuario con el que tienes la sesión abierta' }
  }
  localStorage.setItem(K_USUARIOS, JSON.stringify(usuarios.filter((u) => Number(u.id_usuario) !== Number(id))))
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
