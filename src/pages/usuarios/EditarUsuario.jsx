import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { actualizarUsuario, listarUsuarios } from "../../auth.js";
import { filtrarSoloDigitos, filtrarSoloLetras, validarCampo } from "../../utils/validaciones.js";

export default function EditarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const usuario = listarUsuarios().find(
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

  const [error, setError] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault();
    setError("");

    const mensaje =
      validarCampo(nombreCompleto, { requerido: true, soloLetras: true, longitudMin: 3 }) ||
      validarCampo(correo, { requerido: true, tipo: "email" }) ||
      validarCampo(telefono, { soloDigitos: true, telefono: true });
    if (mensaje) {
      setError(mensaje);
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

    const r = actualizarUsuario(Number(id), {
      nombre_completo: usuarioActualizado.nombre_completo,
      correo: usuarioActualizado.correo,
      telefono: usuarioActualizado.telefono,
      rol: usuarioActualizado.rol,
      estado: usuarioActualizado.estado,
    });
    if (!r.ok) {
      setError(r.error);
      return;
    }

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
                  setNombreCompleto(filtrarSoloLetras(e.target.value))
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
                  setTelefono(filtrarSoloDigitos(e.target.value))
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

          {error && <div className="mensaje-error-usuario">{error}</div>}
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