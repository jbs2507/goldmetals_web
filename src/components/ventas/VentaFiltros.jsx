export default function VentaFiltros({
  busqueda,
  setBusqueda,
  estado,
  setEstado,
}) {
  return (
    <div className="ventas-filtros">

      <div className="campo-busqueda-venta">

        <span>⌕</span>

        <input
          type="text"
          placeholder="Buscar por cliente, pedido, material o país destino..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
        />

      </div>

      <select
        value={estado}
        onChange={(e) =>
          setEstado(e.target.value)
        }
      >
        <option value="TODOS">
          Todos los estados
        </option>

        <option value="REGISTRADA">
          REGISTRADA
        </option>

        <option value="DESPACHADA">
          DESPACHADA
        </option>

        <option value="ENTREGADA">
          ENTREGADA
        </option>

        <option value="CANCELADA">
          CANCELADA
        </option>
      </select>

    </div>
  );
}