// Datos de ejemplo. Reemplazar por la API / backend cuando esté listo.
export const months = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
export const ventas = [62, 60, 44, 66, 74, 86]
export const compras = [56, 58, 47, 60, 57, 58]

export const kpis = [
  { id: 'ventas', gold: true, label: 'VENTAS DEL MES', value: '$135.2K', delta: '▲ 13.4%' },
  { id: 'compras', label: 'COMPRAS DEL MES', value: '$91.4K', delta: '▲ 10.9%' },
  { id: 'stock', label: 'STOCK DE ORO', value: '2,840 gr', delta: '▼ 3.2%' },
  { id: 'stock-polimetalicos', label: 'STOCK DE INSUMOS POLIMETÁLICOS', value: '1,240 kg', delta: '▲ 5.8%' },
]

export const distribucion = [
  { name: 'Oro', value: 58, color: '#e0aa2b' },
  { name: 'Polimetálicos', value: 33, color: 'var(--b2)' },
  { name: 'Otros', value: 9, color: '#f3e2a6' },
]

export const pedidos = [
  { cliente: 'Joyería El Diamante', entrega: '15 sep 2026', kg: '1,200', piden: '1,500' },
  { cliente: 'Metales Preciosos LTDA', entrega: '02 oct 2026', kg: '860', piden: '900' },
  { cliente: 'Compraventa Rápida', entrega: '20 sep 2026', kg: '430', piden: '430' },
]

export const pedidosOro = [
  { cliente: 'Mumbai Gold Traders', entrega: '12 oct 2026', gr: '1,000', piden: '1,000' },
  { cliente: 'Shenzhen Precious Metals', entrega: '28 oct 2026', gr: '650', piden: '800' },
  { cliente: 'Miami Bullion Group', entrega: '05 nov 2026', gr: '300', piden: '500' },
]

export const produccion = [
  { etapa: 'Recepción de material', pct: 100 },
  { etapa: 'Procesamiento', pct: 75 },
  { etapa: 'Fundición', pct: 40 },
  { etapa: 'Control de calidad', pct: 10 },
  { etapa: 'Empaque y despacho', pct: 0 },
]

// Orden de los módulos según la ficha del proyecto:
// Configuración → Compras → Producción → Ventas.
export const menu = [
  {
    seccion: 'PRINCIPAL',
    items: [
      { label: 'Dashboard', active: true }
    ]
  },

  {
    seccion: 'CONFIGURACIÓN',
    items: [
      { label: 'Roles', path: '/roles' },
      { label: 'Usuarios', path: '/usuarios' }
    ]
  },

  {
    seccion: 'COMPRAS',
    items: [
      { label: 'Insumos', path: '/insumos' },
      { label: 'Proveedores', path: '/proveedores' },
      { label: 'Compras', path: '/compras' }
    ]
  },

  {
    seccion: 'PRODUCCIÓN',
    items: [
      { label: 'Empleados', path: '/empleados' },
      { label: 'Producción', path: '/produccion' }
    ]
  },

  {
    seccion: 'VENTAS',
    items: [
      { label: 'Clientes', path: '/clientes' },
      { label: 'Pedidos', path: '/pedidos' },
      { label: 'Ventas', path: '/ventas' }
    ]
  }
];
