// Roles, permisos y privilegios (TEMPORAL en el navegador, igual que auth.js).
// Cuando esté el backend, reemplazar el almacenamiento por llamadas a la API
// (GET/POST/PUT/DELETE /roles) y leer los permisos del token del usuario.
import { useLocation } from 'react-router-dom'
import { usuarioActual, ROL_ADMIN } from './auth.js'

const K_ROLES = 'gm-roles'

// ─────────────────────────────────────────────────────────────
// CATÁLOGO
// ─────────────────────────────────────────────────────────────

// Privilegios: qué puede HACER el rol dentro de cada módulo.
export const ACCIONES = [
  { id: 'ver', etiqueta: 'Ver', ayuda: 'Entrar y consultar la información general' },
  { id: 'crear', etiqueta: 'Registrar', ayuda: 'Crear nuevos registros' },
  { id: 'editar', etiqueta: 'Editar', ayuda: 'Modificar registros existentes' },
  { id: 'eliminar', etiqueta: 'Eliminar / Anular', ayuda: 'Eliminar o anular registros' },
  { id: 'descargar', etiqueta: 'Descargar', ayuda: 'Descargar documentos y listados' },
]

// Módulos del sistema (el id coincide con el primer tramo de la ruta).
export const MODULOS = [
  // Mismo orden que el alcance de la ficha del proyecto.
  // El Dashboard solo tiene "Ver": sin él, el rol entra a una pantalla de bienvenida.
  { id: 'dashboard', nombre: 'Dashboard', grupo: 'Principal', soloVer: true },
  { id: 'roles', nombre: 'Roles', grupo: 'Configuración' },
  { id: 'usuarios', nombre: 'Usuarios', grupo: 'Configuración' },
  { id: 'insumos', nombre: 'Insumos', grupo: 'Compras' },
  { id: 'proveedores', nombre: 'Proveedores', grupo: 'Compras' },
  { id: 'compras', nombre: 'Compras', grupo: 'Compras' },
  { id: 'empleados', nombre: 'Empleados', grupo: 'Producción' },
  { id: 'produccion', nombre: 'Producción', grupo: 'Producción' },
  { id: 'clientes', nombre: 'Clientes', grupo: 'Ventas' },
  { id: 'pedidos', nombre: 'Pedidos', grupo: 'Ventas' },
  { id: 'ventas', nombre: 'Ventas', grupo: 'Ventas' },
]

// Información sensible: qué puede VER el rol además de la información general.
export const DATOS_SENSIBLES = [
  { id: 'precios', etiqueta: 'Precios y valores', ayuda: 'Precios, totales, pagos, saldos y regalías' },
  { id: 'cantidades', etiqueta: 'Cantidades', ayuda: 'Pesos, stock, cantidades y leyes' },
  { id: 'estadisticas', etiqueta: 'Estadísticas', ayuda: 'KPIs, gráficas y resúmenes del Dashboard y de los módulos' },
]

export const clavePermiso = (modulo, accion) => `${modulo}.${accion}`
export const claveDato = (dato) => `datos.${dato}`

// Privilegios que aplican a un módulo (el Dashboard solo tiene "Ver").
export const accionesDeModulo = (m) => (m.soloVer ? ACCIONES.filter((a) => a.id === 'ver') : ACCIONES)

const todosLosPermisos = () => [
  ...MODULOS.flatMap((m) => accionesDeModulo(m).map((a) => clavePermiso(m.id, a.id))),
  ...DATOS_SENSIBLES.map((d) => claveDato(d.id)),
]

// Solo consulta: ver y descargar documentos en los módulos operativos,
// sin precios, cantidades ni estadísticas (por ahora).
const soloConsulta = () =>
  MODULOS.filter((m) => m.grupo !== 'Configuración').flatMap((m) =>
    m.soloVer
      ? [clavePermiso(m.id, 'ver')]
      : [clavePermiso(m.id, 'ver'), clavePermiso(m.id, 'descargar')]
  )

const SEMILLA = [
  {
    id_rol: 1,
    nombre: ROL_ADMIN,
    descripcion: 'Acceso total: puede ver y editar todo el sistema.',
    sistema: true, // protegido: no se edita, no se elimina ni se inactiva
    estado: 'ACTIVO',
    permisos: todosLosPermisos(),
  },
  {
    id_rol: 2,
    nombre: 'Contador',
    descripcion: 'Solo consulta: ve información general y descarga documentos.',
    sistema: false,
    estado: 'ACTIVO',
    permisos: soloConsulta(),
  },
  {
    id_rol: 3,
    nombre: 'Abogado',
    descripcion: 'Solo consulta: ve información general y descarga documentos.',
    sistema: false,
    estado: 'ACTIVO',
    permisos: soloConsulta(),
  },
]

// ─────────────────────────────────────────────────────────────
// ALMACENAMIENTO DE ROLES
// ─────────────────────────────────────────────────────────────

export function listarRoles() {
  try {
    const raw = localStorage.getItem(K_ROLES)
    if (!raw) {
      localStorage.setItem(K_ROLES, JSON.stringify(SEMILLA))
      return SEMILLA.map((r) => ({ ...r, permisos: [...r.permisos] }))
    }
    // Los roles guardados antes de existir la fila "Dashboard" conservan su acceso (se les marca "Ver").
    const roles = JSON.parse(raw).map((r) =>
      r.permisosV2 || r.permisos.includes(clavePermiso('dashboard', 'ver'))
        ? r
        : { ...r, permisos: [...r.permisos, clavePermiso('dashboard', 'ver')] }
    )
    // El Administrador siempre conserva todos los permisos (aunque se agreguen módulos nuevos).
    // Los roles guardados antes de existir el estado quedan ACTIVOS; el Administrador siempre está activo.
    return roles.map((r) =>
      r.nombre === ROL_ADMIN
        ? { ...r, sistema: true, estado: 'ACTIVO', permisos: todosLosPermisos() }
        : { ...r, estado: r.estado || 'ACTIVO' }
    )
  } catch {
    return SEMILLA.map((r) => ({ ...r, permisos: [...r.permisos] }))
  }
}

const guardarRoles = (roles) =>
  localStorage.setItem(K_ROLES, JSON.stringify(roles.map((r) => ({ ...r, permisosV2: true }))))

export const obtenerRol = (id) => listarRoles().find((r) => r.id_rol === Number(id)) || null
export const obtenerRolPorNombre = (nombre) =>
  listarRoles().find((r) => r.nombre.toLowerCase() === String(nombre).toLowerCase()) || null

const mismoNombre = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

/** Crea un rol. Devuelve { ok } o { ok:false, error }. */
export function crearRol(datos) {
  const roles = listarRoles()
  if (roles.some((r) => mismoNombre(r.nombre, datos.nombre))) {
    return { ok: false, error: 'Ya existe un rol con ese nombre' }
  }
  const id = roles.reduce((m, r) => Math.max(m, r.id_rol), 0) + 1
  roles.push({ id_rol: id, sistema: false, descripcion: '', estado: 'ACTIVO', ...datos })
  guardarRoles(roles)
  return { ok: true }
}

/** Actualiza un rol (el rol de sistema no se modifica). */
export function actualizarRol(id, datos) {
  const roles = listarRoles()
  const actual = roles.find((r) => r.id_rol === Number(id))
  if (!actual) return { ok: false, error: 'Rol no encontrado' }
  if (actual.sistema) return { ok: false, error: 'El rol Administrador no se puede modificar' }
  if (roles.some((r) => r.id_rol !== actual.id_rol && mismoNombre(r.nombre, datos.nombre))) {
    return { ok: false, error: 'Ya existe un rol con ese nombre' }
  }
  guardarRoles(roles.map((r) => (r.id_rol === actual.id_rol ? { ...r, ...datos } : r)))
  return { ok: true }
}

/** Activa o inactiva un rol (el Administrador siempre queda activo). Devuelve { ok, estado }. */
export function cambiarEstadoRol(id) {
  const roles = listarRoles()
  const actual = roles.find((r) => r.id_rol === Number(id))
  if (!actual) return { ok: false, error: 'Rol no encontrado' }
  if (actual.sistema) return { ok: false, error: 'El rol Administrador no se puede inactivar' }
  const estado = actual.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
  guardarRoles(roles.map((r) => (r.id_rol === actual.id_rol ? { ...r, estado } : r)))
  return { ok: true, estado }
}

export function eliminarRolGuardado(id) {
  const roles = listarRoles()
  const actual = roles.find((r) => r.id_rol === Number(id))
  if (!actual || actual.sistema) return { ok: false }
  guardarRoles(roles.filter((r) => r.id_rol !== actual.id_rol))
  return { ok: true }
}

// ─────────────────────────────────────────────────────────────
// CONSULTA DE PERMISOS DEL USUARIO EN SESIÓN
// ─────────────────────────────────────────────────────────────

const permisosDelUsuario = () => {
  const nombreRol = usuarioActual()?.rol
  if (!nombreRol) return []
  if (nombreRol === ROL_ADMIN) return todosLosPermisos()
  const rol = obtenerRolPorNombre(nombreRol)
  // Un rol inactivo no otorga ningún permiso.
  return rol && rol.estado === 'ACTIVO' ? rol.permisos : []
}

export const puede = (modulo, accion) => permisosDelUsuario().includes(clavePermiso(modulo, accion))
export const puedeVerDato = (dato) => permisosDelUsuario().includes(claveDato(dato))

// Qué módulo y acción corresponde a una ruta: /compras/editar/3 -> compras + editar.
export function moduloDeRuta(pathname) {
  const [primero, segundo] = pathname.split('/').filter(Boolean)
  if (!primero) return { modulo: null, accion: 'ver' }
  const modulo = primero.startsWith('insumos') ? 'insumos' : primero
  const accion = segundo === 'registrar' ? 'crear' : segundo === 'editar' ? 'editar' : 'ver'
  return { modulo: MODULOS.some((m) => m.id === modulo) ? modulo : null, accion }
}

/** Hook: permisos referidos al módulo de la pantalla actual. */
export function usePermisos() {
  const { pathname } = useLocation()
  const { modulo } = moduloDeRuta(pathname)
  return {
    modulo,
    puede: (accion, mod = modulo) => (mod ? puede(mod, accion) : true),
    puedeVerDato: puedeVerDato,
    esAdmin: usuarioActual()?.rol === ROL_ADMIN,
    rol: usuarioActual()?.rol || '',
  }
}
