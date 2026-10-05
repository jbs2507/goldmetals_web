import { useEffect, useRef, useState } from 'react'
import { months, ventas, compras, distribucion } from '../data.js'

// Mide el espacio disponible para que la gráfica ocupe exactamente su tarjeta
// (así no hace falta hacer scroll para verla completa).
export function useTamano(inicial = { w: 620, h: 200 }) {
  const ref = useRef(null)
  const [tam, setTam] = useState(inicial)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const medir = () => {
      const w = Math.round(el.clientWidth)
      const h = Math.round(el.clientHeight)
      if (w > 0 && h > 0) setTam((t) => (t.w === w && t.h === h ? t : { w, h }))
    }
    medir()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, tam]
}

export function BarChart({ w = 620, h = 240 }) {
  const bw = (w - 40) / 6
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e08a" />
          <stop offset="1" stopColor="#b98010" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="30" x2={w} y1={10 + (i * (h - 40)) / 3} y2={10 + (i * (h - 40)) / 3} stroke="var(--ln)" />
      ))}
      {months.map((m, i) => {
        const x = 34 + i * bw
        const a = ((ventas[i] - 20) * (h - 40)) / 70
        const b = ((compras[i] - 20) * (h - 40)) / 70
        return (
          <g key={m}>
            <rect x={x} y={h - 20 - a} width={bw * 0.34} height={a} rx="5" fill="url(#gg)" />
            <rect x={x + bw * 0.38} y={h - 20 - b} width={bw * 0.34} height={b} rx="5" style={{ fill: 'var(--b2)' }} />
            <text x={x + bw * 0.36} y={h - 4} fontSize="11" textAnchor="middle" fill="var(--mu)">{m}</text>
          </g>
        )
      })}
    </svg>
  )
}

export function Donut({ size = 150, label = '2026' }) {
  const r = size / 2 - 12
  const L = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="don">
      <svg width={size} height={size}>
        {distribucion.map((d) => {
          const el = (
            <circle key={d.name} cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="18"
              style={{ stroke: d.color }} strokeDasharray={`${(L * d.value) / 100 - 3} ${L}`}
              strokeDashoffset={-(offset * L) / 100} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
          )
          offset += d.value
          return el
        })}
        <text x={size / 2} y={size / 2 + 6} textAnchor="middle" fontSize="18" fontWeight="800" fill="var(--tx)">{label}</text>
      </svg>
      <ul>
        {distribucion.map((d) => (
          <li key={d.name}>
            <span><u style={{ background: d.color }} />{d.name}</span>
            <b>{d.value}</b>
          </li>
        ))}
      </ul>
    </div>
  )
}
