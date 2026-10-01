import { useNavigate, useParams } from "react-router-dom";
import EmpleadoForm from "../../components/empleados/EmpleadoForm.jsx";

const empleados = [
  {
    id_empleado: 1,
    nombre_completo: "Carlos Andrés Gómez",
    cargo: "Administrador",
    numero_documento: "1032456789",
    telefono: "3001234567",
    estado: "ACTIVO",
  },
  {
    id_empleado: 2,
    nombre_completo: "Laura Marcela Pérez",
    cargo: "Analista de compras",
    numero_documento: "1012456788",
    telefono: "3019876543",
    estado: "ACTIVO",
  },
  {
    id_empleado: 3,
    nombre_completo: "Juan David Rodríguez",
    cargo: "Operario de producción",
    numero_documento: "98567432",
    telefono: "3154567890",
    estado: "INACTIVO",
  },
];

export default function EditarEmpleado() {
  const navigate = useNavigate();
  const { id } = useParams();

  const empleado = empleados.find(
    (item) => item.id_empleado === Number(id)
  );

  if (!empleado) {
    return (
      <div className="empleados-page">

        <div className="empleados-header">
          <div>
            <h1>Editar empleado</h1>
            <p>Actualización de información.</p>
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
    console.log(
      "Empleado actualizado:",
      datos
    );

    alert("Empleado actualizado correctamente.");

    navigate("/empleados");
  };

  return (
    <div className="empleados-page">

      <div className="empleados-header">
        <div>
          <h1>Editar empleado</h1>
          <p>
            Actualiza la información registrada del empleado.
          </p>
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