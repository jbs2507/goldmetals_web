import { useNavigate, useParams } from "react-router-dom";
import EmpleadoForm from "../../components/empleados/EmpleadoForm.jsx";
import { actualizarRegistro, useAlmacen } from "../../utils/almacen.js";
import { CLAVES, EMPLEADOS_SEMILLA } from "../../data/semillas.js";

export default function EditarEmpleado() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [empleados] = useAlmacen(CLAVES.empleados, EMPLEADOS_SEMILLA);

  const empleado = empleados.find(
    (item) => item.id_empleado === Number(id)
  );

  if (!empleado) {
    return (
      <div className="empleados-page">

        <div className="empleados-header">
          <div>
            <h1>Editar empleado</h1>
          </div>
        </div>

        <div className="sin-empleados">
          <h3>Empleado no encontrado</h3>
          <p>
            No fue posible encontrar la información solicitada.
          </p>
        </div>

        <div className="consulta-acciones-empleado">
          <button
            className="btn-volver-empleado"
            onClick={() => navigate("/empleados")}
          >
            Volver
          </button>
        </div>

      </div>
    );
  }

  const manejarActualizacion = (datos) => {
    actualizarRegistro(CLAVES.empleados, EMPLEADOS_SEMILLA, "id_empleado", empleado.id_empleado, {
      ...datos,
      fecha_finalizacion: datos.fecha_finalizacion || null,
    });

    navigate("/empleados");
  };

  return (
    <div className="empleados-page">

      <div className="empleados-header">
        <div>
          <h1>Editar empleado</h1>
        </div>

        <button
          type="button"
          className="btn-volver-empleado"
          onClick={() => navigate("/empleados")}
        >
          Volver
        </button>
      </div>

      <EmpleadoForm
        datosIniciales={empleado}
        onSubmit={manejarActualizacion}
        onCancel={() => navigate("/empleados")}
        modoEdicion
      />

    </div>
  );
}