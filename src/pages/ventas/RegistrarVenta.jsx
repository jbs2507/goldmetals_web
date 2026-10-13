import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import Ventas from "./Ventas.jsx";
import VentaForm from "../../components/ventas/VentaForm.jsx";
import { agregarRegistro, hoyISO, leerLista, siguienteId } from "../../utils/almacen.js";
import { CLAVES } from "../../data/semillas.js";
import { construirVenta, ventasMock } from "../../data/ventasMock.js";

export default function RegistrarVenta() {
  const navigate = useNavigate();

  const manejarRegistro = (datos) => {
    const lista = leerLista(CLAVES.ventas, ventasMock);
    agregarRegistro(CLAVES.ventas, ventasMock, {
      ...construirVenta(datos),
      id_venta: siguienteId(lista, "id_venta"),
      estado: "REGISTRADA",
      historial: [{ estado: "REGISTRADA", fecha: hoyISO(), motivo: "" }],
    });

    navigate("/ventas");
  };

  // El registro es una ventana emergente sobre la lista.
  return (
    <>
      <Ventas />
      <Modal
        titulo="Registrar venta"
        subtitulo="Completa los datos de la venta"
        ancho={1040}
        onCerrar={() => navigate("/ventas")}
      >
        <VentaForm
          onSubmit={manejarRegistro}
          onCancel={() => navigate("/ventas")}
        />
      </Modal>
    </>
  );
}