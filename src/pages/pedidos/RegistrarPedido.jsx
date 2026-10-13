import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import Pedidos from "./Pedidos.jsx";
import PedidoForm from "../../components/pedidos/PedidoForm.jsx";
import { agregarRegistro, guardarLista, leerLista, siguienteId } from "../../utils/almacen.js";
import { CLAVES, CLIENTES_SEMILLA } from "../../data/semillas.js";
import { construirPedido, pedidosMock, produccionesDePedido } from "../../data/pedidosMock.js";
import { produccionesMock } from "../../data/produccionesMock.js";

export default function RegistrarPedido() {
  const navigate = useNavigate();

  const guardarPedido = (datos) => {
    const clientes = leerLista(CLAVES.clientes, CLIENTES_SEMILLA);
    const pedidos = leerLista(CLAVES.pedidos, pedidosMock);
    const pedido = {
      ...construirPedido(datos, clientes),
      id_pedido: siguienteId(pedidos, "id_pedido"),
    };
    agregarRegistro(CLAVES.pedidos, pedidosMock, pedido);

    // La producción se crea automáticamente al generarse el pedido (estado PENDIENTE).
    const producciones = leerLista(CLAVES.producciones, produccionesMock);
    guardarLista(CLAVES.producciones, [...producciones, ...produccionesDePedido(pedido, producciones)]);

    navigate("/pedidos");
  };

  // El registro es una ventana emergente sobre la lista.
  return (
    <>
      <Pedidos />
      <Modal
        titulo="Registrar pedido"
        subtitulo="Completa los datos, el detalle y los pagos del pedido"
        ancho={1040}
        onCerrar={() => navigate("/pedidos")}
      >
        <PedidoForm
          modo="registrar"
          onGuardar={guardarPedido}
          onCancelar={() => navigate("/pedidos")}
        />
      </Modal>
    </>
  );
}