import { useNavigate, useParams } from "react-router-dom";

import DocumentoAdjunto from "../../components/DocumentoAdjunto.jsx";
import HistorialEstados from "../../components/HistorialEstados.jsx";
import { formatearFecha } from "../../data/insumosVinculos.js";
import {
  ventasVisibles as ventas,
  fechaUltimoEstado,
  etiquetaEstadoVenta,
} from "../../data/ventasMock.js";
import Permiso from "../../components/Permiso.jsx";

export default function ConsultarVenta() {
  const navigate = useNavigate();
  const { id } = useParams();

  const venta = ventas.find(
    (item) => item.id_venta === Number(id)
  );

  const obtenerClaseEstado = (estadoVenta) => {
    switch (estadoVenta) {
      case "REGISTRADA":
        return "estado-venta-registrada";

      case "DESPACHADA":
        return "estado-venta-despachada";

      case "ENTREGADA":
        return "estado-venta-entregada";

      case "ANULADA":
        return "estado-venta-anulada";

      default:
        return "";
    }
  };

  const formatearPrecio = (precio) => {
    const numero = Number(precio);

    if (Number.isNaN(numero)) {
      return precio;
    }

    return new Intl.NumberFormat("es-CO").format(numero);
  };

  if (!venta) {
    return (
      <div className="ventas-page">

        <div className="ventas-header">

          <div>
            <h1>
              Consultar venta
            </h1>
          </div>

        </div>

        <div className="sin-ventas">

          <h3>
            Venta no encontrada
          </h3>

          <p>
            No fue posible encontrar la información solicitada.
          </p>

        </div>

        <div className="consulta-acciones-venta">

          <button
            type="button"
            className="btn-volver-venta"
            onClick={() => navigate("/ventas")}
          >
            Volver
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="ventas-page">

      <div className="ventas-header">

        <div>

          <h1>
            Consultar venta
          </h1>

        </div>

        <div className="produccion-header-acciones">
          <HistorialEstados
            titulo={`Historial de la venta #${venta.id_venta}`}
            historial={venta.historial || []}
            etiqueta={etiquetaEstadoVenta}
          />

          <button
          type="button"
          className="btn-volver-venta"
          onClick={() => navigate("/ventas")}
        >
          Volver
          </button>
        </div>

      </div>

      <div className="venta-form">

        {/* =========================================
            INFORMACIÓN DE VENTA
        ========================================= */}

        <section className="form-seccion">

          <div className="form-seccion-titulo">

            <h2>
              Información de la venta
            </h2>

            <p>
              Datos registrados de la operación comercial.
            </p>

          </div>

          <div className="venta-card-body">

            <div className="dato-venta">
              <span>
                Cliente
              </span>

              <strong>
                {venta.cliente}
              </strong>
            </div>

            <div className="dato-venta">
              <span>
                Pedido
              </span>

              <strong>
                {venta.pedido}
              </strong>
            </div>

            <div className="dato-venta">
              <span>
                Tipo de material
              </span>

              <strong>
                {venta.tipo_material}
              </strong>
            </div>

            <Permiso dato="cantidades"><div className="dato-venta">
              <span>
                Cantidad
              </span>

              <strong>
                {venta.cantidad}
              </strong>
            </div></Permiso>

            {venta.tipo_material === "Arenas polimetálicas" && venta.ley && (
              <Permiso dato="cantidades"><div className="dato-venta">
                <span>
                  Ley (g/t)
                </span>

                <strong>
                  {venta.ley}
                </strong>
              </div></Permiso>
            )}

            <Permiso dato="precios"><div className="dato-venta">
              <span>
                Precio
              </span>

              <strong>
                {formatearPrecio(venta.precio)}{" "}
                {venta.moneda}
              </strong>
            </div></Permiso>

            <div className="dato-venta">
              <span>
                Moneda
              </span>

              <strong>
                {venta.moneda}
              </strong>
            </div>

            <div className="dato-venta">
              <span>
                Fecha
              </span>

              <strong>
                {venta.fecha}
              </strong>
            </div>

            <div className="dato-venta">
              <span>
                País destino
              </span>

              <strong>
                {venta.pais_destino}
              </strong>
            </div>

            <div className="dato-venta">
              <span>
                Acopio de origen
              </span>

              <strong>
                {venta.acopio || "No registrado"}
              </strong>
            </div>

            <div className="dato-venta">
              <span>
                Mina de origen
              </span>

              <strong>
                {venta.mina || "No registrada"}
              </strong>
            </div>

            <div className="dato-venta">
              <span>
                Fecha del último estado
              </span>

              <strong>
                {formatearFecha(fechaUltimoEstado(venta))}
              </strong>
            </div>

            <div className="dato-venta">
              <span>
                Estado
              </span>

              <strong>
                <span
                  className={`estado-venta ${obtenerClaseEstado(
                    venta.estado
                  )}`}
                >
                  {venta.estado}
                </span>
              </strong>
            </div>

          </div>

        </section>

        {/* =========================================
            TRANSPORTE
        ========================================= */}

        <section className="form-seccion">

          <div className="form-seccion-titulo">

            <h2>
              Información de transporte
            </h2>

            <p>
              Información relacionada con el transporte de la venta.
            </p>

          </div>

          <div className="venta-card-body">

            <div className="dato-venta">

              <span>
                Encargado de transporte
              </span>

              <strong>
                {venta.encargado_transporte || "Pendiente de registrar"}
              </strong>

            </div>

            <div className="dato-venta">

              <span>
                Placa del vehículo
              </span>

              <strong>
                {venta.placa_vehiculo || "Pendiente de registrar"}
              </strong>

            </div>

            <div className="dato-venta">

              <span>
                Dirección del puerto
              </span>

              <strong>
                {venta.direccion_puerto || "No registrada"}
              </strong>

            </div>

            <div className="dato-venta">

              <span>
                Cliente que recibe
              </span>

              <strong>
                {venta.contacto_entrega_nombre || "No registrado"}
              </strong>

            </div>

            <div className="dato-venta">

              <span>
                Teléfono de entrega
              </span>

              <strong>
                {venta.contacto_entrega_telefono || "No registrado"}
              </strong>

            </div>

          </div>

        </section>

        {/* =========================================
            DOCUMENTOS LEGALES
        ========================================= */}

        <section className="form-seccion">

          <div className="form-seccion-titulo">

            <h2>
              Documentos legales de la venta
            </h2>

            <p>
              Documentación asociada a la operación comercial.
            </p>

          </div>

          <div className="venta-documentos-consulta">

            <div className="dato-venta">

              <span>
                Estado documental
              </span>

              <strong
                className={
                  venta.documentos
                    ? "documentos-completos"
                    : "documentos-pendientes"
                }
              >
                {venta.documentos
                  ? "Documentos registrados"
                  : "Documentos pendientes"}
              </strong>

            </div>

          </div>

          <div className="documentos-unificados-grid">
              <DocumentoAdjunto
                titulo="Factura"
                name="factura"
                value={venta.factura}
                disabled
              />

              <DocumentoAdjunto
                titulo="Resultado de laboratorio"
                name="resultado_laboratorio"
                value={venta.resultado_laboratorio}
                disabled
              />
            </div>

        </section>

      </div>

    </div>
  );
}
