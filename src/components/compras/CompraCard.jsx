import React from "react";

const CompraCard = ({
  compra,
  onConsultar,
  onEditar,
}) => {
  return (
    <div className="compra-card">

      <div className="compra-card-header">
        <div>
          <span className="compra-label">
            Compra
          </span>

          <h3>
            #{compra.id}
          </h3>
        </div>

        <span
          className={`estado estado-${compra.estado.toLowerCase()}`}
        >
          {compra.estado}
        </span>
      </div>

      <div className="compra-card-body">

        <div className="dato-compra">
          <span>Fecha de compra</span>
          <strong>
            {compra.fecha}
          </strong>
        </div>

        <div className="dato-compra">
          <span>Proveedor asociado</span>
          <strong>
            {compra.proveedor}
          </strong>
        </div>

        <div className="dato-compra">
          <span>Acopio</span>
          <strong>
            {compra.acopio}
          </strong>
        </div>

        <div className="dato-compra">
          <span>Moneda</span>
          <strong>
            {compra.moneda}
          </strong>
        </div>

        <div className="dato-compra">
          <span>Valor total</span>
          <strong>
            {compra.valorTotal}
          </strong>
        </div>

      </div>

      <div className="compra-card-actions">

        <button
          type="button"
          className="btn-consultar"
          onClick={() => onConsultar(compra)}
        >
          Consultar
        </button>

        <button
          type="button"
          className="btn-editar"
          onClick={() => onEditar(compra)}
        >
          Editar
        </button>

      </div>

    </div>
  );
};

export default CompraCard;