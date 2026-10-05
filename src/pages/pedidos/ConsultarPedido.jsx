import { useNavigate, useParams } from "react-router-dom";
import Permiso from "../../components/Permiso.jsx";

const pedidos = [
  {
    id_pedido: 1,
    cliente: "M&M Trading S.A.S.",
    acopio: "Acopio Chocó",
    fecha_pedido: "2026-09-20T10:00",
    fecha_entrega: "2026-10-20T10:00",
    estado: "ABIERTO",
    fecha_estado: "2026-09-20",
    moneda: "COP",
    tasa_cambio: "",
    valor_total: 125000000,
    valor_pagado: 112500000,
    detalles: [
      {
        producto: "Oro en lingote",
        detalle_producto: "Lingotes de 995 milésimas, empaque sellado",
        insumo: "Oro",
        cantidad: 500,
        precio_unitario: 250000,
        valor_total: 125000000,
      },
    ],
    pagos: [
      {
        fecha_pago: "2026-09-20",
        cuenta_bancaria: "BANCOLOMBIA",
        comprobante: null,
      },
    ],
  },
];

const formatearValor = (valor, moneda) => {
  if (moneda === "USD") {
    return `$ ${Number(valor).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `$ ${Number(valor).toLocaleString("es-CO")}`;
};

export default function ConsultarPedido() {
  const navigate = useNavigate();
  const { id } = useParams();

  const pedido = pedidos.find(
    (item) => item.id_pedido === Number(id)
  );

  if (!pedido) {
    return (
      <div className="pedidos-page">

        <div className="sin-pedidos">
          <h3>Pedido no encontrado</h3>
          <p>El pedido solicitado no existe.</p>

          <button
            className="btn-volver-pedido"
            onClick={() => navigate("/pedidos")}
          >
            Volver
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="pedidos-page">

      <div className="pedidos-header">
        <div>
          <h1>Consultar pedido</h1>
          <p>Información detallada del pedido</p>
        </div>

        <button
          className="btn-volver-pedido"
          onClick={() => navigate("/pedidos")}
        >
          Volver
        </button>
      </div>

      <div className="pedido-form">

        <section className="form-seccion">

          <div className="form-seccion-titulo">
            <h2>Información del pedido</h2>
            <p>Datos principales del pedido registrado</p>
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
              <strong>{pedido.fecha_pedido}</strong>
            </div>

            <div className="dato-pedido">
              <span>Fecha de entrega</span>
              <strong>{pedido.fecha_entrega}</strong>
            </div>

            <div className="dato-pedido">
              <span>Estado</span>
              <strong>{pedido.estado}</strong>
            </div>

            <div className="dato-pedido">
              <span>Fecha del estado</span>
              <strong>{pedido.fecha_estado || pedido.fecha_pedido}</strong>
            </div>

            <div className="dato-pedido">
              <span>Moneda</span>
              <strong>{pedido.moneda}</strong>
            </div>

            <Permiso dato="precios"><div className="dato-pedido">
              <span>Tasa de cambio</span>
              <strong>
                {pedido.tasa_cambio || "No aplica"}
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
              <span>Valor pagado (pago inicial 90 %)</span>
              <strong>
                {formatearValor(
                  pedido.valor_pagado,
                  pedido.moneda
                )}
              </strong>
            </div></Permiso>

            <Permiso dato="precios"><div className="dato-pedido">
              <span>Saldo pendiente (10 %)</span>
              <strong>
                {formatearValor(
                  pedido.valor_total - pedido.valor_pagado,
                  pedido.moneda
                )}
              </strong>
            </div></Permiso>

          </div>

        </section>

        <section className="form-seccion">

          <div className="form-seccion-titulo">
            <h2>Detalle del pedido</h2>
            <p>Insumos incluidos en el pedido</p>
          </div>

          <div className="pedido-detalles-lista">

            {pedido.detalles.map((detalle, index) => (
              <div
                className="pedido-detalle-item"
                key={index}
              >
                <div>
                  <span>Producto</span>
                  <strong>{detalle.producto}</strong>
                </div>

                <div>
                  <span>Detalle del producto</span>
                  <strong>{detalle.detalle_producto}</strong>
                </div>

                <div>
                  <span>Insumo</span>
                  <strong>{detalle.insumo}</strong>
                </div>

                <Permiso dato="cantidades"><div>
                  <span>Cantidad</span>
                  <strong>{detalle.cantidad}</strong>
                </div></Permiso>

                <Permiso dato="precios"><div>
                  <span>Precio unitario</span>
                  <strong>
                    {formatearValor(
                      detalle.precio_unitario,
                      pedido.moneda
                    )}
                  </strong>
                </div></Permiso>

                <Permiso dato="precios"><div>
                  <span>Valor total</span>
                  <strong>
                    {formatearValor(
                      detalle.valor_total,
                      pedido.moneda
                    )}
                  </strong>
                </div></Permiso>
              </div>
            ))}

          </div>

        </section>

        <Permiso dato="precios"><section className="form-seccion">

          <div className="form-seccion-titulo">
            <h2>Pagos del pedido</h2>
            <p>Registro de pagos realizados</p>
          </div>

          <div className="pedido-detalles-lista">

            {pedido.pagos.map((pago, index) => (
              <div
                className="pedido-detalle-item pedido-pago-consulta"
                key={index}
              >
                <div>
                  <span>Fecha de pago</span>
                  <strong>{pago.fecha_pago}</strong>
                </div>

                <div>
                  <span>Cuenta bancaria</span>
                  <strong>
                    {pago.cuenta_bancaria || "No registrada"}
                  </strong>
                </div>

                <div>
                  <span>Comprobante</span>
                  <strong>
                    {pago.comprobante ? "Adjunto" : "No adjunto"}
                  </strong>
                </div>
              </div>
            ))}

          </div>

        </section></Permiso>

        <div className="consulta-acciones-pedido">
          <button
            className="btn-volver-pedido"
            onClick={() => navigate("/pedidos")}
          >
            Volver a pedidos
          </button>
        </div>

      </div>

    </div>
  );
}