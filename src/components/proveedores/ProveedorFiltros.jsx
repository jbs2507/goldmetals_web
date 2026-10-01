import React from "react";

const ProveedorFiltros = ({
  busqueda,
  setBusqueda,
  estado,
  setEstado,
}) => {
  return (
    <div className="proveedor-filtros">

      <div className="campo-busqueda-proveedor">
        <span>⌕</span>

        <input
          type="text"
          placeholder="Buscar proveedor..."
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

        <option value="ACTIVO">
          Activo
        </option>

        <option value="INACTIVO">
          Inactivo
        </option>
      </select>

    </div>
  );
};

export default ProveedorFiltros;