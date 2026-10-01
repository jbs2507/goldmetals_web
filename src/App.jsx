import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import Sidebar from './components/Sidebar.jsx'
import { haySesion } from './auth.js'

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
import RegistrarProduccion from './pages/produccion/RegistrarProduccion.jsx'
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
import RegistrarInsumoOro from "./pages/insumosOro/RegistrarInsumoOro.jsx";
import ConsultarInsumoOro from "./pages/insumosOro/ConsultarInsumoOro.jsx";
import EditarInsumoOro from "./pages/insumosOro/EditarInsumoOro.jsx";

import InsumosPolimetalicos from "./pages/insumosPolimetalicos/InsumosPolimetalicos.jsx";
import RegistrarInsumoPolimetalico from "./pages/insumosPolimetalicos/RegistrarInsumoPolimetalico.jsx";
import ConsultarInsumoPolimetalico from "./pages/insumosPolimetalicos/ConsultarInsumoPolimetalico.jsx";
import EditarInsumoPolimetalico from "./pages/insumosPolimetalicos/EditarInsumoPolimetalico.jsx";

// Solo entra al sistema quien haya iniciado sesión.
function RutaPrivada() {
  return haySesion() ? <Outlet /> : <Navigate to="/ingresar" replace />
}

// Las pantallas de acceso siempre están disponibles.
// Así el localhost puede mostrar Login y desde allí entrar a Registro.
function RutaPublica() {
  return <Outlet />
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
    <Routes>

      <Route element={<RutaPublica />}>
      {/* LOGIN */}
      <Route
        path="/ingresar"
        element={<Login />}
      />

      {/* REGISTRO */}
      <Route
        path="/registrarse"
        element={<Registro />}
      />

      </Route>

      <Route element={<RutaPrivada />}>
      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <div className="web">
            <Sidebar />

            <section className="main">
              <Dashboard
                theme={theme}
                onToggleTheme={toggle}
              />
            </section>
          </div>
        }
      />
      {/* ROLES */}
<Route
  path="/roles"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <Roles />
      </section>
    </div>
  }
/>

<Route
  path="/roles/registrar"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <RegistrarRol />
      </section>
    </div>
  }
/>

<Route
  path="/roles/consultar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <ConsultarRol />
      </section>
    </div>
  }
/>

<Route
  path="/roles/editar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <EditarRol />
      </section>
    </div>
  }
/>
 {/* USUARIOS */}
<Route
  path="/usuarios"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <Usuarios />
      </section>
    </div>
  }
/>

<Route
  path="/usuarios/registrar"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <RegistrarUsuario />
      </section>
    </div>
  }
/>

<Route
  path="/usuarios/consultar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <ConsultarUsuario />
      </section>
    </div>
  }
/>

<Route
  path="/usuarios/editar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <EditarUsuario />
      </section>
    </div>
  }
/>
      {/* COMPRAS */}
      <Route
        path="/compras"
        element={
          <div className="web">
            <Sidebar />

            <section className="main">
              <Compras />
            </section>
          </div>
        }
      />
      {/* REGISTRAR COMPRA */}
<Route
  path="/compras/registrar"
  element={
    <div className="web">
      <Sidebar />

      <section className="main">
        <RegistrarCompra />
      </section>
    </div>
  }
/>

{/* CONSULTAR COMPRA */}
<Route
  path="/compras/consultar/:id"
  element={
    <div className="web">
      <Sidebar />

      <section className="main">
        <ConsultarCompra />
      </section>
    </div>
  }
/>

{/* EDITAR COMPRA */}
<Route
  path="/compras/editar/:id"
  element={
    <div className="web">
      <Sidebar />

      <section className="main">
        <EditarCompra />
      </section>
    </div>
  }
/>
{/* PROVEEDORES */}
<Route
  path="/proveedores"
  element={
    <div className="web">
      <Sidebar />

      <section className="main">
        <Proveedores />
      </section>
    </div>
  }
/>
{/* REGISTRAR PROVEEDOR */}
<Route
  path="/proveedores/registrar"
  element={
    <div className="web">
      <Sidebar />

      <section className="main">
        <RegistrarProveedor />
      </section>
    </div>
  }
/>

{/* CONSULTAR PROVEEDOR */}
<Route
  path="/proveedores/consultar/:id"
  element={
    <div className="web">
      <Sidebar />

      <section className="main">
        <ConsultarProveedor />
      </section>
    </div>
  }
/>

{/* EDITAR PROVEEDOR */}
<Route
  path="/proveedores/editar/:id"
  element={
    <div className="web">
      <Sidebar />

      <section className="main">
        <EditarProveedor />
      </section>
    </div>
  }
/>
{/* PRODUCCIÓN */}
<Route
  path="/produccion"
  element={
    <div className="web">
      <Sidebar />

      <section className="main">
        <Produccion />
      </section>
    </div>
  }
/>

{/* REGISTRAR PRODUCCIÓN */}
<Route
  path="/produccion/registrar"
  element={
    <div className="web">
      <Sidebar />

      <section className="main">
        <RegistrarProduccion />
      </section>
    </div>
  }
/>

{/* CONSULTAR PRODUCCIÓN */}
<Route
  path="/produccion/consultar/:id"
  element={
    <div className="web">
      <Sidebar />

      <section className="main">
        <ConsultarProduccion />
      </section>
    </div>
  }
/>

{/* EDITAR PRODUCCIÓN */}
<Route
  path="/produccion/editar/:id"
  element={
    <div className="web">
      <Sidebar />

      <section className="main">
        <EditarProduccion />
      </section>
    </div>
  }
/>
{/* EMPLEADOS */}
<Route
  path="/empleados"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <Empleados />
      </section>
    </div>
  }
/>

{/* REGISTRAR EMPLEADO */}
<Route
  path="/empleados/registrar"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <RegistrarEmpleado />
      </section>
    </div>
  }
/>

{/* CONSULTAR EMPLEADO */}
<Route
  path="/empleados/consultar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <ConsultarEmpleado />
      </section>
    </div>
  }
/>

{/* EDITAR EMPLEADO */}
<Route
  path="/empleados/editar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <EditarEmpleado />
      </section>
    </div>
  }
/>
{/* VENTAS */}
<Route
  path="/ventas"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <Ventas />
      </section>
    </div>
  }
/>

{/* REGISTRAR VENTA */}
<Route
  path="/ventas/registrar"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <RegistrarVenta />
      </section>
    </div>
  }
/>

{/* CONSULTAR VENTA */}
<Route
  path="/ventas/consultar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <ConsultarVenta />
      </section>
    </div>
  }
/>

{/* EDITAR VENTA */}
<Route
  path="/ventas/editar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <EditarVenta />
      </section>
    </div>
  }
/>
{/* CLIENTES */}
<Route
  path="/clientes"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <Clientes />
      </section>
    </div>
  }
/>

{/* REGISTRAR CLIENTE */}
<Route
  path="/clientes/registrar"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <RegistrarCliente />
      </section>
    </div>
  }
/>

{/* CONSULTAR CLIENTE */}
<Route
  path="/clientes/consultar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <ConsultarCliente />
      </section>
    </div>
  }
/>

{/* EDITAR CLIENTE */}
<Route
  path="/clientes/editar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <EditarCliente />
      </section>
    </div>
  }
/>
<Route
  path="/pedidos"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <Pedidos />
      </section>
    </div>
  }
/>

<Route
  path="/pedidos/registrar"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <RegistrarPedido />
      </section>
    </div>
  }
/>

<Route
  path="/pedidos/consultar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <ConsultarPedido />
      </section>
    </div>
  }
/>

<Route
  path="/pedidos/editar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <EditarPedido />
      </section>
    </div>
  }
/>
{/* =========================================
    INSUMOS UNIFICADOS
========================================= */}

<Route
  path="/insumos"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <Insumos />
      </section>
    </div>
  }
/>

<Route
  path="/insumos/registrar"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <RegistrarInsumo />
      </section>
    </div>
  }
/>

{/* =========================================
    INSUMOS DE ORO
========================================= */}

<Route
  path="/insumos-oro"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <InsumosOro />
      </section>
    </div>
  }
/>

{/* =========================================
    REGISTRAR INSUMO DE ORO
========================================= */}

<Route
  path="/insumos-oro/registrar"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <RegistrarInsumoOro />
      </section>
    </div>
  }
/>

{/* =========================================
    CONSULTAR INSUMO DE ORO
========================================= */}

<Route
  path="/insumos-oro/consultar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <ConsultarInsumoOro />
      </section>
    </div>
  }
/>

{/* =========================================
    EDITAR INSUMO DE ORO
========================================= */}

<Route
  path="/insumos-oro/editar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <EditarInsumoOro />
      </section>
    </div>
  }
/>
{/* =========================================
    INSUMOS DE MATERIALES POLIMETÁLICOS
========================================= */}

<Route
  path="/insumos-polimetalicos"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <InsumosPolimetalicos />
      </section>
    </div>
  }
/>

{/* =========================================
    REGISTRAR INSUMO POLIMETÁLICO
========================================= */}

<Route
  path="/insumos-polimetalicos/registrar"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <RegistrarInsumoPolimetalico />
      </section>
    </div>
  }
/>

{/* =========================================
    CONSULTAR INSUMO POLIMETÁLICO
========================================= */}

<Route
  path="/insumos-polimetalicos/consultar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <ConsultarInsumoPolimetalico />
      </section>
    </div>
  }
/>

{/* =========================================
    EDITAR INSUMO POLIMETÁLICO
========================================= */}

<Route
  path="/insumos-polimetalicos/editar/:id"
  element={
    <div className="web">
      <Sidebar />
      <section className="main">
        <EditarInsumoPolimetalico />
      </section>
    </div>
  }
/>
      </Route>

      {/* INICIO DEL SITIO */}
      {/* Al abrir http://localhost, siempre se muestra primero el inicio de sesión. */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* CUALQUIER RUTA QUE NO EXISTA */}
      <Route
        path="*"
        element={<Navigate to="/ingresar" replace />}
      />

    </Routes>
  )
}