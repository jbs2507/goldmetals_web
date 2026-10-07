import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'

import Sidebar from './components/Sidebar.jsx'
import Migas, { tituloDeRuta } from './components/Migas.jsx'
import Icono from './components/Iconos.jsx'
import logoDark from './assets/logo-dark.png'
import logoGold from './assets/logo-gold.png'
import { haySesion } from './auth.js'
import { moduloDeRuta, puede } from './permisos.js'

import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'

import Roles from "./pages/roles/Roles.jsx";
import RegistrarRol from "./pages/roles/RegistrarRol.jsx";
import ConsultarRol from "./pages/roles/ConsultarRol.jsx";
import EditarRol from "./pages/roles/EditarRol.jsx";

import Usuarios from "./pages/usuarios/Usuarios.jsx";
import RegistrarUsuario from "./pages/usuarios/RegistrarUsuario.jsx";
import ConsultarUsuario from "./pages/usuarios/ConsultarUsuario.jsx";
import EditarUsuario from "./pages/usuarios/EditarUsuario.jsx";

import Compras from './pages/compras/Compras.jsx'
import RegistrarCompra from './pages/compras/RegistrarCompra.jsx'
import ConsultarCompra from './pages/compras/ConsultarCompra.jsx'
import EditarCompra from './pages/compras/EditarCompra.jsx'

import Proveedores from './pages/proveedores/Proveedores.jsx'
import RegistrarProveedor from './pages/proveedores/RegistrarProveedor.jsx'
import ConsultarProveedor from './pages/proveedores/ConsultarProveedor.jsx'
import EditarProveedor from './pages/proveedores/EditarProveedor.jsx'

import Produccion from './pages/produccion/Produccion.jsx'
import ConsultarProduccion from './pages/produccion/ConsultarProduccion.jsx'
import EditarProduccion from './pages/produccion/EditarProduccion.jsx'

import Empleados from "./pages/empleados/Empleados.jsx";
import RegistrarEmpleado from "./pages/empleados/RegistrarEmpleado.jsx";
import ConsultarEmpleado from "./pages/empleados/ConsultarEmpleado.jsx";
import EditarEmpleado from "./pages/empleados/EditarEmpleado.jsx";

import Ventas from "./pages/ventas/Ventas.jsx";
import RegistrarVenta from "./pages/ventas/RegistrarVenta.jsx";
import ConsultarVenta from "./pages/ventas/ConsultarVenta.jsx";
import EditarVenta from "./pages/ventas/EditarVenta.jsx";

import Clientes from "./pages/clientes/Clientes.jsx";
import RegistrarCliente from "./pages/clientes/RegistrarCliente.jsx";
import ConsultarCliente from "./pages/clientes/ConsultarCliente.jsx";
import EditarCliente from "./pages/clientes/EditarCliente.jsx";

import Pedidos from "./pages/pedidos/Pedidos.jsx";
import RegistrarPedido from "./pages/pedidos/RegistrarPedido.jsx";
import ConsultarPedido from "./pages/pedidos/ConsultarPedido.jsx";
import EditarPedido from "./pages/pedidos/EditarPedido.jsx";

import Insumos from "./pages/insumos/Insumos.jsx";
import RegistrarInsumo from "./pages/insumos/RegistrarInsumo.jsx";
import InsumosOro from "./pages/insumosOro/InsumosOro.jsx";
import ConsultarInsumoOro from "./pages/insumosOro/ConsultarInsumoOro.jsx";
import EditarInsumoOro from "./pages/insumosOro/EditarInsumoOro.jsx";

import InsumosPolimetalicos from "./pages/insumosPolimetalicos/InsumosPolimetalicos.jsx";
import RegistrarInsumoPolimetalico from "./pages/insumosPolimetalicos/RegistrarInsumoPolimetalico.jsx";
import ConsultarInsumoPolimetalico from "./pages/insumosPolimetalicos/ConsultarInsumoPolimetalico.jsx";
import EditarInsumoPolimetalico from "./pages/insumosPolimetalicos/EditarInsumoPolimetalico.jsx";

// Solo entra al sistema quien haya iniciado sesión.
// Además valida que el rol tenga permiso para la pantalla (módulo + acción de la ruta).
function RutaPrivada() {
  const { pathname } = useLocation()
  if (!haySesion()) return <Navigate to="/ingresar" replace />

  const { modulo, accion } = moduloDeRuta(pathname)
  if (modulo && modulo !== 'dashboard' && !puede(modulo, accion)) return <Navigate to="/dashboard" replace />

  return <Outlet />
}

// Las pantallas de acceso siempre están disponibles.
// Así el localhost puede mostrar Login y desde allí entrar a Registro.
function RutaPublica() {
  return <Outlet />
}

// Estructura única de la aplicación: el menú lateral se monta UNA sola vez
// y queda fijo en todos los módulos. Solo cambia el contenido de la derecha.
function LayoutApp() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const [menuAbierto, setMenuAbierto] = useState(false)

  // Al cambiar de pantalla: el contenido vuelve arriba, se cierra el menú móvil
  // y la pestaña del navegador muestra dónde estás.
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0
    setMenuAbierto(false)
  }, [pathname])

  // Esc cierra el menú móvil; al pasar a pantalla ancha se cierra solo.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMenuAbierto(false)
    const onResize = () => window.innerWidth > 900 && setMenuAbierto(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className={`web${menuAbierto ? ' nav-open' : ''}`}>
      <a className="ux-skip" href="#contenido" onClick={(e) => { e.preventDefault(); mainRef.current?.focus() }}>
        Saltar al contenido
      </a>

      {/* Barra superior: solo se ve en celular/tablet */}
      <header className="app-top">
        <button
          type="button"
          className="app-burger"
          onClick={() => setMenuAbierto(true)}
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
        >
          <Icono nombre="menu" size={22} />
        </button>
        <img className="lgl" src={logoDark} alt="Gold Metals App" />
        <img className="lgd" src={logoGold} alt="Gold Metals App" />
      </header>

      <Sidebar />
      <div className="app-scrim" onClick={() => setMenuAbierto(false)} aria-hidden="true" />

      <section className="main" id="contenido" tabIndex={-1} ref={mainRef}>
        <Migas />
        <Outlet />
      </section>
    </div>
  )
}

// El título de la pestaña se actualiza en TODAS las pantallas (incluido Login y Registro).
function TituloPestana() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = tituloDeRuta(pathname)
  }, [pathname])
  return null
}

export default function App() {

  const [theme, setTheme] = useState(
    () => localStorage.getItem('gm-theme') || 'light'
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('gm-theme', theme)
  }, [theme])

  const toggle = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }

  return (
    <>
    <TituloPestana />
    <Routes>

      <Route element={<RutaPublica />}>
        {/* LOGIN */}
        <Route path="/ingresar" element={<Login />} />

        {/* REGISTRO */}
        <Route path="/registrarse" element={<Registro />} />
      </Route>

      <Route element={<RutaPrivada />}>
        <Route element={<LayoutApp />}>

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={<Dashboard theme={theme} onToggleTheme={toggle} />}
          />

          {/* ROLES */}
          <Route path="/roles" element={<Roles />} />
          <Route path="/roles/registrar" element={<RegistrarRol />} />
          <Route path="/roles/consultar/:id" element={<ConsultarRol />} />
          <Route path="/roles/editar/:id" element={<EditarRol />} />

          {/* USUARIOS */}
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuarios/registrar" element={<RegistrarUsuario />} />
          <Route path="/usuarios/consultar/:id" element={<ConsultarUsuario />} />
          <Route path="/usuarios/editar/:id" element={<EditarUsuario />} />

          {/* COMPRAS */}
          <Route path="/compras" element={<Compras />} />
          <Route path="/compras/registrar" element={<RegistrarCompra />} />
          <Route path="/compras/consultar/:id" element={<ConsultarCompra />} />
          <Route path="/compras/editar/:id" element={<EditarCompra />} />

          {/* PROVEEDORES */}
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/proveedores/registrar" element={<RegistrarProveedor />} />
          <Route path="/proveedores/consultar/:id" element={<ConsultarProveedor />} />
          <Route path="/proveedores/editar/:id" element={<EditarProveedor />} />

          {/* PRODUCCIÓN */}
          <Route path="/produccion" element={<Produccion />} />
          <Route path="/produccion/consultar/:id" element={<ConsultarProduccion />} />
          <Route path="/produccion/editar/:id" element={<EditarProduccion />} />

          {/* EMPLEADOS */}
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/empleados/registrar" element={<RegistrarEmpleado />} />
          <Route path="/empleados/consultar/:id" element={<ConsultarEmpleado />} />
          <Route path="/empleados/editar/:id" element={<EditarEmpleado />} />

          {/* VENTAS */}
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/ventas/registrar" element={<RegistrarVenta />} />
          <Route path="/ventas/consultar/:id" element={<ConsultarVenta />} />
          <Route path="/ventas/editar/:id" element={<EditarVenta />} />

          {/* CLIENTES */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/registrar" element={<RegistrarCliente />} />
          <Route path="/clientes/consultar/:id" element={<ConsultarCliente />} />
          <Route path="/clientes/editar/:id" element={<EditarCliente />} />

          {/* PEDIDOS */}
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/pedidos/registrar" element={<RegistrarPedido />} />
          <Route path="/pedidos/consultar/:id" element={<ConsultarPedido />} />
          <Route path="/pedidos/editar/:id" element={<EditarPedido />} />

          {/* INSUMOS UNIFICADOS */}
          <Route path="/insumos" element={<Insumos />} />
          <Route path="/insumos/registrar" element={<RegistrarInsumo />} />

          {/* INSUMOS DE ORO */}
          <Route path="/insumos-oro" element={<InsumosOro />} />
          <Route path="/insumos-oro/consultar/:id" element={<ConsultarInsumoOro />} />
          <Route path="/insumos-oro/editar/:id" element={<EditarInsumoOro />} />

          {/* INSUMOS POLIMETÁLICOS */}
          <Route path="/insumos-polimetalicos" element={<InsumosPolimetalicos />} />
          <Route path="/insumos-polimetalicos/registrar" element={<RegistrarInsumoPolimetalico />} />
          <Route path="/insumos-polimetalicos/consultar/:id" element={<ConsultarInsumoPolimetalico />} />
          <Route path="/insumos-polimetalicos/editar/:id" element={<EditarInsumoPolimetalico />} />

        </Route>
      </Route>

      {/* INICIO DEL SITIO */}
      {/* Al abrir http://localhost, siempre se muestra primero el inicio de sesión. */}
      <Route path="/" element={<Login />} />

      {/* CUALQUIER RUTA QUE NO EXISTA */}
      <Route path="*" element={<Navigate to="/ingresar" replace />} />

    </Routes>
    </>
  )
}
