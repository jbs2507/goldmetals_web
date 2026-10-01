import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cerrarSesion as cerrarSesionAuth, usuarioActual, obtenerIniciales } from '../auth.js'

import {
  KpiRow,
  ChartCard,
  DistCard,
  OrdersCard,
  ProductionCard,
  PricesCard
} from '../components/Cards.jsx'

export default function Dashboard({ theme, onToggleTheme }) {

  const navigate = useNavigate()

  // =========================================
  // MENÚ DEL USUARIO
  // =========================================

  const [menuUsuario, setMenuUsuario] = useState(false)

  // =========================================
  // MENÚ DE NOTIFICACIONES
  // =========================================

  const [menuNotificaciones, setMenuNotificaciones] = useState(false)

  // =========================================
  // SALUDO SEGÚN LA HORA
  // =========================================

  const hora = new Date().getHours()

  let saludo = ''

  if (hora >= 5 && hora < 12) {
    saludo = 'Buenos días'
  } else if (hora >= 12 && hora < 19) {
    saludo = 'Buenas tardes'
  } else {
    saludo = 'Buenas noches'
  }

  // =========================================
  // NOMBRE DEL USUARIO
  // =========================================

  const usuarioActivo = usuarioActual()
  const nombreCompleto = usuarioActivo?.nombre_completo || 'Usuario'
  const nombre = nombreCompleto.split(' ')[0]
  const iniciales = obtenerIniciales(nombreCompleto)

  // =========================================
  // IR AL PERFIL
  // =========================================

  function irPerfil() {
    setMenuUsuario(false)
    navigate('/perfil')
  }

  // =========================================
  // IR A CONFIGURACIÓN
  // =========================================

  function irConfiguracion() {
    setMenuUsuario(false)
    navigate('/configuracion')
  }

  // =========================================
  // CERRAR SESIÓN
  // =========================================

  function cerrarSesion() {
    cerrarSesionAuth()
    navigate('/ingresar', { replace: true })
  }

  return (

    <>

      {/* =========================================
          ENCABEZADO
      ========================================= */}

      <div className="hero">

        <div className="bar">

          {/* =====================================
              SALUDO
          ===================================== */}

          <div>

            <h1>
              {saludo}, {nombre}
            </h1>

            <p>
              Aquí tienes el resumen de tu operación.
            </p>

          </div>

          {/* =====================================
              BUSCADOR
          ===================================== */}

          <div className="s">
            Buscar…
          </div>


          {/* =====================================
              ACCIONES
          ===================================== */}

          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center'
            }}
          >

            {/* MODO OSCURO */}

            <button
              className="tg"
              onClick={onToggleTheme}
            >
              {theme === 'light'
                ? 'Modo oscuro'
                : 'Modo claro'
              }
            </button>


            {/* =================================
                NOTIFICACIONES
            ================================= */}

            <div className="notification-container">

              <button
                className="notification-btn"
                type="button"
                onClick={() =>
                  setMenuNotificaciones(!menuNotificaciones)
                }
                aria-label="Notificaciones"
              >

                <span className="notification-icon">
                  🔔
                </span>

              </button>


              {/* MENÚ DE NOTIFICACIONES */}

              {menuNotificaciones && (

                <div className="notification-dropdown">

                  <div className="notification-header">

                    <strong>
                      Notificaciones
                    </strong>

                    <span>
                      0
                    </span>

                  </div>


                  <div className="notification-divider"></div>


                  <div className="notification-empty">

                    <div className="notification-empty-icon">
                      🔔
                    </div>

                    <strong>
                      No tienes notificaciones
                    </strong>

                    <p>
                      Aquí aparecerán las novedades
                      de tu operación.
                    </p>

                  </div>

                </div>

              )}

            </div>


            {/* =================================
                PERFIL DEL USUARIO
            ================================= */}

            <div className="user-menu-container">

              <button
                className="av"
                type="button"
                onClick={() =>
                  setMenuUsuario(!menuUsuario)
                }
              >
                {iniciales}
              </button>


              {/* MENÚ DEL USUARIO */}

              {menuUsuario && (

                <div className="user-dropdown">

                  {/* INFORMACIÓN DEL USUARIO */}

                  <div className="user-dropdown-header">

                    <div className="user-avatar">
                      {iniciales}
                    </div>

                    <div>

                      <strong>
                        {nombre}
                      </strong>

                      <span>
                        {usuarioActivo?.correo || 'Usuario'}
                      </span>

                    </div>

                  </div>


                  <div className="dropdown-divider"></div>


                  {/* MI PERFIL */}

                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={irPerfil}
                  >
                    <span>
                      Mi perfil
                    </span>

                  </button>


                  {/* CONFIGURACIÓN */}

                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={irConfiguracion}
                  >
                    <span>
                      Configuración
                    </span>

                  </button>


                  <div className="dropdown-divider"></div>


                  {/* CERRAR SESIÓN */}

                  <button
                    className="dropdown-item logout"
                    type="button"
                    onClick={cerrarSesion}
                  >
                    <span>
                      Cerrar sesión
                    </span>

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          CONTENIDO DEL DASHBOARD
      ========================================= */}

      <div className="body">

        <KpiRow />

        <div className="gr r1">

          <ChartCard />

          <DistCard />

        </div>


        <div className="gr r2">

          <OrdersCard />

          <ProductionCard />

          <PricesCard />

        </div>

      </div>

    </>

  )
}