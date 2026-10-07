import { useState } from "react";
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

export default function EditarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const usuario = usuarios.find(
    (item) => item.id_usuario === Number(id)
  );

  const [nombreCompleto, setNombreCompleto] = useState(
    usuario?.nombre_completo || ""
  );

  const [correo, setCorreo] = useState(
    usuario?.correo || ""
  );

  const [telefono, setTelefono] = useState(
    usuario?.telefono || ""
  );

  const [rol, setRol] = useState(usuario?.rol || "");

  const [estado, setEstado] = useState(
    usuario?.estado || "ACTIVO"
  );

  const manejarSubmit = (e) => {
    e.preventDefault();

    if (
      !nombreCompleto.trim() ||
      !correo.trim()
    ) {
      return;
    }

    const usuarioActualizado = {
      id_usuario: Number(id),
      nombre_completo: nombreCompleto.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      rol,
      estado,
    };

    console.log(
      "Usuario actualizado:",
      usuarioActualizado
    );

    navigate("/usuarios");
  };

  if (!usuario) {
    return (
      <div className="usuarios-page">

        <div className="sin-usuarios">
          <h3>Usuario no encontrado</h3>

          <p>
            El usuario que deseas editar no existe.
          </p>
        </div>

        <div className="consulta-acciones-usuario">
          <button
            type="button"
            className="btn-volver-usuario"
            onClick={() => navigate("/usuarios")}
          >
            Volver
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="usuarios-page">

      <div className="usuarios-header">
        <div>
          <h1>Editar usuario</h1>
        </div>

        <button
          type="button"
          className="btn-volver-usuario"
          onClick={() => navigate("/usuarios")}
        >
          Volver
        </button>
      </div>

      <form
        className="usuario-form"
        onSubmit={manejarSubmit}
      >
        <section className="form-seccion">

          <div className="form-seccion-titulo">
            <h2>Información del usuario</h2>

            <p>
              Modifica los datos registrados del usuario
            </p>
          </div>

          <div className="form-grid">

            <div className="form-campo">
              <label htmlFor="nombre-completo-usuario">
                Nombre completo
              </label>

              <input
                id="nombre-completo-usuario"
                type="text"
                value={nombreCompleto}
                onChange={(e) =>
                  setNombreCompleto(e.target.value)
                }
                required
              />
            </div>

            <div className="form-campo">
              <label htmlFor="correo-usuario">
                Correo
              </label>

              <input
                id="correo-usuario"
                type="email"
                value={correo}
                onChange={(e) =>
                  setCorreo(e.target.value)
                }
                required
              />
            </div>

            <div className="form-campo">
              <label htmlFor="telefono-usuario">
                Teléfono
              </label>

              <input
                id="telefono-usuario"
                type="text"
                value={telefono}
                onChange={(e) =>
                  setTelefono(e.target.value)
                }
              />
            </div>

            <div className="form-campo">
              <label htmlFor="rol-usuario">Rol</label>
              <select id="rol-usuario" value={rol} onChange={(e) => setRol(e.target.value)} required>
                <option value="">Seleccionar rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Contador">Contador</option>
                <option value="Abogado">Abogado</option>
              </select>
            </div>

            <div className="form-campo">
              <label htmlFor="estado-usuario">
                Estado
              </label>

              <select
                id="estado-usuario"
                value={estado}
                onChange={(e) =>
                  setEstado(e.target.value)
                }
                required
              >
                <option value="ACTIVO">
                  Activo
                </option>

                <option value="INACTIVO">
                  Inactivo
                </option>
              </select>
            </div>

          </div>
        </section>

        <div className="form-acciones-usuario">

          <button
            type="button"
            className="btn-cancelar-usuario"
            onClick={() => navigate("/usuarios")}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-guardar-usuario"
          >
            Guardar cambios
          </button>

        </div>
      </form>
    </div>
  );
}