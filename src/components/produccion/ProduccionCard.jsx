import React from "react";
import BotonEliminar from "../BotonEliminar";

const ProduccionCard = ({
  produccion,
  onConsultar,
  onEditar,
  onEliminar,
}) => {
  return (
    <div className="produccion-card">
      <div className="produccion-card-header">
        <div>
          <span className="produccion-label">
            Producción
          </span>

          <h3>
            Registro de producción
          </h3>
        </div>
      </div>

      <div className="produccion-card-body">
        <div className="dato-produccion">
          <span>Fecha</span>
          <strong>
            {produccion.fecha}
          </strong>
        </div>

        <div className="dato-produccion">
          <span>Insumo / material</span>
          <strong>
            {produccion.insumo}
          </strong>
        </div>

        <div className="dato-produccion">
          <span>Cantidad</span>
          <strong>
            {produccion.cantidad}
          </strong>
        </div>

        <div className="dato-produccion">
          <span>Cliente</span>
          <strong>{produccion.cliente}</strong>
        </div>

        <div className="dato-produccion">
          <span>Pedido</span>
          <strong>{produccion.pedido}</strong>
        </div>

        <div className="dato-produccion">
          <span>Mina</span>
          <strong>{produccion.mina}</strong>
        </div>
      </div>

      <div className="produccion-card-actions">
        <button
          type="button"
          className="btn-consultar-produccion"
          onClick={() => onConsultar(produccion)}
        >
          Consultar
        </button>

        <button
          type="button"
          className="btn-editar-produccion"
          onClick={() => onEditar(produccion)}
        >
          Editar
        </button>

        <BotonEliminar
          entidad="registro de producción"
          nombre={`${produccion.insumo} (${produccion.fecha})`}
          onConfirmar={() => onEliminar(produccion)}
        />
      </div>
    </div>
  );
};

export default ProduccionCard;