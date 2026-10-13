import { useNavigate, useParams } from "react-router-dom";
import Permiso from "../../components/Permiso.jsx";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES } from "../../data/semillas.js";
import { pedidosMock } from "../../data/pedidosMock.js";

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
  const [pedidos] = useAlmacen(CLAVES.pedidos, pedidosMock);

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
              <span>Mina de origen</span>
              <strong>{pedido.mina || "—"}</strong>
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

      </div>

    </div>
  );
}