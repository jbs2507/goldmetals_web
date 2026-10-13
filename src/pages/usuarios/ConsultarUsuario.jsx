import { useNavigate, useParams } from "react-router-dom";
import { listarUsuarios } from "../../auth.js";

export default function ConsultarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const usuario = listarUsuarios().find(
    (item) => item.id_usuario === Number(id)
  );

  return (
    <div className="usuarios-page">

      <div className="usuarios-header">
        <div>
          <h1>Consultar usuario</h1>
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