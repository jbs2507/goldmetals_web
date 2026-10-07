import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BarChart, Donut, useTamano } from './Charts.jsx'
import { kpis, pedidos, pedidosOro } from '../data.js'
import { cargarPrecios, precioOroPorGramo } from '../utils/precios.js'

export const KpiRow = () => (
  <div className="kg">
    {kpis.map((k) => (
      <div key={k.id} className={'kc' + (k.gold ? ' gd' : '')}>
        <small>{k.label}</small>
        <b className="g">{k.value}</b>
        <span className="tag">{k.delta}</span>
      </div>
    ))}
  </div>
)

export const ChartCard = () => {
  const [ref, tam] = useTamano()
  return (
  <div className="c chart-card">
    <div className="hd">
      <div>
        <h3>Compra y venta de insumos polimetálicos y oro</h3>
        <div className="s">Últimos 6 meses · valores en USD</div>
      </div>
      <span className="pill">Año 2026</span>
    </div>
    <div className="lg">
      <span><u style={{ background: '#e0aa2b' }} />Ventas</span>
      <span><u style={{ background: 'var(--b2)' }} />Compras</span>
    </div>
    <div className="chart-area" ref={ref}>
      <BarChart w={tam.w} h={tam.h} />
    </div>
  </div>
  )
}

export const DistCard = () => (
  <div className="c dist-card">
    <div className="hd">
      <div>
        <h3>Distribución actual de los productos</h3>
        <div className="s">Valores del año 2026</div>
      </div>
      <div className="seg"><div>Día</div><div>Mes</div><div className="on">Año</div></div>
    </div>
    <Donut size={104} />
  </div>
)

export const OrdersCard = () => (
  <div className="c">
    <div className="hd">
      <div>
        <h3>Pedidos de materiales polimetálicos</h3>
        <div className="s">Compromisos de entrega vigentes</div>
      </div>
      <span className="pill">{pedidos.length} activos</span>
    </div>
    {pedidos.map((p) => (
      <div className="ord" key={p.cliente}>
        <div className="m"><b>{p.cliente}</b><small>Entrega: {p.entrega}</small></div>
        <div className="r"><b>{p.kg} kg</b><small>Piden: {p.piden} kg</small></div>
      </div>
    ))}
  </div>
)

export const GoldOrdersCard = () => (
  <div className="c">
    <div className="hd">
      <div>
        <h3>Pedidos de lingotes de oro</h3>
        <div className="s">Compromisos de entrega vigentes</div>
      </div>
      <span className="pill">{pedidosOro.length} activos</span>
    </div>
    {pedidosOro.map((p) => (
      <div className="ord" key={p.cliente}>
        <div className="m"><b>{p.cliente}</b><small>Entrega: {p.entrega}</small></div>
        <div className="r"><b>{p.gr} gr</b><small>Piden: {p.piden} gr</small></div>
      </div>
    ))}
  </div>
)

// =========================================
// PRECIOS DEL DÍA (oro y dólar en vivo)
// La lógica de consulta y caché está en utils/precios.js
// =========================================

const formatoMoneda = (n) =>
  n.toLocaleString('es-CO', { maximumFractionDigits: 2 })

// Estilos del botón "Actualizar precios" y del aviso (van aquí para que viajen con el componente).
const ESTILOS_ACTUALIZAR = `
.px-actualizar {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border: 1px solid #e6b53a;
  border-radius: 999px;
  background: #e6b53a22;
  color: #f7e08a;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 400;
  line-height: 1.2;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.px-actualizar:hover:not(:disabled) {
  background: #e6b53a;
  color: #2a1d05;
}
.px-actualizar:focus-visible {
  outline: 2px solid #f7e08a;
  outline-offset: 2px;
}
.px-actualizar:disabled {
  opacity: 0.75;
  cursor: wait;
}
.px-actualizar-ico {
  display: inline-block;
  font-size: 15px;
  line-height: 1;
}
.px-actualizar-ico.girando {
  animation: px-girar 0.8s linear infinite;
}
@keyframes px-girar {
  to { transform: rotate(360deg); }
}
.px-aviso {
  position: fixed;
  top: 22px;
  right: 24px;
  z-index: 3000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 12px;
  background: #1f6b3a;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
  animation: px-aviso-in 0.2s ease both;
}
@keyframes px-aviso-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
`

export const PricesCard = () => {
  const [precios, setPrecios] = useState(null)
  const [error, setError] = useState('')
  const [actualizando, setActualizando] = useState(false)
  const [aviso, setAviso] = useState('')
  const temporizador = useRef(null)

  function mostrarAviso(texto) {
    setAviso(texto)
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setAviso(''), 3500)
  }

  useEffect(() => () => clearTimeout(temporizador.current), [])

  async function actualizar() {
    if (actualizando) return
    setActualizando(true)
    try {
      const datos = await cargarPrecios({ forzar: true })
      // Si se pulsó muy seguido, no hay datos nuevos: se avisa sin repetir la consulta.
      const nuevos = !precios || datos.actualizado !== precios.actualizado
      setPrecios(datos)
      setError('')
      mostrarAviso(
        nuevos
          ? 'Los precios se actualizaron correctamente'
          : 'Los precios ya están actualizados'
      )
    } catch (e) {
      // Se conservan los precios que ya se estaban mostrando.
      setError('No se pudo actualizar ahora. Se muestran los últimos precios guardados.')
    } finally {
      setActualizando(false)
    }
  }

  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        const datos = await cargarPrecios()
        if (activo) {
          setPrecios(datos)
          setError('')
        }
      } catch (e) {
        if (activo) {
          setError('Demasiadas solicitudes por ahora. Espera unos minutos e intenta de nuevo.')
        }
      }
    }

    cargar()

    return () => {
      activo = false
    }
  }, [])

  const gramoCop = precios ? precioOroPorGramo(precios, 'COP') : null
  const hora = precios
    ? new Date(precios.actualizado).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div className="c px px-top">
      <div className="px-info">
        <h3 style={{ fontWeight: 400 }}>Precios del día</h3>
        <div className="s">
          Oro y dólar en tiempo real{hora ? ` · actualizado ${hora}` : ''}
        </div>
        <button
          type="button"
          className="px-actualizar"
          onClick={actualizar}
          disabled={actualizando}
        >
          <span className={'px-actualizar-ico' + (actualizando ? ' girando' : '')} aria-hidden="true">↻</span>
          {actualizando ? 'Actualizando…' : 'Actualizar precios'}
        </button>
        <style>{ESTILOS_ACTUALIZAR}</style>
        {aviso &&
          createPortal(
            <div className="px-aviso" role="status" aria-live="polite">
              <span aria-hidden="true">✓</span> {aviso}
            </div>,
            document.body
          )}
      </div>
      <div className="v">
        <div>
          <small>Oro (USD/oz)</small>
          <b>{precios ? `$${formatoMoneda(precios.oro)}` : '$— —'}</b>
        </div>
        <div>
          <small>Oro (COP/gramo)</small>
          <b>{gramoCop ? `$${formatoMoneda(gramoCop)}` : '$— —'}</b>
        </div>
        <div>
          <small>Dólar (USD → COP)</small>
          <b>{precios ? `$${formatoMoneda(precios.cop)}` : '$— —'}</b>
        </div>
      </div>
      {error && <div className="wn">⚠ {error}</div>}
    </div>
  )
}
