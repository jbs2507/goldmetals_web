import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmpleadoFiltros from "../../components/empleados/EmpleadoFiltros.jsx";
import BotonEliminar from "../../components/BotonEliminar";

const empleadosIniciales = [
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

export default function Empleados() {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState(empleadosIniciales);

  const eliminarEmpleado = (id) => {
    setEmpleados((actuales) =>
      actuales.filter((e) => e.id_empleado !== id)
    );
  };
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("TODOS");

  const empleadosFiltrados = empleados.filter((empleado) => {
    const texto = busqueda.toLowerCase().trim();

    const coincideBusqueda =
      empleado.nombre_completo.toLowerCase().includes(texto) ||
      (empleado.numero_documento || "").toLowerCase().includes(texto) ||
      (empleado.telefono || "").toLowerCase().includes(texto) ||
      (empleado.cargo || "").toLowerCase().includes(texto);

    const coincideEstado =
      estado === "TODOS" || empleado.estado === estado;

    return coincideBusqueda && coincideEstado;
  });

  const activos = empleados.filter(
    (empleado) => empleado.estado === "ACTIVO"
  ).length;

  const inactivos = empleados.filter(
    (empleado) => empleado.estado === "INACTIVO"
  ).length;

  return (
    <div className="empleados-page">

      {/* ENCABEZADO */}
      <div className="empleados-header">
        <div>
          <h1>Empleados</h1>
          <p>Consulta y administra la información de los empleados.</p>
        </div>

        <button
          type="button"
          className="btn-registrar-empleado"
          onClick={() => navigate("/empleados/registrar")}
        >
          + Registrar empleado
        </button>
      </div>

      {/* FILTROS */}
      <EmpleadoFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        estado={estado}
        setEstado={setEstado}
      />

      {/* RESUMEN */}
      <div className="empleados-resumen">

        <div className="resumen-empleado-item">
          <span>Total empleados</span>
          <strong>{empleados.length}</strong>
        </div>

        <div className="resumen-empleado-item">
          <span>Empleados activos</span>
          <strong>{activos}</strong>
        </div>

        <div className="resumen-empleado-item">
          <span>Empleados inactivos</span>
          <strong>{inactivos}</strong>
        </div>

      </div>

      {/* LISTA */}
      <div className="empleados-lista">

        {empleadosFiltrados.length > 0 ? (
          empleadosFiltrados.map((empleado) => (
            <div
              className="empleado-card"
              key={empleado.id_empleado}
            >

              {/* CABECERA DE TARJETA */}
              <div className="empleado-card-header">

                <div>
                  <span className="empleado-label">
                    Empleado
                  </span>

                  <h3>
                    {empleado.nombre_completo}
                  </h3>
                </div>

                <span
                  className={`estado-empleado ${
                    empleado.estado === "ACTIVO"
                      ? "estado-empleado-activo"
                      : "estado-empleado-inactivo"
                  }`}
                >
                  {empleado.estado}
                </span>

              </div>

              {/* DATOS */}
              <div className="empleado-card-body">

                <div className="dato-empleado">
                  <span>Nombre completo</span>
                  <strong>
                    {empleado.nombre_completo}
                  </strong>
                </div>

                <div className="dato-empleado">
                  <span>Cargo</span>
                  <strong>
                    {empleado.cargo || "No registrado"}
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

              </div>

              {/* ACCIONES */}
              <div className="empleado-card-actions">

                <button
                  className="btn-consultar-empleado"
                  onClick={() =>
                    navigate(
                      `/empleados/consultar/${empleado.id_empleado}`
                    )
                  }
                >
                  Consultar
                </button>

                <button
                  type="button"
                  className="btn-editar-empleado"
                  onClick={() =>
                    navigate(
                      `/empleados/editar/${empleado.id_empleado}`
                    )
                  }
                >
                  Editar
                </button>

                <BotonEliminar
                  entidad="empleado"
                  nombre={empleado.nombre_completo}
                  onConfirmar={() => eliminarEmpleado(empleado.id_empleado)}
                />

              </div>

            </div>
          ))
        ) : (
          <div className="sin-empleados">
            <h3>No se encontraron empleados</h3>
            <p>
              Intenta cambiar los criterios de búsqueda.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}