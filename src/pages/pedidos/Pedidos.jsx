import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonEliminar from "../../components/BotonEliminar";

const pedidosIniciales = [
  {
    id_pedido: 1,
    cliente: "M&M Trading S.A.S.",
    acopio: "Acopio Chocó",
    fecha_pedido: "2026-09-20",
    estado: "ABIERTO",
    moneda: "COP",
    tasa_cambio: null,
    valor_total: 125000000,
    valor_pagado: 112500000,
    porcentaje_pago_inicial: 0.9,
  },
  {
    id_pedido: 2,
    cliente: "Global Metals International",
    acopio: "Acopio Bolívar",
    fecha_pedido: "2026-09-18",
    estado: "EN_PRODUCCION",
    moneda: "USD",
    tasa_cambio: 4200,
    valor_total: 28500,
    valor_pagado: 25650,
    porcentaje_pago_inicial: 0.9,
  },
  {
    id_pedido: 3,
    cliente: "M&M Trading S.A.S.",
    acopio: "Acopio Chocó",
    fecha_pedido: "2026-09-15",
    estado: "LISTO",
    moneda: "COP",
    tasa_cambio: null,
    valor_total: 85000000,
    valor_pagado: 76500000,
    porcentaje_pago_inicial: 0.9,
  },
];

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

  const eliminarPedido = (id) => {
    setPedidos((actuales) =>
      actuales.filter((p) => p.id_pedido !== id)
    );
  };

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

  return (
    <div className="pedidos-page">

      <div className="pedidos-header">
        <div>
          <h1>Pedidos</h1>
          <p>Gestión de pedidos registrados</p>
        </div>

        <button
          className="btn-registrar-pedido"
          onClick={() => navigate("/pedidos/registrar")}
        >
          + Registrar pedido
        </button>
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
          <option value="CANCELADO">Cancelado</option>
        </select>

      </div>

      {/* RESUMEN */}

      <div className="pedidos-resumen">

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

      </div>

      {/* LISTA */}

      <div className="pedidos-lista">

        {pedidosFiltrados.length === 0 ? (
          <div className="sin-pedidos">
            <h3>No se encontraron pedidos</h3>
            <p>
              Intenta cambiar los filtros de búsqueda.
            </p>
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => (
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
                  <strong>{pedido.fecha_pedido}</strong>
                </div>

                <div className="dato-pedido">
                  <span>Moneda</span>
                  <strong>{pedido.moneda}</strong>
                </div>

                <div className="dato-pedido">
                  <span>Tasa de cambio</span>
                  <strong>
                    {pedido.tasa_cambio
                      ? pedido.tasa_cambio
                      : "No aplica"}
                  </strong>
                </div>

                <div className="dato-pedido">
                  <span>Valor total</span>
                  <strong>
                    {formatearValor(
                      pedido.valor_total,
                      pedido.moneda
                    )}
                  </strong>
                </div>

                <div className="dato-pedido">
                  <span>Valor pagado</span>
                  <strong>
                    {formatearValor(
                      pedido.valor_pagado,
                      pedido.moneda
                    )}
                  </strong>
                </div>

                <div className="dato-pedido">
                  <span>Pago inicial</span>
                  <strong>
                    {(
                      pedido.porcentaje_pago_inicial * 100
                    ).toFixed(0)}
                    %
                  </strong>
                </div>

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

                <button
                  className="btn-editar-pedido"
                  onClick={() =>
                    navigate(
                      `/pedidos/editar/${pedido.id_pedido}`
                    )
                  }
                >
                  Editar
                </button>

                <BotonEliminar
                  entidad="pedido"
                  nombre={`el pedido #${pedido.id_pedido} de ${pedido.cliente}`}
                  onConfirmar={() => eliminarPedido(pedido.id_pedido)}
                />

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}