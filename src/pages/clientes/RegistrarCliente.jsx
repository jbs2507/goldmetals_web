import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import Clientes from "./Clientes.jsx";
import ClienteForm from "../../components/clientes/ClienteForm.jsx";
import { agregarRegistro, leerLista, sinArchivos, siguienteId } from "../../utils/almacen.js";
import { CLAVES, CLIENTES_SEMILLA } from "../../data/semillas.js";

export default function RegistrarCliente() {
  const navigate = useNavigate();

  const handleGuardar = (datos) => {
    const lista = leerLista(CLAVES.clientes, CLIENTES_SEMILLA);
    agregarRegistro(CLAVES.clientes, CLIENTES_SEMILLA, {
      ...sinArchivos(datos),
      id_cliente: siguienteId(lista, "id_cliente"),
      estado: datos.estado || "ACTIVO",
    });

    navigate("/clientes");
  };

  // El registro es una ventana emergente sobre la lista.
  return (
    <>
      <Clientes />
      <Modal
        titulo="Registrar cliente"
        subtitulo="Completa la información y los documentos legales del cliente"
        ancho={1040}
        onCerrar={() => navigate("/clientes")}
      >
        <ClienteForm
          onGuardar={handleGuardar}
          onCancelar={() => navigate("/clientes")}
        />
      </Modal>
    </>
  );
}