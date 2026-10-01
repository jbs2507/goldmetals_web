import React from "react";

const ProduccionFiltros = ({
  busqueda,
  setBusqueda,
}) => {
  return (
    <div className="produccion-filtros">
      <div className="campo-busqueda-produccion">
        <span>⌕</span>

        <input
          type="text"
          placeholder="Buscar producción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProduccionFiltros;