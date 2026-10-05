import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrarUsuario() {
  const navigate = useNavigate();

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault();

    if (
      !nombreCompleto.trim() ||
      !correo.trim() ||
      !rol.trim()
    ) {
      return;
    }

    const nuevoUsuario = {
      nombre_completo: nombreCompleto.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      rol,
      estado: "ACTIVO",
    };

    console.log("Usuario registrado:", nuevoUsuario);

    navigate("/usuarios");
  };

  return (
    <div className="usuarios-page">

      <div className="usuarios-header">
        <div>
          <h1>Registrar usuario</h1>

          <p>
            Registra un nuevo usuario en el sistema
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
              Ingresa los datos del nuevo usuario
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
                placeholder="Ej. Juan Pérez"
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
                placeholder="Ej. usuario@correo.com"
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
                placeholder="Ej. 3001234567"
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
            Registrar usuario
          </button>

        </div>
      </form>
    </div>
  );
}