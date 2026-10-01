import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonEliminar from "../../components/BotonEliminar";

const usuariosIniciales = [
  {
    id_usuario: 1,
    correo: "admin@mmmetalsgold.com",
    nombre_completo: "Administrador",
    telefono: "3001234567",
    rol: "Administrador",
    estado: "ACTIVO",
  },
  {
    id_usuario: 2,
    correo: "compras@mmmetalsgold.com",
    nombre_completo: "Jefe de compras",
    telefono: "3012345678",
    rol: "Compras",
    estado: "ACTIVO",
  },
  {
    id_usuario: 3,
    correo: "produccion@mmmetalsgold.com",
    nombre_completo: "Analista de producción",
    telefono: "3023456789",
    rol: "Producción",
    estado: "ACTIVO",
  },
  {
    id_usuario: 4,
    correo: "logistica@mmmetalsgold.com",
    nombre_completo: "Auxiliar de logística",
    telefono: "3034567890",
    rol: "Logística",
    estado: "INACTIVO",
  },
];

export default function Usuarios() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState(
    usuariosIniciales
  );

  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("TODOS");

  const eliminarUsuario = (id) => {
    setUsuarios((actuales) =>
      actuales.filter((u) => u.id_usuario !== id)
    );
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

  return (
    <div className="usuarios-page">

      {/* ENCABEZADO */}
      <div className="usuarios-header">

        <div>
          <h1>Usuarios</h1>

          <p>
            Gestión de usuarios del sistema
          </p>
        </div>

        <button
          className="btn-registrar-usuario"
          onClick={() =>
            navigate("/usuarios/registrar")
          }
        >
          + Registrar usuario
        </button>

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

        {usuariosFiltrados.length === 0 ? (

          <div className="sin-usuarios">

            <h3>
              No se encontraron usuarios
            </h3>

            <p>
              Intenta cambiar los filtros de búsqueda.
            </p>

          </div>

        ) : (

          usuariosFiltrados.map((usuario) => (

            <div
              className="usuario-card"
              key={usuario.id_usuario}
            >

              {/* CABECERA */}
              <div className="usuario-card-header">

                <div>

                  <span className="usuario-label">
                    Usuario
                  </span>

                  <h2>
                    {usuario.nombre_completo}
                  </h2>

                </div>

                <span
                  className={`estado-usuario ${
                    usuario.estado === "ACTIVO"
                      ? "estado-usuario-activo"
                      : "estado-usuario-inactivo"
                  }`}
                >
                  {usuario.estado}
                </span>

              </div>

              {/* INFORMACIÓN */}
              <div className="usuario-card-body">

                <div className="dato-usuario">

                  <span>
                    Nombre completo
                  </span>

                  <strong>
                    {usuario.nombre_completo}
                  </strong>

                </div>

                <div className="dato-usuario">

                  <span>
                    Correo
                  </span>

                  <strong>
                    {usuario.correo}
                  </strong>

                </div>

                <div className="dato-usuario">

                  <span>
                    Teléfono
                  </span>

                  <strong>
                    {usuario.telefono || "No registrado"}
                  </strong>

                </div>

              </div>

              {/* ACCIONES */}
              <div className="usuario-card-actions">

                <button
                  className="btn-consultar-usuario"
                  onClick={() =>
                    navigate(
                      `/usuarios/consultar/${usuario.id_usuario}`
                    )
                  }
                >
                  Consultar
                </button>

                <button
                  className="btn-editar-usuario"
                  onClick={() =>
                    navigate(
                      `/usuarios/editar/${usuario.id_usuario}`
                    )
                  }
                >
                  Editar
                </button>

                <BotonEliminar
                  entidad="usuario"
                  nombre={usuario.nombre_completo}
                  onConfirmar={() => eliminarUsuario(usuario.id_usuario)}
                />

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}