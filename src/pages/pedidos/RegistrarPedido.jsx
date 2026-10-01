import { useNavigate } from "react-router-dom";
import PedidoForm from "../../components/pedidos/PedidoForm.jsx";

export default function RegistrarPedido() {
  const navigate = useNavigate();

  const guardarPedido = (datos) => {
    console.log("Pedido registrado:", datos);
    navigate("/pedidos");
  };

  return (
    <div className="pedidos-page">

      <div className="pedidos-header">
        <div>
          <h1>Registrar pedido</h1>
          <p>Registra la información del nuevo pedido</p>
        </div>

        <button
          className="btn-volver-pedido"
          onClick={() => navigate("/pedidos")}
        >
          Volver
        </button>
      </div>

      <PedidoForm
        modo="registrar"
        onGuardar={guardarPedido}
        onCancelar={() => navigate("/pedidos")}
      />

    </div>
  );
}