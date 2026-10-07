import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonAnular from "../../components/BotonAnular.jsx";
import { conEstado } from "../../utils/listados.js";
import HistorialEstados from "../../components/HistorialEstados.jsx";
import { formatearFecha } from "../../data/insumosVinculos.js";
import {
  pedidosMock as pedidosIniciales,
  codigoPedido,
  etiquetaEstadoPedido,
  pagoCompletoPedido,
} from "../../data/pedidosMock.js";
import Permiso from "../../components/Permiso.jsx";
import { puedeVerDato } from "../../permisos.js";

// Columnas del Excel: lo mismo que se ve en pantalla, con fechas y valores legibles.
const columnasExcel = [
  { titulo: "Pedido", valor: (p) => codigoPedido(p.id_pedido) },
  { titulo: "Cliente", valor: (p) => p.cliente },
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

  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("TODOS");

  const anularPedido = (id, motivo) =>
    setPedidos((a) => a.map((p) => (p.id_pedido === id ? conEstado(p, "ANULADO", motivo) : p)));

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      pedido.cliente.toLowerCase().includes(texto) ||
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

        {pedidosFiltrados.length === 0 ? (
          <div className="sin-pedidos">
            <h3>No se encontraron pedidos</h3>
            <p>
              Intenta cambiar los filtros de búsqueda.
            </p>
          </div>
        ) : (
          pag.items.map((pedido) => (
            <div
              className="pedido-card"
              key={pedido.id_pedido}
            >

              <div className="pedido-card-header">

                <div>
                  <span className="pedido-label">
                    Cliente
                  </span>

                  <h2>{pedido.cliente}</h2>
                </div>

                <span
                  className={`estado-pedido estado-${pedido.estado.toLowerCase()}`}
                >
                  {formatearEstado(pedido.estado)}
                </span>

              </div>

              <div className="pedido-card-body">

                <div className="dato-pedido">
                  <span>Acopio</span>
                  <strong>{pedido.acopio}</strong>
                </div>

                <div className="dato-pedido">
                  <span>Fecha del pedido</span>
                  <strong>{formatearFecha(pedido.fecha_pedido)}</strong>
                </div>

                <div className="dato-pedido">
                  <span>Estado</span>
                  <strong>{formatearEstado(pedido.estado)}</strong>
                </div>

                <div className="dato-pedido">
                  <span>Fecha del estado</span>
                  <strong>{formatearFecha(pedido.fecha_estado || pedido.fecha_pedido)}</strong>
                </div>

                <div className="dato-pedido">
                  <span>Moneda</span>
                  <strong>{pedido.moneda}</strong>
                </div>

                <Permiso dato="precios"><div className="dato-pedido">
                  <span>Tasa de cambio</span>
                  <strong>
                    {pedido.tasa_cambio
                      ? pedido.tasa_cambio
                      : "No aplica"}
                  </strong>
                </div></Permiso>

                <Permiso dato="precios"><div className="dato-pedido">
                  <span>Valor total</span>
                  <strong>
                    {formatearValor(
                      pedido.valor_total,
                      pedido.moneda
                    )}
                  </strong>
                </div></Permiso>

                <Permiso dato="precios"><div className="dato-pedido">
                  <span>Valor pagado</span>
                  <strong>
                    {formatearValor(
                      pedido.valor_pagado,
                      pedido.moneda
                    )}
                  </strong>
                </div></Permiso>

              </div>

              <div className="pedido-card-actions">

                <button
                  className="btn-consultar-pedido"
                  onClick={() =>
                    navigate(
                      `/pedidos/consultar/${pedido.id_pedido}`
                    )
                  }
                >
                  Consultar
                </button>

                <Permiso accion="editar"><button
                  className="btn-editar-pedido"
                  disabled={pedido.estado === "ANULADO"}
                  onClick={() =>
                    navigate(
                      `/pedidos/editar/${pedido.id_pedido}`
                    )
                  }
                >
                  Editar
                </button></Permiso>

                <HistorialEstados
                  titulo={`Historial del pedido #${pedido.id_pedido}`}
                  historial={pedido.historial || []}
                  etiqueta={etiquetaEstadoPedido}
                />

                <BotonAnular entidad="pedido" nombre={`el pedido #${pedido.id_pedido} de ${pedido.cliente}`} deshabilitado={pedido.estado === "ANULADO"} onConfirmar={(m) => anularPedido(pedido.id_pedido, m)} />

              </div>

            </div>
          ))
        )}

      </div>


      <Paginador pag={pag} />
    </div>
  );
}