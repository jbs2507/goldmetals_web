import { etiquetaTipoDocumento } from "../clientes/tiposDocumento.js";
import React from "react";
import BotonEliminar from "../BotonEliminar";
import DocumentosCargados from "../DocumentosCargados.jsx";
import Permiso from "../Permiso.jsx";

const ProveedorCard = ({
  proveedor,
  onConsultar,
  onEditar,
  onEliminar,
}) => {
  const tipoPersona =
    proveedor.tipo_persona === "JURIDICA"
      ? "Persona jurídica"
      : "Persona natural";

  return (
    <div className="proveedor-card">

      <div className="proveedor-card-header">
        <div>
          <span className="proveedor-label">
            Proveedor
          </span>

          <h3>
            {proveedor.razon_social}
          </h3>
        </div>

        <span
          className={`estado-proveedor estado-proveedor-${proveedor.estado.toLowerCase()}`}
        >
          {proveedor.estado}
        </span>
      </div>

      <div className="proveedor-card-body">

        <div className="dato-proveedor">
          <span>
            Tipo de persona
          </span>

          <strong>
            {tipoPersona}
          </strong>
        </div>

        <div className="dato-proveedor">
          <span>
            Tipo de documento
          </span>

          <strong>
            {etiquetaTipoDocumento(proveedor.tipo_documento)}
          </strong>
        </div>

        <div className="dato-proveedor">
          <span>
            {proveedor.tipo_documento === "NIT" ? "Número de NIT" : "Número de documento"}
          </span>

          <strong>
            {proveedor.numero_documento}
          </strong>
        </div>

        <div className="dato-proveedor">
          <span>
            Estado
          </span>

          <strong>
            {proveedor.estado}
          </strong>
        </div>

      </div>

      <div className="proveedor-card-actions">

        <button
          type="button"
          className="btn-consultar-proveedor"
          onClick={() => onConsultar(proveedor)}
        >
          Consultar
        </button>

        <DocumentosCargados
          titulo={`Documentos de ${proveedor.razon_social}`}
          documentos={[
            { titulo: "Cámara de Comercio", valor: proveedor.camaraComercio },
            { titulo: "RUT", valor: proveedor.rut },
            { titulo: "RUCOM", valor: proveedor.certificadoRucom },
          ]}
        />

        <Permiso accion="editar"><button
          type="button"
          className="btn-editar-proveedor"
          onClick={() => onEditar(proveedor)}
        >
          Editar
        </button></Permiso>

        <BotonEliminar
          entidad="proveedor"
          nombre={proveedor.razon_social}
          onConfirmar={() => onEliminar(proveedor)}
        />

      </div>

    </div>
  );
};

export default ProveedorCard;