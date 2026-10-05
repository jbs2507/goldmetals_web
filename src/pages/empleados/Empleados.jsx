import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmpleadoFiltros from "../../components/empleados/EmpleadoFiltros.jsx";
import BotonEliminar from "../../components/BotonEliminar";
import { etiquetaTipoDocumento } from "../../components/clientes/tiposDocumento.js";
import { formatearFecha } from "../../data/insumosVinculos.js";
import RevincularEmpleado from "../../components/empleados/RevincularEmpleado.jsx";
import Permiso from "../../components/Permiso.jsx";

const empleadosIniciales = [
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

export default function Empleados() {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState(empleadosIniciales);

  const eliminarEmpleado = (id) => {
    setEmpleados((actuales) =>
      actuales.filter((e) => e.id_empleado !== id)
    );
  };
  // Un empleado desvinculado vuelve a estar activo con su nueva fecha de ingreso.
  const revincularEmpleado = (id, fecha) => {
    setEmpleados((actuales) =>
      actuales.map((e) =>
        e.id_empleado === id
          ? { ...e, estado: "ACTIVO", fecha_ingreso: fecha, fecha_finalizacion: null }
          : e
      )
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
      (empleado.cargo || "").toLowerCase().includes(texto) ||
      (empleado.correo || "").toLowerCase().includes(texto);

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

  const pag = usePaginacion(empleadosFiltrados);

  return (
    <div className="empleados-page">

      {/* ENCABEZADO */}
      <div className="empleados-header">
        <div>
          <h1>Empleados</h1>
          <p>Consulta y administra la información de los empleados.</p>
        </div>

        <Permiso accion="crear"><button
          type="button"
          className="btn-registrar-empleado"
          onClick={() => navigate("/empleados/registrar")}
        >
          + Registrar empleado
        </button></Permiso>
      </div>

      {/* FILTROS */}
      <EmpleadoFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        estado={estado}
        setEstado={setEstado}
      />

      {/* RESUMEN */}
      <Permiso dato="estadisticas"><div className="empleados-resumen">

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

      </div></Permiso>

      {/* LISTA */}
      <div className="empleados-lista">

        <BarraListado pag={pag} archivo="empleados" />

        {empleadosFiltrados.length > 0 ? (
          pag.items.map((empleado) => (
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

                <Permiso accion="editar"><button
                  type="button"
                  className="btn-editar-empleado"
                  onClick={() =>
                    navigate(
                      `/empleados/editar/${empleado.id_empleado}`
                    )
                  }
                >
                  Editar
                </button></Permiso>

                {empleado.estado === "INACTIVO" && (
                  <RevincularEmpleado
                    empleado={empleado}
                    onConfirmar={(fecha) => revincularEmpleado(empleado.id_empleado, fecha)}
                  />
                )}

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


      <Paginador pag={pag} />
    </div>
  );
}