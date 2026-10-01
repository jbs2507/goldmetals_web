import { useNavigate, useParams } from "react-router-dom";
import PedidoForm from "../../components/pedidos/PedidoForm.jsx";

const pedidoInicial = {
  id_pedido: 1,
  id_cliente: 1,
  id_acopio: 1,
  fecha_pedido: "2026-09-20T10:00",
    fecha_entrega: "2026-10-20T10:00",
  estado: "ABIERTO",
  moneda: "COP",
  tasa_cambio: "",
  valor_total: 125000000,
  valor_pagado: 112500000,
  porcentaje_pago_inicial: 0.9,

  detalles: [
    {
      id_insumo: 1,
      cantidad: 500,
      precio_unitario: 250000,
      valor_total: 125000000,
    },
  ],

  pagos: [
    {
      fecha_pago: "2026-09-20",
      valor: 112500000,
      cuenta_bancaria: "BANCOLOMBIA",
      comprobante: null,
    },
  ],
};

export default function EditarPedido() {
  const navigate = useNavigate();
  const { id } = useParams();

  console.log("Editando pedido:", id);

  const actualizarPedido = (datos) => {
    console.log("Pedido actualizado:", datos);
    navigate("/pedidos");
  };

  return (
    <div className="pedidos-page">

      <div className="pedidos-header">
        <div>
          <h1>Editar pedido</h1>
          <p>Actualiza la información del pedido</p>
        </div>

        <button
          className="btn-volver-pedido"
          onClick={() => navigate("/pedidos")}
        >
          Volver
        </button>
      </div>

      <PedidoForm
        modo="editar"
        datosIniciales={pedidoInicial}
        onGuardar={actualizarPedido}
        onCancelar={() => navigate("/pedidos")}
      />

    </div>
  );
}