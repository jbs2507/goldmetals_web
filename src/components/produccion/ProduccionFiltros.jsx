import React from "react";

const ProduccionFiltros = ({ busqueda, setBusqueda, material, setMaterial, estado, setEstado }) => {
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

      <select value={material} onChange={(e) => setMaterial(e.target.value)}>
        <option value="TODOS">Todos los materiales</option>
        <option value="ORO">Oro</option>
        <option value="POLIMETALICO">Material polimetálico</option>
      </select>

      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="TODOS">Todos los estados</option>
        <option value="VIGENTE">Vigente</option>
        <option value="ANULADA">Anulada</option>
      </select>
    </div>
  );
};

export default ProduccionFiltros;
