import React from "react";

const CompraFiltros = ({
  busqueda,
  setBusqueda,
  estado,
  setEstado,
}) => {
  return (
    <div className="compra-filtros">

      <div className="campo-busqueda">
        <span>⌕</span>

        <input
          type="text"
          placeholder="Buscar compra..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        <option value="">
          Todos los estados
        </option>

        <option value="REGISTRADA">
          Registrada
        </option>

        <option value="APROBADA">
          Aprobada
        </option>

        <option value="CANCELADA">
          Cancelada
        </option>
      </select>

    </div>
  );
};

export default CompraFiltros;