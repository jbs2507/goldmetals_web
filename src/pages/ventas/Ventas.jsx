import BotonAnular from "../../components/BotonAnular.jsx";
import { conEstado } from "../../utils/listados.js";
import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VentaFiltros from "../../components/ventas/VentaFiltros.jsx";

import HistorialEstados from "../../components/HistorialEstados.jsx";
import DocumentosCargados from "../../components/DocumentosCargados.jsx";
import { formatearFecha } from "../../data/insumosVinculos.js";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES } from "../../data/semillas.js";
import {
  ventasMock,
  ventaVisible,
  fechaUltimoEstado,
  etiquetaEstadoVenta,
  totalesPorMoneda,
  formatoDinero,
} from "../../data/ventasMock.js";
import Permiso from "../../components/Permiso.jsx";
import { puedeVerDato } from "../../permisos.js";
import Tabla, { BotonIcono, Doble } from "../../components/Tabla.jsx";

// Columnas del Excel: lo mismo que se ve en pantalla, con fechas y valores legibles.
const columnasExcel = [
  { titulo: "Venta", valor: (v) => v.id_venta },
  { titulo: "Origen", valor: (v) => (v.origen === "DIRECTA" ? "Venta directa" : "Pedido") },
  { titulo: "Cliente", valor: (v) => v.cliente },
  { titulo: "Pedido", valor: (v) => v.pedido },
  { titulo: "Material", valor: (v) => v.tipo_material },
  { titulo: "Cantidad", valor: (v) => v.cantidad },
  { titulo: "Ley", valor: (v) => v.ley ?? "" },
  { titulo: "Precio", valor: (v) => Number(v.precio) },
  { titulo: "Moneda", valor: (v) => v.moneda },
  { titulo: "Fecha", valor: (v) => formatearFecha(v.fecha) },
  { titulo: "Estado", valor: (v) => etiquetaEstadoVenta(v.estado) },
  { titulo: "Fecha del estado", valor: (v) => formatearFecha(fechaUltimoEstado(v)) },
  { titulo: "País de destino", valor: (v) => v.pais_destino },
  { titulo: "Puerto de entrega", valor: (v) => v.direccion_puerto },
  { titulo: "Contacto de entrega", valor: (v) => v.contacto_entrega_nombre },
  { titulo: "Teléfono de contacto", valor: (v) => v.contacto_entrega_telefono },
  { titulo: "Encargado del transporte", valor: (v) => v.encargado_transporte },
  { titulo: "Placa del vehículo", valor: (v) => v.placa_vehiculo },
  { titulo: "Acopio", valor: (v) => v.acopio },
  { titulo: "Mina", valor: (v) => v.mina },
];

const COLUMNAS_PRECIO = ["Precio", "Moneda"];
const COLUMNAS_CANTIDAD = ["Cantidad", "Ley"];

const filtrarColumnasExcel = () =>
  columnasExcel.filter(
    (c) =>
      (!COLUMNAS_PRECIO.includes(c.titulo) || puedeVerDato("precios")) &&
      (!COLUMNAS_CANTIDAD.includes(c.titulo) || puedeVerDato("cantidades"))
  );

export default function Ventas() {
  const navigate = useNavigate();

  // Las ventas se leen del almacén; solo se muestran las de pedidos pagados al 100 %.
  const [todasLasVentas, setVentas] = useAlmacen(CLAVES.ventas, ventasMock);
  const ventas = todasLasVentas.filter(ventaVisible);

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

        <BarraListado pag={pag} archivo="ventas" excel columnas={filtrarColumnasExcel()} />

        <Tabla
          filas={pag.items}
          clave={(v) => v.id_venta}
          claseFila={(v) => (v.estado === "ANULADA" ? "fila-anulada" : "")}
          vacio={
            <div className="sin-ventas">
              <h3>No se encontraron ventas</h3>
              <p>Intenta cambiar los criterios de búsqueda.</p>
            </div>
          }
          columnas={[
            { titulo: "Pedido", fuerte: true, sinSalto: true, render: (v) => v.pedido },
            { titulo: "Cliente", render: (v) => <Doble principal={v.cliente} secundario={v.tipo_material} /> },
            { titulo: "Cantidad", dato: "cantidades", sinSalto: true, render: (v) => v.cantidad },
            {
              titulo: "Precio",
              dato: "precios",
              alinear: "der",
              sinSalto: true,
              render: (v) => (
                <>
                  {formatearPrecio(v.precio)}
                  <span className="tabla-moneda">{v.moneda}</span>
                </>
              ),
            },
            { titulo: "Fecha", sinSalto: true, render: (v) => v.fecha },
            { titulo: "País destino", render: (v) => v.pais_destino },
            {
              titulo: "Estado",
              render: (v) => (
                <span className={`estado-venta ${obtenerClaseEstado(v.estado)}`}>{v.estado}</span>
              ),
            },
          ]}
          acciones={(v) => (
            <>
              <BotonIcono
                icono="ver"
                titulo="Consultar"
                onClick={() => navigate(`/ventas/consultar/${v.id_venta}`)}
              />
              <DocumentosCargados
                icono
                titulo={`Documentos de la venta #${v.id_venta}`}
                documentos={[
                  { titulo: "Factura", valor: v.factura },
                  { titulo: "Resultado de laboratorio", valor: v.resultado_laboratorio },
                ]}
              />
              <HistorialEstados
                icono
                titulo={`Historial de la venta #${v.id_venta}`}
                historial={v.historial || []}
                etiqueta={etiquetaEstadoVenta}
              />
              <BotonAnular
                icono
                entidad="venta"
                nombre={`la venta ${v.pedido} de ${v.cliente}`}
                deshabilitado={v.estado === "ANULADA"}
                onConfirmar={(m) => anularVenta(v.id_venta, m)}
              />
            </>
          )}
        />
      </div>

      <Paginador pag={pag} />
    </div>
  );
}