import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DocumentoAdjunto from "../../components/DocumentoAdjunto.jsx";
import Permiso from "../../components/Permiso.jsx";

const ConsultarCompra = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Datos temporales del frontend
  const compra = {
    id: id,
    proveedor: "Proveedor asociado 1",
    acopio: "Acopio principal",
    fechaCompra: "23/09/2026",
    moneda: "COP",
    tasaCambio: "1",
    insumo: "Oro",
    peso: "500",
    ley: "90",
    precioUnitario: "10000",
    valorRegalias: "500000",
    valorTotal: "5500000",
    estado: "REGISTRADA",
    certificadoOrigen: "certificado_origen.pdf",
    resultadoLaboratorio: "resultado_laboratorio.pdf",
    factura: "factura.pdf",
  };

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: compra.moneda,
      maximumFractionDigits: 2,
    }).format(Number(valor) || 0);
  };

  return (
    <div className="compras-page">

      {/* ENCABEZADO */}
      <div className="compras-header">
        <div>
          <h1>
            Consultar compra #{compra.id}
          </h1>
        </div>

        <button
          type="button"
          className="btn-volver-compra"
          onClick={() => navigate("/compras")}
        >
          ← Volver
        </button>
      </div>

      {/* INFORMACIÓN GENERAL */}
      <div className="consulta-compra-card">
        <div className="consulta-titulo">
          <div>
            <span>Compra</span>
            <h2>#{compra.id}</h2>
          </div>

          <span
            className={`estado estado-${compra.estado.toLowerCase()}`}
          >
            {compra.estado}
          </span>
        </div>

        <div className="consulta-grid">

          <div className="consulta-dato">
            <span>Fecha de compra</span>
            <strong>{compra.fechaCompra}</strong>
          </div>

          <div className="consulta-dato">
            <span>Proveedor asociado</span>
            <strong>{compra.proveedor}</strong>
          </div>

          <div className="consulta-dato">
            <span>Acopio</span>
            <strong>{compra.acopio}</strong>
          </div>

          <div className="consulta-dato">
            <span>Moneda</span>
            <strong>{compra.moneda}</strong>
          </div>

          <Permiso dato="precios"><div className="consulta-dato">
            <span>Tasa de cambio</span>
            <strong>{compra.tasaCambio}</strong>
          </div></Permiso>

        </div>
      </div>

      {/* DETALLE */}
      <div className="consulta-compra-card">
        <div className="consulta-seccion-titulo">
          <h2>Detalle de la compra</h2>
        </div>

        <div className="consulta-grid">

          <div className="consulta-dato">
            <span>Insumo</span>
            <strong>{compra.insumo}</strong>
          </div>

          <Permiso dato="cantidades"><div className="consulta-dato">
            <span>Peso</span>
            <strong>{compra.peso} g</strong>
          </div></Permiso>

          <Permiso dato="cantidades"><div className="consulta-dato">
            <span>Ley</span>
            <strong>{compra.ley}</strong>
          </div></Permiso>

          <Permiso dato="precios"><div className="consulta-dato">
            <span>Precio unitario</span>
            <strong>
              {formatoMoneda(compra.precioUnitario)}
            </strong>
          </div></Permiso>

          <Permiso dato="precios"><div className="consulta-dato">
            <span>Valor de regalías</span>
            <strong>
              {formatoMoneda(compra.valorRegalias)}
            </strong>
          </div></Permiso>

          <Permiso dato="precios"><div className="consulta-dato consulta-total">
            <span>Valor total</span>
            <strong>
              {formatoMoneda(compra.valorTotal)}
            </strong>
          </div></Permiso>

        </div>
      </div>

      {/* DOCUMENTOS */}
      <div className="consulta-compra-card">
        <div className="consulta-seccion-titulo">
          <h2>Documentos de la compra</h2>
        </div>

        <div className="documentos-unificados-grid">
          <DocumentoAdjunto
            titulo="Certificado de origen"
            name="certificadoOrigen"
            value={compra.certificadoOrigen}
            disabled
          />

          <DocumentoAdjunto
            titulo="Resultado de laboratorio"
            name="resultadoLaboratorio"
            value={compra.resultadoLaboratorio}
            disabled
          />

          <DocumentoAdjunto
            titulo="Factura"
            name="factura"
            value={compra.factura}
            disabled
          />
        </div>
      </div>

    </div>
  );
};

export default ConsultarCompra;