import { useNavigate, useParams } from "react-router-dom";

const ventas = [
  {
    id_venta: 1,
    cliente: "M&M Trading S.A.S.",
    pedido: "PED-001",
    tipo_material: "Oro en lingote",
    cantidad: "500 g",
    precio: "120000000",
    moneda: "COP",
    fecha: "2026-09-20",
    pais_destino: "India",
    encargado_transporte: "Carlos Gómez",
    placa_vehiculo: "ABC123",
    estado: "REGISTRADA",
    documentos: true,
    pago_completo: false,
    produccion_lista: false,
  },
  {
    id_venta: 2,
    cliente: "Global Metals International",
    pedido: "PED-002",
    tipo_material: "Arena procesada",
    cantidad: "1.000 kg",
    precio: "85000000",
    moneda: "COP",
    fecha: "2026-09-18",
    pais_destino: "China",
    encargado_transporte: "Juan Rodríguez",
    placa_vehiculo: "XYZ789",
    estado: "DESPACHADA",
    documentos: true,
    pago_completo: false,
    produccion_lista: false,
  },
  {
    id_venta: 3,
    cliente: "Global Metals International",
    pedido: "PED-003",
    tipo_material: "Oro en lingote",
    cantidad: "250 g",
    precio: "62000000",
    moneda: "COP",
    fecha: "2026-09-15",
    pais_destino: "Estados Unidos",
    encargado_transporte: "Laura Pérez",
    placa_vehiculo: "DEF456",
    estado: "CANCELADA",
    documentos: false,
    pago_completo: false,
    produccion_lista: false,
  },
];

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

      case "CANCELADA":
        return "estado-venta-cancelada";

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

            <p>
              Información de la venta.
            </p>
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

          <p>
            Consulta la información registrada de la venta.
          </p>

        </div>

        <button
          type="button"
          className="btn-volver-venta"
          onClick={() => navigate("/ventas")}
        >
          Volver
        </button>

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

            <div className="dato-venta">
              <span>
                Cantidad
              </span>

              <strong>
                {venta.cantidad}
              </strong>
            </div>

            <div className="dato-venta">
              <span>
                Precio
              </span>

              <strong>
                {formatearPrecio(venta.precio)}{" "}
                {venta.moneda}
              </strong>
            </div>

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
                {venta.pago_completo && venta.produccion_lista ? (venta.encargado_transporte || "Pendiente de registrar") : "Pendiente: completar pago y producción"}
              </strong>

            </div>

            <div className="dato-venta">

              <span>
                Placa del vehículo
              </span>

              <strong>
                {venta.pago_completo && venta.produccion_lista ? (venta.placa_vehiculo || "Pendiente de registrar") : "Pendiente: completar pago y producción"}
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

        </section>

        {/* =========================================
            ACCIONES
        ========================================= */}

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

    </div>
  );
}
