import { useEffect, useState } from 'react'
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

export const PricesCard = () => {
  const [precios, setPrecios] = useState(null)
  const [error, setError] = useState('')

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
        <h3>Precios del día</h3>
        <div className="s">
          Oro y dólar en tiempo real{hora ? ` · actualizado ${hora}` : ''}
        </div>
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
