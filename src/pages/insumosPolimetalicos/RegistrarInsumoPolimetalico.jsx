import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import InsumoPolimetalicoForm from "../../components/insumosPolimetalicos/InsumoPolimetalicoForm.jsx";
import InsumosPolimetalicos from "./InsumosPolimetalicos.jsx";
import { agregarRegistro, leerLista, siguienteId } from "../../utils/almacen.js";
import { CLAVES, INSUMOS_POLI_SEMILLA } from "../../data/semillas.js";

// El registro es una ventana emergente sobre la lista de insumos polimetálicos.
export default function RegistrarInsumoPolimetalico() {
  const navigate = useNavigate();
  const cerrar = () => navigate("/insumos-polimetalicos");

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
      <InsumosPolimetalicos />
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
