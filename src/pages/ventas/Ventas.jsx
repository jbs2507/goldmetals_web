import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VentaFiltros from "../../components/ventas/VentaFiltros.jsx";

const ventasIniciales = [
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

export default function Ventas() {
  const navigate = useNavigate();

  const [ventas] = useState(ventasIniciales);

  const [busqueda, setBusqueda] = useState("");

  const [estado, setEstado] = useState("TODOS");

  const ventasFiltradas = ventas.filter((venta) => {
    const texto = busqueda.toLowerCase().trim();

    const coincideBusqueda =
      venta.cliente.toLowerCase().includes(texto) ||
      venta.pedido.toLowerCase().includes(texto) ||
      venta.tipo_material.toLowerCase().includes(texto) ||
      venta.pais_destino.toLowerCase().includes(texto);

    const coincideEstado =
      estado === "TODOS" ||
      venta.estado === estado;

    return coincideBusqueda && coincideEstado;
  });

  const registradas = ventas.filter(
    (venta) => venta.estado === "REGISTRADA"
  ).length;

  const despachadas = ventas.filter(
    (venta) => venta.estado === "DESPACHADA"
  ).length;

  const entregadas = ventas.filter(
    (venta) => venta.estado === "ENTREGADA"
  ).length;

  const canceladas = ventas.filter(
    (venta) => venta.estado === "CANCELADA"
  ).length;

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

  return (
    <div className="ventas-page">

      {/* =========================================
          ENCABEZADO
      ========================================= */}

      <div className="ventas-header">

        <div>
          <h1>
            Ventas
          </h1>

          <p>
            Consulta y administra las ventas realizadas.
          </p>
        </div>

        <button
          type="button"
          className="btn-registrar-venta"
          onClick={() => navigate("/ventas/registrar")}
        >
          + Registrar venta
        </button>

      </div>

      {/* =========================================
          FILTROS
      ========================================= */}

      <VentaFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        estado={estado}
        setEstado={setEstado}
      />

      {/* =========================================
          RESUMEN
      ========================================= */}

      <div className="ventas-resumen">

        <div className="resumen-venta-item">
          <span>
            Total ventas
          </span>

          <strong>
            {ventas.length}
          </strong>
        </div>

        <div className="resumen-venta-item">
          <span>
            Ventas registradas
          </span>

          <strong>
            {registradas}
          </strong>
        </div>

        <div className="resumen-venta-item">
          <span>
            Ventas despachadas
          </span>

          <strong>
            {despachadas}
          </strong>
        </div>

        <div className="resumen-venta-item">
          <span>
            Ventas entregadas
          </span>

          <strong>
            {entregadas}
          </strong>
        </div>

        <div className="resumen-venta-item">
          <span>
            Ventas canceladas
          </span>

          <strong>
            {canceladas}
          </strong>
        </div>

      </div>

      {/* =========================================
          LISTA
      ========================================= */}

      <div className="ventas-lista">

        {ventasFiltradas.length > 0 ? (

          ventasFiltradas.map((venta) => (

            <div
              className="venta-card"
              key={venta.id_venta}
            >

              {/* =====================================
                  CABECERA
              ===================================== */}

              <div className="venta-card-header">

                <div>

                  <span className="venta-label">
                    Venta
                  </span>

                  <h3>
                    {venta.tipo_material}
                  </h3>

                </div>

                <span
                  className={`estado-venta ${obtenerClaseEstado(
                    venta.estado
                  )}`}
                >
                  {venta.estado}
                </span>

              </div>

              {/* =====================================
                  DATOS
              ===================================== */}

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
                    Encargado transporte
                  </span>

                  <strong>
                    {venta.pago_completo && venta.produccion_lista
                      ? (venta.encargado_transporte || "Pendiente de registrar")
                      : "Pendiente: completar pago y producción"}
                  </strong>
                </div>

                <div className="dato-venta">
                  <span>
                    Placa vehículo
                  </span>

                  <strong>
                    {venta.pago_completo && venta.produccion_lista
                      ? (venta.placa_vehiculo || "Pendiente de registrar")
                      : "Pendiente: completar pago y producción"}
                  </strong>
                </div>

              </div>

              {/* =====================================
                  DOCUMENTOS LEGALES
              ===================================== */}

              <div className="venta-documentos">

                <span className="venta-label">
                  Documentos legales
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

              {/* =====================================
                  ACCIONES
              ===================================== */}

              <div className="venta-card-actions">

                <button
                  type="button"
                  className="btn-consultar-venta"
                  onClick={() =>
                    navigate(
                      `/ventas/consultar/${venta.id_venta}`
                    )
                  }
                >
                  Consultar
                </button>

                <button
                  type="button"
                  className="btn-editar-venta"
                  onClick={() =>
                    navigate(
                      `/ventas/editar/${venta.id_venta}`
                    )
                  }
                >
                  Editar
                </button>

              </div>

            </div>

          ))

        ) : (

          <div className="sin-ventas">

            <h3>
              No se encontraron ventas
            </h3>

            <p>
              Intenta cambiar los criterios de búsqueda.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}