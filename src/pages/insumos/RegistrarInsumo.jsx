import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import InsumoPolimetalicoForm from "../../components/insumosPolimetalicos/InsumoPolimetalicoForm.jsx";
import Insumos from "./Insumos.jsx";
import { agregarRegistro, leerLista, siguienteId } from "../../utils/almacen.js";
import { CLAVES, INSUMOS_POLI_SEMILLA } from "../../data/semillas.js";

// Solo se registran manualmente los insumos polimetálicos.
// El oro aumenta con las compras y disminuye con las ventas.
// El registro es una ventana emergente sobre la lista de insumos.
export default function RegistrarInsumo() {
  const navigate = useNavigate();
  const cerrar = () => navigate("/insumos");

  const guardarInsumo = (datos) => {
    const lista = leerLista(CLAVES.insumosPoli, INSUMOS_POLI_SEMILLA);
    agregarRegistro(CLAVES.insumosPoli, INSUMOS_POLI_SEMILLA, {
      ...datos,
      id_insumo: siguienteId(lista, "id_insumo"),
      tipo_insumo: "POLIMETALICO",
    });
    cerrar();
  };

  return (
    <>
      <Insumos />
      <Modal
        titulo="Registrar insumo polimetálico"
        subtitulo="Ingresa los datos del material polimetálico"
        onCerrar={cerrar}
      >
        <InsumoPolimetalicoForm modo="registrar" onGuardar={guardarInsumo} onCancelar={cerrar} />
      </Modal>
    </>
  );
}
