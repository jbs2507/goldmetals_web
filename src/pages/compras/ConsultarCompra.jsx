import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DocumentoAdjunto from "../../components/DocumentoAdjunto.jsx";
import Permiso from "../../components/Permiso.jsx";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES, COMPRAS_SEMILLA } from "../../data/semillas.js";
import { formatearFecha } from "../../data/insumosVinculos.js";

const ConsultarCompra = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [compras] = useAlmacen(CLAVES.compras, COMPRAS_SEMILLA);
  const compra = compras.find((c) => c.id === id);

  if (!compra) {
    return (
      <div className="compras-page">
        <div className="sin-compras">
          <h3>Compra no encontrada</h3>
          <p>No fue posible encontrar la información solicitada.</p>
          <button type="button" className="btn-volver-compra" onClick={() => navigate("/compras")}>
            ← Volver
          </button>
        </div>
      </div>
    );
  }

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

      <div className="compra-form">

      {/* INFORMACIÓN GENERAL */}
      <section className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Información de la compra #{compra.id}</h2>
          <p>Datos registrados de la compra.</p>
        </div>

        <div className="consulta-grid">

          <div className="consulta-dato">
            <span>Estado</span>
            <strong>
              <span className={`estado estado-${compra.estado.toLowerCase()}`}>
                {compra.estado}
              </span>
            </strong>
          </div>

          <div className="consulta-dato">
            <span>Fecha de compra</span>
            <strong>{formatearFecha(compra.fechaCompra)}</strong>
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
      </section>

      {/* DETALLE */}
      <section className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Detalle de la compra</h2>
          <p>Insumo, cantidades y valores.</p>
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
      </section>

      {/* DOCUMENTOS */}
      <section className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Documentos de la compra</h2>
          <p>Documentos cargados. Puedes verlos o descargarlos.</p>
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
      </section>

      </div>

    </div>
  );
};

export default ConsultarCompra;