export default function EmpleadoFiltros({
  busqueda,
  setBusqueda,
  estado,
  setEstado,
}) {
  return (
    <div className="empleados-filtros">

      <div className="campo-busqueda-empleado">

        <span>⌕</span>

        <input
          type="text"
          placeholder="Buscar por nombre, documento, cargo o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

      </div>

      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        <option value="TODOS">
          Todos los estados
        </option>

        <option value="ACTIVO">
          ACTIVO
        </option>

        <option value="INACTIVO">
          INACTIVO
        </option>
      </select>

    </div>
  );
}