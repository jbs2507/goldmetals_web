import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import EmpleadoForm from "../../components/empleados/EmpleadoForm.jsx";
import Empleados from "./Empleados.jsx";
import { agregarRegistro, leerLista, siguienteId } from "../../utils/almacen.js";
import { CLAVES, EMPLEADOS_SEMILLA } from "../../data/semillas.js";

// El registro es una ventana emergente sobre la lista de empleados.
export default function RegistrarEmpleado() {
  const navigate = useNavigate();

  const volverEmpleados = () => {
    navigate("/empleados", { replace: true });
  };

  const manejarRegistro = (datos) => {
    const lista = leerLista(CLAVES.empleados, EMPLEADOS_SEMILLA);
    agregarRegistro(CLAVES.empleados, EMPLEADOS_SEMILLA, {
      ...datos,
      id_empleado: siguienteId(lista, "id_empleado"),
      fecha_finalizacion: datos.fecha_finalizacion || null,
      estado: datos.estado || "ACTIVO",
    });
    volverEmpleados();
  };

  return (
    <>
      <Empleados />
      <Modal
        titulo="Registrar empleado"
        subtitulo="Completa los datos correspondientes al empleado"
        ancho={760}
        onCerrar={volverEmpleados}
      >
        <EmpleadoForm onSubmit={manejarRegistro} onCancel={volverEmpleados} />
      </Modal>
    </>
  );
}
