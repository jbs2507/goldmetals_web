import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonEliminar from "../../components/BotonEliminar";
import Permiso from "../../components/Permiso.jsx";
import Tabla, { BotonIcono, Doble, InterruptorEstado } from "../../components/Tabla.jsx";
import {
  ACCIONES,
  MODULOS,
  clavePermiso,
  listarRoles,
  eliminarRolGuardado,
  cambiarEstadoRol,
} from "../../permisos.js";

// Resumen de lo que puede hacer el rol, para la tarjeta del listado.
const resumenRol = (rol) => {
  const modulos = MODULOS.filter((m) => rol.permisos.includes(clavePermiso(m.id, "ver")));
  const privilegios = ACCIONES.filter((a) =>
    modulos.some((m) => rol.permisos.includes(clavePermiso(m.id, a.id)))
  );
  return { modulos, privilegios };
};

export default function Roles() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState(listarRoles);
  const [busqueda, setBusqueda] = useState("");

  const eliminarRol = (id) => {
    if (!eliminarRolGuardado(id).ok) return;
    setRoles((actuales) =>
      actuales.filter((r) => r.id_rol !== id)
    );
  };

  const cambiarEstado = (id) => {
    const r = cambiarEstadoRol(id);
    if (!r.ok) return;
    setRoles((actuales) =>
      actuales.map((rol) => (rol.id_rol === id ? { ...rol, estado: r.estado } : rol))
    );
  };

  const rolesActivos = roles.filter((r) => r.estado === "ACTIVO").length;
  const rolesInactivos = roles.length - rolesActivos;

  const rolesFiltrados = roles.filter((rol) => {
    const texto = busqueda.toLowerCase().trim();

    return rol.nombre.toLowerCase().includes(texto);
  });

  const pag = usePaginacion(rolesFiltrados);

  return (
    <div className="roles-page">

      {/* ENCABEZADO */}
      <div className="roles-header">
        <div>
          <h1>Roles</h1>
        </div>

        <Permiso accion="crear"><button
          type="button"
          className="btn-registrar-rol"
          onClick={() => navigate("/roles/registrar")}
        >
          + Registrar rol
        </button></Permiso>
      </div>

      {/* FILTROS */}
      <div className="roles-filtros">
        <div className="campo-busqueda-rol">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* RESUMEN */}
      <div className="roles-resumen">
        <div className="resumen-rol-item">
          <span>Total roles</span>

          <strong>
            {roles.length}
          </strong>
        </div>

        <div className="resumen-rol-item">
          <span>Activos</span>

          <strong>
            {rolesActivos}
          </strong>
        </div>

        <div className="resumen-rol-item">
          <span>Inactivos</span>

          <strong>
            {rolesInactivos}
          </strong>
        </div>
      </div>

      {/* LISTA */}
      <div className="roles-lista">

        <BarraListado pag={pag} archivo="roles" />

        <Tabla
          filas={pag.items}
          clave={(r) => r.id_rol}
          vacio={
            <div className="sin-roles">
              <h3>No se encontraron roles</h3>
              <p>Intenta realizar otra búsqueda.</p>
            </div>
          }
          columnas={[
            {
              titulo: "Rol",
              render: (r) => <Doble principal={r.nombre} secundario={r.descripcion || "Sin descripción"} />,
            },
            {
              titulo: "Módulos",
              sinSalto: true,
              render: (r) => `${resumenRol(r).modulos.length} de ${MODULOS.length}`,
            },
            {
              titulo: "Privilegios",
              render: (r) => {
                const { privilegios } = resumenRol(r);
                return (
                  <span className="tabla-largo">
                    {privilegios.length ? privilegios.map((a) => a.etiqueta).join(", ") : "Ninguno"}
                  </span>
                );
              },
            },
          ]}
          interruptor={{
            render: (r) => (
              <InterruptorEstado
                activo={r.estado === "ACTIVO"}
                nombre={r.nombre}
                deshabilitado={r.sistema}
                onCambiar={() => cambiarEstado(r.id_rol)}
              />
            ),
          }}
          acciones={(r) => (
            <>
              <BotonIcono icono="ver" titulo="Consultar" onClick={() => navigate(`/roles/consultar/${r.id_rol}`)} />
              {!r.sistema && (
                <Permiso accion="editar">
                  <BotonIcono
                    icono="editar"
                    titulo="Editar"
                    tono="dorado"
                    onClick={() => navigate(`/roles/editar/${r.id_rol}`)}
                  />
                </Permiso>
              )}
              {!r.sistema && (
                <BotonEliminar icono entidad="rol" nombre={r.nombre} onConfirmar={() => eliminarRol(r.id_rol)} />
              )}
            </>
          )}
        />
      </div>

      <Paginador pag={pag} />
    </div>
  );
}