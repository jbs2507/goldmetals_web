import { useNavigate, useParams } from "react-router-dom";
import EmpleadoForm from "../../components/empleados/EmpleadoForm.jsx";

const empleados = [
  {
    id_empleado: 1,
    nombre_completo: "Carlos Andrés Gómez",
    tipo_documento: "CC",
    numero_documento: "1032456789",
    telefono: "3001234567",
    cargo: "Operario de fundición",
    direccion: "Calle 45 # 23-18, Medellín",
    correo: "carlos.gomez@mmmetalsgold.com",
    fecha_ingreso: "2024-02-01",
    fecha_finalizacion: null,
    estado: "ACTIVO",
  },
  {
    id_empleado: 2,
    nombre_completo: "Laura Marcela Pérez",
    tipo_documento: "CC",
    numero_documento: "1012456788",
    telefono: "3019876543",
    cargo: "Auxiliar administrativa",
    direccion: "Carrera 70 # 32-10, Medellín",
    correo: "laura.perez@mmmetalsgold.com",
    fecha_ingreso: "2025-06-16",
    fecha_finalizacion: null,
    estado: "ACTIVO",
  },
  {
    id_empleado: 3,
    nombre_completo: "Juan David Rodríguez",
    tipo_documento: "CE",
    numero_documento: "98567432",
    telefono: "3154567890",
    cargo: "Jefe de producción",
    direccion: "Calle 10 # 40-25, Envigado",
    correo: "juan.rodriguez@mmmetalsgold.com",
    fecha_ingreso: "2023-08-10",
    fecha_finalizacion: "2026-08-31",
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