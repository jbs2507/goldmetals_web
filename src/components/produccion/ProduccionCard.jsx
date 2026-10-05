import React from "react";
import BotonAnular from "../BotonAnular.jsx";
import HistorialProduccion from "./HistorialProduccion.jsx";
import { etiquetaEstadoProduccion, formatoMonto } from "../../data/produccionesMock.js";
import Permiso from "../Permiso.jsx";

const ProduccionCard = ({
  produccion,
  onConsultar,
  onAnular,
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

        {produccion.estado && (
          <span className={`estado-produccion estado-produccion-${produccion.estado.toLowerCase()}`}>
            {etiquetaEstadoProduccion(produccion.estado)}
          </span>
        )}
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

        <Permiso dato="cantidades"><div className="dato-produccion">
          <span>Cantidad</span>
          <strong>
            {produccion.cantidad}
          </strong>
        </div></Permiso>

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

        <Permiso dato="precios"><div className="dato-produccion">
          <span>Monto</span>
          <strong>{formatoMonto(produccion.monto)}</strong>
        </div></Permiso>
      </div>

      <div className="produccion-card-actions">
        <button
          type="button"
          className="btn-consultar-produccion"
          onClick={() => onConsultar(produccion)}
        >
          Consultar
        </button>

        <HistorialProduccion produccion={produccion} />

        <BotonAnular
          entidad="registro de producción"
          nombre={`${produccion.insumo} (${produccion.fecha})`}
          deshabilitado={produccion.estado === "ANULADA"}
          onConfirmar={(m) => onAnular(produccion, m)}
        />
      </div>
    </div>
  );
};

export default ProduccionCard;