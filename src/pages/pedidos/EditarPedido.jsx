import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatearFecha } from "../../data/insumosVinculos.js";
import {
  pedidosMock,
  codigoPedido,
  estadosSiguientesPedido,
  etiquetaEstadoPedido,
} from "../../data/pedidosMock.js";
import { conEstado } from "../../utils/listados.js";

const formatearValor = (valor, moneda) =>
  `$ ${Number(valor).toLocaleString(moneda === "USD" ? "en-US" : "es-CO", {
    minimumFractionDigits: moneda === "USD" ? 2 : 0,
    maximumFractionDigits: moneda === "USD" ? 2 : 0,
  })}`;

// En un pedido solo se puede cambiar el estado; el resto de datos queda bloqueado.
export default function EditarPedido() {
  const navigate = useNavigate();
  const { id } = useParams();

  const pedido = pedidosMock.find((p) => p.id_pedido === Number(id));
  const siguientes = pedido ? estadosSiguientesPedido(pedido.estado) : [];
  const [nuevoEstado, setNuevoEstado] = useState(pedido?.estado || "");

  if (!pedido) {
    return (
      <div className="pedidos-page">
        <div className="sin-pedidos">
          <h3>Pedido no encontrado</h3>
          <p>El pedido solicitado no existe.</p>
          <button className="btn-volver-pedido" onClick={() => navigate("/pedidos")}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  const opciones = [pedido.estado, ...siguientes];
  const sinCambios = nuevoEstado === pedido.estado;

  const guardar = (e) => {
    e.preventDefault();
    if (sinCambios) return;
    // Prototipo sin backend: se actualiza el pedido de ejemplo para que el listado lo refleje.
    Object.assign(pedido, conEstado(pedido, nuevoEstado));
    navigate("/pedidos");
  };

  return (
    <div className="pedidos-page">
      <div className="pedidos-header">
        <div>
          <h1>Editar pedido</h1>
        </div>

        <button className="btn-volver-pedido" onClick={() => navigate("/pedidos")}>
          Volver
        </button>
      </div>

      <form className="pedido-form" onSubmit={guardar}>
        <section className="form-seccion">
          <div className="form-seccion-titulo">
            <h2>{codigoPedido(pedido.id_pedido)}</h2>
            <p>Datos del pedido (no se pueden modificar)</p>
          </div>

          <div className="pedido-detalle-grid">
            <div className="dato-pedido">
              <span>Cliente</span>
              <strong>{pedido.cliente}</strong>
            </div>
            <div className="dato-pedido">
              <span>Acopio</span>
              <strong>{pedido.acopio}</strong>
            </div>
            <div className="dato-pedido">
              <span>Fecha del pedido</span>
              <strong>{formatearFecha(pedido.fecha_pedido)}</strong>
            </div>
            <div className="dato-pedido">
              <span>Fecha del estado actual</span>
              <strong>{formatearFecha(pedido.fecha_estado || pedido.fecha_pedido)}</strong>
            </div>
            <div className="dato-pedido">
              <span>Valor total</span>
              <strong>{formatearValor(pedido.valor_total, pedido.moneda)}</strong>
            </div>
            <div className="dato-pedido">
              <span>Valor pagado</span>
              <strong>{formatearValor(pedido.valor_pagado, pedido.moneda)}</strong>
            </div>
          </div>
        </section>

        <section className="form-seccion">
          <div className="form-seccion-titulo">
            <h2>Estado del pedido</h2>
            <p>El estado solo puede avanzar. Al guardar se registra la fecha de hoy.</p>
          </div>

          <div className="form-grid">
            <div className="form-campo">
              <label htmlFor="estado_pedido">Estado</label>
              <select
                id="estado_pedido"
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                disabled={siguientes.length === 0}
              >
                {opciones.map((estado) => (
                  <option key={estado} value={estado}>
                    {etiquetaEstadoPedido(estado)}
                  </option>
                ))}
              </select>
              {siguientes.length === 0 && (
                <small>Este pedido ya está en su último estado.</small>
              )}
            </div>
          </div>
        </section>

        <div className="form-acciones-pedido">
          <button type="button" className="btn-cancelar-pedido" onClick={() => navigate("/pedidos")}>
            Cancelar
          </button>
          <button type="submit" className="btn-guardar-pedido" disabled={sinCambios}>
            Guardar estado
          </button>
        </div>
      </form>
    </div>
  );
}
