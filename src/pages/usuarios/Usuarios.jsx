import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonEliminar from "../../components/BotonEliminar";
import Permiso from "../../components/Permiso.jsx";
import Tabla, { BotonIcono, Doble, InterruptorEstado } from "../../components/Tabla.jsx";
import { actualizarUsuario, eliminarUsuario as eliminarUsuarioGuardado, listarUsuarios } from "../../auth.js";

export default function Usuarios() {
  const navigate = useNavigate();

  // Los usuarios se leen de los usuarios guardados (los mismos con los que se inicia sesión).
  const [usuarios, setUsuarios] = useState(() => listarUsuarios());

  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("TODOS");

  const eliminarUsuario = (id) => {
    const r = eliminarUsuarioGuardado(id);
    if (!r.ok) {
      alert(r.error);
      return;
    }
    setUsuarios(listarUsuarios());
  };

  const cambiarEstado = (usuario) => {
    const r = actualizarUsuario(usuario.id_usuario, {
      estado: usuario.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO",
    });
    if (!r.ok) {
      alert(r.error);
      return;
    }
    setUsuarios(listarUsuarios());
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      usuario.nombre_completo
        .toLowerCase()
        .includes(texto) ||
      usuario.correo
        .toLowerCase()
        .includes(texto);

    const coincideEstado =
      estado === "TODOS" ||
      usuario.estado === estado;

    return coincideBusqueda && coincideEstado;
  });

  const totalUsuarios = usuarios.length;

  const usuariosActivos = usuarios.filter(
    (usuario) => usuario.estado === "ACTIVO"
  ).length;

  const usuariosInactivos = usuarios.filter(
    (usuario) => usuario.estado === "INACTIVO"
  ).length;

  const pag = usePaginacion(usuariosFiltrados);

  return (
    <div className="usuarios-page">

      {/* ENCABEZADO */}
      <div className="usuarios-header">

        <div>
          <h1>Usuarios</h1>
        </div>

        <Permiso accion="crear"><button
          className="btn-registrar-usuario"
          onClick={() =>
            navigate("/usuarios/registrar")
          }
        >
          + Registrar usuario
        </button></Permiso>

      </div>

      {/* FILTROS */}
      <div className="usuarios-filtros">

        <div className="campo-busqueda-usuario">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar por nombre o correo"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
          />

        </div>

        <select
          value={estado}
          onChange={(e) =>
            setEstado(e.target.value)
          }
        >
          <option value="TODOS">
            Todos los estados
          </option>

          <option value="ACTIVO">
            Activo
          </option>

          <option value="INACTIVO">
            Inactivo
          </option>
        </select>

      </div>

      {/* RESUMEN */}
      <div className="usuarios-resumen">

        <div className="resumen-usuario-item">
          <span>Total usuarios</span>

          <strong>
            {totalUsuarios}
          </strong>
        </div>

        <div className="resumen-usuario-item">
          <span>Activos</span>

          <strong>
            {usuariosActivos}
          </strong>
        </div>

        <div className="resumen-usuario-item">
          <span>Inactivos</span>

          <strong>
            {usuariosInactivos}
          </strong>
        </div>

      </div>

      {/* LISTA */}
      <div className="usuarios-lista">

        <BarraListado pag={pag} archivo="usuarios" />

        <Tabla
          filas={pag.items}
          clave={(u) => u.id_usuario}
          vacio={
            <div className="sin-usuarios">
              <h3>No se encontraron usuarios</h3>
              <p>Intenta cambiar los filtros de búsqueda.</p>
            </div>
          }
          columnas={[
            { titulo: "Usuario", fuerte: true, render: (u) => u.nombre_completo },
            { titulo: "Correo", render: (u) => u.correo },
            { titulo: "Teléfono", sinSalto: true, render: (u) => u.telefono || "No registrado" },
          ]}
          interruptor={{
            render: (u) => (
              <InterruptorEstado
                activo={u.estado === "ACTIVO"}
                nombre={u.nombre_completo}
                onCambiar={() => cambiarEstado(u)}
              />
            ),
          }}
          acciones={(u) => (
            <>
              <BotonIcono
                icono="ver"
                titulo="Consultar"
                onClick={() => navigate(`/usuarios/consultar/${u.id_usuario}`)}
              />
              <Permiso accion="editar">
                <BotonIcono
                  icono="editar"
                  titulo="Editar"
                  tono="dorado"
                  onClick={() => navigate(`/usuarios/editar/${u.id_usuario}`)}
                />
              </Permiso>
              <BotonEliminar
                icono
                entidad="usuario"
                nombre={u.nombre_completo}
                onConfirmar={() => eliminarUsuario(u.id_usuario)}
              />
            </>
          )}
        />
      </div>

      <Paginador pag={pag} />
    </div>
  );
}