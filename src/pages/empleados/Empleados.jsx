import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmpleadoFiltros from "../../components/empleados/EmpleadoFiltros.jsx";
import BotonEliminar from "../../components/BotonEliminar";
import { etiquetaTipoDocumento } from "../../components/clientes/tiposDocumento.js";
import { formatearFecha } from "../../data/insumosVinculos.js";
import RevincularEmpleado from "../../components/empleados/RevincularEmpleado.jsx";
import Permiso from "../../components/Permiso.jsx";
import Tabla, { BotonIcono, Doble, InterruptorEstado } from "../../components/Tabla.jsx";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES, EMPLEADOS_SEMILLA } from "../../data/semillas.js";

export default function Empleados() {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useAlmacen(CLAVES.empleados, EMPLEADOS_SEMILLA);

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
  // Interruptor: inactivar registra la fecha de hoy como finalización; activar quita esa fecha.
  const cambiarEstado = (id) => {
    const hoy = new Date().toISOString().slice(0, 10);
    setEmpleados((actuales) =>
      actuales.map((e) => {
        if (e.id_empleado !== id) return e;
        return e.estado === "ACTIVO"
          ? { ...e, estado: "INACTIVO", fecha_finalizacion: e.fecha_finalizacion || hoy }
          : { ...e, estado: "ACTIVO", fecha_finalizacion: null };
      })
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

        <Tabla
          filas={pag.items}
          clave={(e) => e.id_empleado}
          vacio={
            <div className="sin-empleados">
              <h3>No se encontraron empleados</h3>
              <p>Intenta cambiar los criterios de búsqueda.</p>
            </div>
          }
          columnas={[
            {
              titulo: "Empleado",
              render: (e) => <Doble principal={e.nombre_completo} secundario={e.cargo || "Sin cargo"} />,
            },
            {
              titulo: "Documento",
              sinSalto: true,
              render: (e) => (
                <Doble
                  principal={e.numero_documento || "No registrado"}
                  secundario={etiquetaTipoDocumento(e.tipo_documento)}
                />
              ),
            },
            {
              titulo: "Contacto",
              render: (e) => <Doble principal={e.telefono || "No registrado"} secundario={e.correo || "Sin correo"} />,
            },
            { titulo: "Ingreso", sinSalto: true, render: (e) => formatearFecha(e.fecha_ingreso) },
            {
              titulo: "Finalización",
              sinSalto: true,
              render: (e) => (e.fecha_finalizacion ? formatearFecha(e.fecha_finalizacion) : "Sigue vinculado"),
            },
          ]}
          interruptor={{
            render: (e) => (
              <InterruptorEstado
                activo={e.estado === "ACTIVO"}
                nombre={e.nombre_completo}
                onCambiar={() => cambiarEstado(e.id_empleado)}
              />
            ),
          }}
          acciones={(e) => (
            <>
              <BotonIcono
                icono="ver"
                titulo="Consultar"
                onClick={() => navigate(`/empleados/consultar/${e.id_empleado}`)}
              />
              <Permiso accion="editar">
                <BotonIcono
                  icono="editar"
                  titulo="Editar"
                  tono="dorado"
                  onClick={() => navigate(`/empleados/editar/${e.id_empleado}`)}
                />
              </Permiso>
              {e.estado === "INACTIVO" && (
                <RevincularEmpleado
                  icono
                  empleado={e}
                  onConfirmar={(fecha) => revincularEmpleado(e.id_empleado, fecha)}
                />
              )}
              <BotonEliminar
                icono
                entidad="empleado"
                nombre={e.nombre_completo}
                onConfirmar={() => eliminarEmpleado(e.id_empleado)}
              />
            </>
          )}
        />
      </div>

      <Paginador pag={pag} />
    </div>
  );
}