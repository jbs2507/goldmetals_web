import BotonAnular from "../BotonAnular.jsx";
import React from "react";
import DocumentosCargados from "../DocumentosCargados.jsx";
import Permiso from "../Permiso.jsx";

const CompraCard = ({
  compra,
  onConsultar,
  onAnular,
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

        <Permiso dato="precios"><div className="dato-compra">
          <span>Valor total</span>
          <strong>
            {compra.valorTotal}
          </strong>
        </div></Permiso>

      </div>

      <div className="compra-card-actions">

        <button
          type="button"
          className="btn-consultar"
          onClick={() => onConsultar(compra)}
        >
          Consultar
        </button>

        <DocumentosCargados
          titulo={`Documentos de la compra #${compra.id}`}
          documentos={[
            { titulo: "Certificado de origen", valor: compra.certificadoOrigen },
            { titulo: "Resultado de laboratorio", valor: compra.resultadoLaboratorio },
            { titulo: "Factura", valor: compra.factura },
          ]}
        />

        <BotonAnular entidad="compra" nombre={`la compra #${compra.id}`} deshabilitado={compra.estado === "ANULADA"} onConfirmar={(m) => onAnular(compra, m)} />

      </div>

    </div>
  );
};

export default CompraCard;