import { useNavigate } from "react-router-dom";
import PedidoForm from "../../components/pedidos/PedidoForm.jsx";

export default function RegistrarPedido() {
  const navigate = useNavigate();

  const guardarPedido = (datos) => {
    console.log("Pedido registrado:", datos);
    // La producción se crea automáticamente al generarse el pedido.
    console.log("Producción creada automáticamente para el pedido (estado PENDIENTE).");
    alert("Pedido registrado. La producción se creó automáticamente.");
    navigate("/pedidos");
  };

  return (
    <div className="pedidos-page">

      <div className="pedidos-header">
        <div>
          <h1>Registrar pedido</h1>
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