import { useNavigate, useParams } from "react-router-dom";
import { etiquetaTipoDocumento } from "../../components/clientes/tiposDocumento.js";
import { formatearFecha } from "../../data/insumosVinculos.js";

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

export default function ConsultarEmpleado() {
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
            <h1>Consultar empleado</h1>
            <p>Información del empleado.</p>
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

  return (
    <div className="empleados-page">

      <div className="empleados-header">
        <div>
          <h1>Consultar empleado</h1>
          <p>
            Consulta la información registrada del empleado.
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

      <div className="empleado-form">

        <section className="form-seccion">

          <div className="form-seccion-titulo">
            <h2>Información del empleado</h2>
            <p>
              Datos registrados en el sistema.
            </p>
          </div>

          <div className="empleado-card-body">

            <div className="dato-empleado">
              <span>Nombre completo</span>
              <strong>{empleado.nombre_completo}</strong>
            </div>


            <div className="dato-empleado">
              <span>Tipo de documento</span>
              <strong>
                {etiquetaTipoDocumento(empleado.tipo_documento)}
              </strong>
            </div>

            <div className="dato-empleado">
              <span>Número de documento</span>
              <strong>
                {empleado.numero_documento || "No registrado"}
              </strong>
            </div>

            <div className="dato-empleado">
              <span>Teléfono</span>
              <strong>
                {empleado.telefono || "No registrado"}
              </strong>
            </div>

            <div className="dato-empleado">
              <span>Cargo</span>
              <strong>
                {empleado.cargo || "No registrado"}
              </strong>
            </div>

            <div className="dato-empleado">
              <span>Correo electrónico</span>
              <strong>
                {empleado.correo || "No registrado"}
              </strong>
            </div>

            <div className="dato-empleado">
              <span>Dirección</span>
              <strong>
                {empleado.direccion || "No registrado"}
              </strong>
            </div>

            <div className="dato-empleado">
              <span>Fecha de ingreso</span>
              <strong>
                {formatearFecha(empleado.fecha_ingreso)}
              </strong>
            </div>

            <div className="dato-empleado">
              <span>Fecha de finalización</span>
              <strong>
                {empleado.fecha_finalizacion
                  ? formatearFecha(empleado.fecha_finalizacion)
                  : "Sigue vinculado"}
              </strong>
            </div>

            <div className="dato-empleado">
              <span>Estado</span>
              <strong>
                <span
                  className={`estado-empleado ${
                    empleado.estado === "ACTIVO"
                      ? "estado-empleado-activo"
                      : "estado-empleado-inactivo"
                  }`}
                >
                  {empleado.estado}
                </span>
              </strong>
            </div>

          </div>

        </section>

        <div className="consulta-acciones-empleado">

          <button
            className="btn-volver-empleado"
            onClick={() => navigate("/empleados")}
          >
            Volver
          </button>

        </div>

      </div>

    </div>
  );
}