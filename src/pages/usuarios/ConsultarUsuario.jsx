import { useNavigate, useParams } from "react-router-dom";

const usuarios = [
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
    correo: "contador@mmmetalsgold.com",
    nombre_completo: "Contador",
    telefono: "3012345678",
    rol: "Contador",
    estado: "ACTIVO",
  },
  {
    id_usuario: 3,
    correo: "abogado@mmmetalsgold.com",
    nombre_completo: "Abogado",
    telefono: "3023456789",
    rol: "Abogado",
    estado: "ACTIVO",
  }
];

export default function ConsultarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const usuario = usuarios.find(
    (item) => item.id_usuario === Number(id)
  );

  return (
    <div className="usuarios-page">

      <div className="usuarios-header">
        <div>
          <h1>Consultar usuario</h1>

          <p>
            Consulta la información del usuario seleccionado
          </p>
        </div>

        <button
          type="button"
          className="btn-volver-usuario"
          onClick={() => navigate("/usuarios")}
        >
          Volver
        </button>
      </div>

      {usuario ? (
        <div className="usuario-form">

          <section className="form-seccion">

            <div className="form-seccion-titulo">
              <h2>Información del usuario</h2>

              <p>
                Datos registrados del usuario
              </p>
            </div>

            <div className="usuario-detalle-grid">

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

              <div className="dato-usuario">
                <span>Rol</span>
                <strong>{usuario.rol || "No asignado"}</strong>
              </div>

              <div className="dato-usuario">
                <span>
                  Estado
                </span>

                <strong
                  className={
                    usuario.estado === "ACTIVO"
                      ? "texto-estado-usuario-activo"
                      : "texto-estado-usuario-inactivo"
                  }
                >
                  {usuario.estado}
                </strong>
              </div>

            </div>
          </section>

          <div className="consulta-acciones-usuario">

            <button
              type="button"
              className="btn-cancelar-usuario"
              onClick={() => navigate("/usuarios")}
            >
              Volver
            </button>

          </div>

        </div>
      ) : (
        <div className="sin-usuarios">

          <h3>
            Usuario no encontrado
          </h3>

          <p>
            El usuario que deseas consultar no existe.
          </p>

        </div>
      )}

    </div>
  );
}