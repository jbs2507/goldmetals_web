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

  const [contrasena, setContrasena] = useState("");
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

    if (contrasena.trim()) {
      usuarioActualizado.contrasena = contrasena;
    }

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

          <p>
            Actualiza la información del usuario
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
                <option value="Compras">Compras</option>
                <option value="Producción">Producción</option>
                <option value="Ventas">Ventas</option>
                <option value="Logística">Logística</option>
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

            <div className="form-campo">
              <label htmlFor="contrasena-usuario">
                Nueva contraseña
              </label>

              <input
                id="contrasena-usuario"
                type="password"
                placeholder="Dejar vacío para conservarla"
                value={contrasena}
                onChange={(e) =>
                  setContrasena(e.target.value)
                }
              />
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