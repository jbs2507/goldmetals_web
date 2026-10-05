import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonEliminar from "../../components/BotonEliminar";
import Permiso from "../../components/Permiso.jsx";
import {
  ACCIONES,
  MODULOS,
  DATOS_SENSIBLES,
  clavePermiso,
  claveDato,
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
  const datos = DATOS_SENSIBLES.filter((d) => rol.permisos.includes(claveDato(d.id)));
  return { modulos, privilegios, datos };
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

          <p>
            Gestión de roles y permisos del sistema
          </p>
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

        {rolesFiltrados.length === 0 ? (
          <div className="sin-roles">
            <h3>
              No se encontraron roles
            </h3>

            <p>
              Intenta realizar otra búsqueda.
            </p>
          </div>
        ) : (
          pag.items.map((rol) => {
            const resumen = resumenRol(rol);
            return (
            <div
              className="rol-card"
              key={rol.id_rol}
            >

              {/* CABECERA */}
              <div className="rol-card-header">
                <div>
                  <span className="rol-label">
                    Rol
                  </span>

                  <h2>
                    {rol.nombre}
                  </h2>
                </div>

                <span
                  className={`estado-rol ${
                    rol.estado === "ACTIVO" ? "estado-rol-activo" : "estado-rol-inactivo"
                  }`}
                >
                  {rol.estado}
                </span>
              </div>

              {/* INFORMACIÓN */}
              <div className="rol-card-body">
                <div className="dato-rol dato-rol-ancho">
                  <span>Descripción</span>
                  <strong>{rol.descripcion || "Sin descripción"}</strong>
                </div>

                <div className="dato-rol">
                  <span>Módulos que puede ver</span>
                  <strong>{resumen.modulos.length} de {MODULOS.length}</strong>
                </div>

                <div className="dato-rol">
                  <span>Privilegios</span>
                  <strong>
                    {resumen.privilegios.length
                      ? resumen.privilegios.map((a) => a.etiqueta).join(", ")
                      : "Ninguno"}
                  </strong>
                </div>

                <div className="dato-rol dato-rol-ancho">
                  <span>Información sensible</span>
                  <strong>
                    {resumen.datos.length
                      ? resumen.datos.map((d) => d.etiqueta).join(", ")
                      : "Solo información general (sin precios, cantidades ni estadísticas)"}
                  </strong>
                </div>
              </div>

              {/* ACCIONES */}
              <div className="rol-card-actions">

                <button
                  type="button"
                  className="btn-consultar-rol"
                  onClick={() =>
                    navigate(
                      `/roles/consultar/${rol.id_rol}`
                    )
                  }
                >
                  Consultar
                </button>

                {!rol.sistema && <Permiso accion="editar"><button
                  type="button"
                  className="btn-editar-rol"
                  onClick={() =>
                    navigate(
                      `/roles/editar/${rol.id_rol}`
                    )
                  }
                >
                  Editar
                </button></Permiso>}

                {!rol.sistema && <Permiso accion="editar"><button
                  type="button"
                  className={`btn-estado-rol ${
                    rol.estado === "ACTIVO" ? "btn-desactivar-rol" : "btn-activar-rol"
                  }`}
                  onClick={() => cambiarEstado(rol.id_rol)}
                >
                  {rol.estado === "ACTIVO" ? "Inactivar" : "Activar"}
                </button></Permiso>}

                {!rol.sistema && (
                  <BotonEliminar
                    entidad="rol"
                    nombre={rol.nombre}
                    onConfirmar={() => eliminarRol(rol.id_rol)}
                  />
                )}

              </div>

            </div>
            );
          })
        )}

      </div>

      <Paginador pag={pag} />
    </div>
  );
}