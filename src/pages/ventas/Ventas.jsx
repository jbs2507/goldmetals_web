import BotonAnular from "../../components/BotonAnular.jsx";
import { conEstado } from "../../utils/listados.js";
import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VentaFiltros from "../../components/ventas/VentaFiltros.jsx";

import HistorialEstados from "../../components/HistorialEstados.jsx";
import DocumentosCargados from "../../components/DocumentosCargados.jsx";
import { formatearFecha } from "../../data/insumosVinculos.js";
import {
  ventasVisibles as ventasIniciales,
  fechaUltimoEstado,
  etiquetaEstadoVenta,
  totalesPorMoneda,
  formatoDinero,
} from "../../data/ventasMock.js";
import Permiso from "../../components/Permiso.jsx";

export default function Ventas() {
  const navigate = useNavigate();

  const [ventas, setVentas] = useState(ventasIniciales);

  const [busqueda, setBusqueda] = useState("");

  const [estado, setEstado] = useState("TODOS");

  const ventasFiltradas = ventas.filter((venta) => {
    const texto = busqueda.toLowerCase().trim();

    const coincideBusqueda =
      venta.cliente.toLowerCase().includes(texto) ||
      venta.pedido.toLowerCase().includes(texto) ||
      venta.tipo_material.toLowerCase().includes(texto) ||
      venta.pais_destino.toLowerCase().includes(texto) ||
      (venta.acopio || "").toLowerCase().includes(texto) ||
      (venta.mina || "").toLowerCase().includes(texto) ||
      (venta.direccion_puerto || "").toLowerCase().includes(texto) ||
      (venta.contacto_entrega_nombre || "").toLowerCase().includes(texto);

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

  const anuladas = ventas.filter(
    (venta) => venta.estado === "ANULADA"
  ).length;

  // Dinero total de las ventas vigentes (las anuladas no suman).
  const totales = totalesPorMoneda(ventas);
  const textoTotalDinero =
    Object.keys(totales).length > 0
      ? Object.entries(totales).map(([m, v]) => formatoDinero(v, m)).join(" + ")
      : formatoDinero(0);

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

  const anularVenta = (id, motivo) =>
    setVentas((a) => a.map((x) => (x.id_venta === id ? conEstado(x, "ANULADA", motivo) : x)));

  const pag = usePaginacion(ventasFiltradas);

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

        <Permiso accion="crear"><button
          type="button"
          className="btn-registrar-venta"
          onClick={() => navigate("/ventas/registrar")}
        >
          + Registrar venta
        </button></Permiso>

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

      <Permiso dato="estadisticas"><div className="ventas-resumen">

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
            Total dinero en ventas
          </span>

          <strong className="resumen-dinero">
            {textoTotalDinero}
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
            Ventas anuladas
          </span>

          <strong>
            {anuladas}
          </strong>
        </div>

      </div></Permiso>

      {/* =========================================
          LISTA
      ========================================= */}

      <div className="ventas-lista">

        <BarraListado pag={pag} archivo="ventas" />

        {ventasFiltradas.length > 0 ? (

          pag.items.map((venta) => (

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

                <Permiso dato="cantidades"><div className="dato-venta">
                  <span>
                    Cantidad
                  </span>

                  <strong>
                    {venta.cantidad}
                  </strong>
                </div></Permiso>

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
                    {venta.encargado_transporte || "Pendiente de registrar"}
                  </strong>
                </div>

                <div className="dato-venta">
                  <span>
                    Placa vehículo
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

                <DocumentosCargados
                  titulo={`Documentos de la venta #${venta.id_venta}`}
                  documentos={[
                    { titulo: "Factura", valor: venta.factura },
                    { titulo: "Resultado de laboratorio", valor: venta.resultado_laboratorio },
                  ]}
                />

                <HistorialEstados
                  titulo={`Historial de la venta #${venta.id_venta}`}
                  historial={venta.historial || []}
                  etiqueta={etiquetaEstadoVenta}
                />

                <BotonAnular entidad="venta" nombre={`la venta ${venta.pedido} de ${venta.cliente}`} deshabilitado={venta.estado === "ANULADA"} onConfirmar={(m) => anularVenta(venta.id_venta, m)} />

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


      <Paginador pag={pag} />
    </div>
  );
}