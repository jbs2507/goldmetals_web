import { useEffect, useState } from 'react'
import { BarChart, Donut } from './Charts.jsx'
import { kpis, pedidos, produccion } from '../data.js'

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

export const ChartCard = () => (
  <div className="c">
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
    <BarChart />
  </div>
)

export const DistCard = () => (
  <div className="c">
    <h3>Distribución actual de los productos</h3>
    <div className="s">Valores del año 2026</div>
    <div className="seg"><div>Día</div><div>Mes</div><div className="on">Año</div></div>
    <Donut />
  </div>
)

export const OrdersCard = () => (
  <div className="c">
    <div className="hd">
      <div>
        <h3>Pedidos en polimetálicos</h3>
        <div className="s">Compromisos de entrega vigentes</div>
      </div>
      <span className="pill">{pedidos.length} activos</span>
    </div>
    {pedidos.map((p) => (
      <div className="ord" key={p.cliente}>
        <span style={{ fontSize: 20 }}></span>
        <div className="m"><b>{p.cliente}</b><small>Entrega: {p.entrega}</small></div>
        <div className="r"><b>{p.kg} kg</b><small>Piden: {p.piden} kg</small></div>
      </div>
    ))}
  </div>
)

export const ProductionCard = () => (
  <div className="c">
    <div className="hd">
      <div>
        <h3>Producción</h3>
        <div className="s">Avance de la orden en curso</div>
      </div>
      <span className="pill">45% completado</span>
    </div>
    {produccion.map((p) => (
      <div className="pr" key={p.etapa}>
        <div className="t"><span>{p.etapa}</span><span style={{ color: 'var(--g3)' }}>{p.pct}%</span></div>
        <div className="bg"><i style={{ width: p.pct + '%' }} /></div>
      </div>
    ))}
  </div>
)

// TODO: conectar con la API de precios y mostrar el último valor guardado si hay límite de solicitudes.
// =========================================
// PRECIOS DEL DÍA (oro y dólar en vivo)
// Mismas fuentes que usa la app móvil:
//  - Oro:   https://api.gold-api.com/price/XAU
//  - Dólar: https://open.er-api.com/v6/latest/USD
// Se cachea 1 hora en localStorage para no chocar
// con el límite de solicitudes del servicio gratuito.
// =========================================

const PRECIOS_CACHE_KEY = 'gm_precios_dia_v1'
const PRECIOS_CACHE_MS = 60 * 60 * 1000 // 1 hora

async function obtenerPreciosDelDia() {
  const [oroRes, dolarRes] = await Promise.all([
    fetch('https://api.gold-api.com/price/XAU'),
    fetch('https://open.er-api.com/v6/latest/USD'),
  ])

  if (!oroRes.ok) throw new Error('oro')
  if (!dolarRes.ok) throw new Error('dolar')

  const oroJson = await oroRes.json()
  const dolarJson = await dolarRes.json()

  const oro = Number(oroJson?.price)
  const cop = Number(dolarJson?.rates?.COP)

  if (!Number.isFinite(oro) || !Number.isFinite(cop)) {
    throw new Error('formato')
  }

  return { oro, cop, actualizado: Date.now() }
}

const formatoMoneda = (n) =>
  n.toLocaleString('es-CO', { maximumFractionDigits: 2 })

export const PricesCard = () => {
  const [precios, setPrecios] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargar(forzar) {
      try {
        if (!forzar) {
          const cacheRaw = localStorage.getItem(PRECIOS_CACHE_KEY)
          if (cacheRaw) {
            const cache = JSON.parse(cacheRaw)
            if (Date.now() - cache.actualizado < PRECIOS_CACHE_MS) {
              if (activo) {
                setPrecios(cache)
                setError('')
              }
              return
            }
          }
        }

        const datos = await obtenerPreciosDelDia()
        localStorage.setItem(PRECIOS_CACHE_KEY, JSON.stringify(datos))

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

    cargar(false)

    return () => {
      activo = false
    }
  }, [])

  return (
    <div className="c px">
      <div className="hd">
        <div>
          <h3>Precios del día</h3>
          <div className="s">Dólar y oro, en tiempo real</div>
        </div>
        <span className="pill">⟳</span>
      </div>
      <div className="v">
        <div>
          <small>USD → COP</small>
          <b>{precios ? `$${formatoMoneda(precios.cop)}` : '$— —'}</b>
        </div>
        <div>
          <small>Oro (USD/oz)</small>
          <b>{precios ? `$${formatoMoneda(precios.oro)}` : '$— —'}</b>
        </div>
      </div>
      {error && <div className="wn">⚠ {error}</div>}
    </div>
  )
}
