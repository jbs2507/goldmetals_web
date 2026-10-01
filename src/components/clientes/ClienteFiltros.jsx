export default function ClienteFiltros({
  busqueda,
  setBusqueda,
  estado,
  setEstado,
}) {
  return (
    <div className="clientes-filtros">

      <div className="campo-busqueda-cliente">
        <label>
          Buscar cliente
        </label>

        <input
          type="text"
          placeholder="Nombre o identificación tributaria"
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
        />
      </div>

      <div className="campo-filtro-cliente">
        <label>
          Estado
        </label>

        <select
          value={estado}
          onChange={(e) =>
            setEstado(e.target.value)
          }
        >
          <option value="TODOS">
            Todos
          </option>

          <option value="ACTIVO">
            Activo
          </option>

          <option value="INACTIVO">
            Inactivo
          </option>
        </select>
      </div>

    </div>
  );
}