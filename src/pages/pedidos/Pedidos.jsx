import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonAnular from "../../components/BotonAnular.jsx";
import { conEstado } from "../../utils/listados.js";
import HistorialEstados from "../../components/HistorialEstados.jsx";
import { formatearFecha } from "../../data/insumosVinculos.js";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES } from "../../data/semillas.js";
import {
  pedidosMock,
  codigoPedido,
  etiquetaEstadoPedido,
  pagoCompletoPedido,
} from "../../data/pedidosMock.js";
import Permiso from "../../components/Permiso.jsx";
import { puedeVerDato } from "../../permisos.js";
import Tabla, { BotonIcono, Doble } from "../../components/Tabla.jsx";

// Columnas del Excel: lo mismo que se ve en pantalla, con fechas y valores legibles.
const columnasExcel = [
  { titulo: "Pedido", valor: (p) => codigoPedido(p.id_pedido) },
  { titulo: "Cliente", valor: (p) => p.cliente },
  { titulo: "Mina", valor: (p) => p.mina || "" },
  { titulo: "Acopio", valor: (p) => p.acopio },
  { titulo: "Fecha del pedido", valor: (p) => formatearFecha(p.fecha_pedido) },
  { titulo: "Estado", valor: (p) => etiquetaEstadoPedido(p.estado) },
  { titulo: "Fecha del estado", valor: (p) => formatearFecha(p.fecha_estado || p.fecha_pedido) },
  { titulo: "Moneda", valor: (p) => p.moneda },
  { titulo: "Tasa de cambio", valor: (p) => p.tasa_cambio || "No aplica" },
  { titulo: "Valor total", valor: (p) => Number(p.valor_total) },
  { titulo: "Valor pagado", valor: (p) => Number(p.valor_pagado) },
  { titulo: "Saldo pendiente", valor: (p) => Number(p.valor_total) - Number(p.valor_pagado) },
  { titulo: "Pago completo", valor: (p) => (pagoCompletoPedido(p) ? "Sí" : "No") },
];

const COLUMNAS_PRECIO = ["Tasa de cambio", "Valor total", "Valor pagado", "Saldo pendiente", "Pago completo"];

const formatearValor = (valor, moneda) => {
  if (moneda === "USD") {
    return `$ ${Number(valor).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `$ ${Number(valor).toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const formatearEstado = (estado) => {
  if (estado === "EN_PRODUCCION") {
    return "EN PRODUCCIÓN";
  }

  return estado.replaceAll("_", " ");
};

export default function Pedidos() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useAlmacen(CLAVES.pedidos, pedidosMock);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("TODOS");

  const anularPedido = (id, motivo) =>
    setPedidos((a) => a.map((p) => (p.id_pedido === id ? conEstado(p, "ANULADO", motivo) : p)));

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      pedido.cliente.toLowerCase().includes(texto) ||
      (pedido.mina || "").toLowerCase().includes(texto) ||
      pedido.acopio.toLowerCase().includes(texto) ||
      pedido.moneda.toLowerCase().includes(texto);

    const coincideEstado =
      estado === "TODOS" || pedido.estado === estado;

    return coincideBusqueda && coincideEstado;
  });

  const totalPedidos = pedidos.length;

  const pedidosAbiertos = pedidos.filter(
    (pedido) => pedido.estado === "ABIERTO"
  ).length;

  const pedidosProduccion = pedidos.filter(
    (pedido) => pedido.estado === "EN_PRODUCCION"
  ).length;

  const pag = usePaginacion(pedidosFiltrados);

  return (
    <div className="pedidos-page">

      <div className="pedidos-header">
        <div>
          <h1>Pedidos</h1>
        </div>

        <Permiso accion="crear"><button
          className="btn-registrar-pedido"
          onClick={() => navigate("/pedidos/registrar")}
        >
          + Registrar pedido
        </button></Permiso>
      </div>

      {/* BARRA DE BÚSQUEDA Y ESTADO */}

      <div className="pedidos-filtros">

        <div className="campo-busqueda-pedido">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar por cliente, acopio o moneda"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

        </div>

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="TODOS">Todos los estados</option>
          <option value="ABIERTO">Abierto</option>
          <option value="EN_PRODUCCION">
            En producción
          </option>
          <option value="LISTO">Listo</option>
          <option value="ENTREGADO">Entregado</option>
          <option value="ANULADO">Anulado</option>
        </select>

      </div>

      {/* RESUMEN */}

      <Permiso dato="estadisticas"><div className="pedidos-resumen">

        <div className="resumen-pedido-item">
          <span>Total pedidos</span>
          <strong>{totalPedidos}</strong>
        </div>

        <div className="resumen-pedido-item">
          <span>Abiertos</span>
          <strong>{pedidosAbiertos}</strong>
        </div>

        <div className="resumen-pedido-item">
          <span>En producción</span>
          <strong>{pedidosProduccion}</strong>
        </div>

      </div></Permiso>

      {/* LISTA */}

      <div className="pedidos-lista">

        <BarraListado pag={pag} archivo="pedidos" excel columnas={puedeVerDato("precios") ? columnasExcel : columnasExcel.filter((c) => !COLUMNAS_PRECIO.includes(c.titulo))} />

        <Tabla
          filas={pag.items}
          clave={(p) => p.id_pedido}
          claseFila={(p) => (p.estado === "ANULADO" ? "fila-anulada" : "")}
          vacio={
            <div className="sin-pedidos">
              <h3>No se encontraron pedidos</h3>
              <p>Intenta cambiar los filtros de búsqueda.</p>
            </div>
          }
          columnas={[
            { titulo: "Cliente", render: (p) => <Doble principal={p.cliente} secundario={p.acopio} /> },
            { titulo: "Fecha del pedido", sinSalto: true, render: (p) => formatearFecha(p.fecha_pedido) },
            {
              titulo: "Estado",
              render: (p) => (
                <span className={`estado-pedido estado-${p.estado.toLowerCase()}`}>{formatearEstado(p.estado)}</span>
              ),
            },
            {
              titulo: "Valor total",
              dato: "precios",
              alinear: "der",
              sinSalto: true,
              render: (p) => formatearValor(p.valor_total, p.moneda),
            },
            {
              titulo: "Valor pagado",
              dato: "precios",
              alinear: "der",
              sinSalto: true,
              render: (p) => formatearValor(p.valor_pagado, p.moneda),
            },
          ]}
          acciones={(p) => (
            <>
              <BotonIcono
                icono="ver"
                titulo="Consultar"
                onClick={() => navigate(`/pedidos/consultar/${p.id_pedido}`)}
              />
              <Permiso accion="editar">
                <BotonIcono
                  icono="editar"
                  titulo="Editar"
                  tono="dorado"
                  deshabilitado={p.estado === "ANULADO"}
                  onClick={() => navigate(`/pedidos/editar/${p.id_pedido}`)}
                />
              </Permiso>
              <HistorialEstados
                icono
                titulo={`Historial del pedido #${p.id_pedido}`}
                historial={p.historial || []}
                etiqueta={etiquetaEstadoPedido}
              />
              <BotonAnular
                icono
                entidad="pedido"
                nombre={`el pedido #${p.id_pedido} de ${p.cliente}`}
                deshabilitado={p.estado === "ANULADO"}
                onConfirmar={(m) => anularPedido(p.id_pedido, m)}
              />
            </>
          )}
        />
      </div>

      <Paginador pag={pag} />
    </div>
  );
}