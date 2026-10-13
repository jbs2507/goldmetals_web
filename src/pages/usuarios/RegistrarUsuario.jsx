import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../../auth.js";
import { filtrarSoloDigitos, filtrarSoloLetras, validarCampo } from "../../utils/validaciones.js";
import Modal from "../../components/Modal.jsx";
import Usuarios from "./Usuarios.jsx";

export default function RegistrarUsuario() {
  const navigate = useNavigate();

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");
  const [error, setError] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault();
    setError("");

    const mensaje =
      validarCampo(nombreCompleto, { requerido: true, soloLetras: true, longitudMin: 3 }) ||
      validarCampo(correo, { requerido: true, tipo: "email" }) ||
      validarCampo(telefono, { soloDigitos: true, telefono: true }) ||
      (!rol.trim() ? "Seleccione el rol" : "");
    if (mensaje) {
      setError(mensaje);
      return;
    }

    const nuevoUsuario = {
      nombre_completo: nombreCompleto.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      rol,
      estado: "ACTIVO",
    };

    const r = registrarUsuario(nuevoUsuario);
    if (!r.ok) {
      setError(r.error);
      return;
    }

    navigate("/usuarios");
  };

  // El registro es una ventana emergente sobre la lista de usuarios.
  return (
    <>
      <Usuarios />
      <Modal
        titulo="Registrar usuario"
        subtitulo="Ingresa los datos del nuevo usuario"
        ancho={640}
        onCerrar={() => navigate("/usuarios")}
      >
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
            Registrar usuario
          </button>

        </div>
      </form>
      </Modal>
    </>
  );
}