import { useState } from "react";
import { filtrarSoloDigitos, filtrarSoloLetras, validarCampo } from "../../utils/validaciones.js";

export default function UsuarioForm({
  modo = "registrar",
  datosIniciales = {},
  onGuardar,
  onCancelar,
}) {
  const [nombreCompleto, setNombreCompleto] = useState(
    datosIniciales.nombre_completo || ""
  );

  const [correo, setCorreo] = useState(
    datosIniciales.correo || ""
  );

  const [telefono, setTelefono] = useState(
    datosIniciales.telefono || ""
  );

  const [contrasena, setContrasena] = useState("");

  const [estado, setEstado] = useState(
    datosIniciales.estado || "ACTIVO"
  );

  const [error, setError] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault();
    setError("");

    const errNombre = validarCampo(nombreCompleto, { requerido: true, soloLetras: true });
    if (errNombre) {
      setError(errNombre);
      return;
    }

    const errCorreo = validarCampo(correo, { requerido: true, tipo: "email" });
    if (errCorreo) {
      setError(errCorreo);
      return;
    }

    const errTelefono = validarCampo(telefono, { soloDigitos: true });
    if (errTelefono) {
      setError(errTelefono);
      return;
    }

    if (
      modo === "registrar" &&
      !contrasena.trim()
    ) {
      setError("La contraseña es obligatoria.");
      return;
    }

    const datos = {
      nombre_completo: nombreCompleto.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      estado,
    };

    if (contrasena.trim()) {
      datos.contrasena = contrasena;
    }

    onGuardar(datos);
  };

  return (
    <form
      className="usuario-form"
      onSubmit={manejarSubmit}
    >
      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>Información del usuario</h2>

          <p>
            {modo === "editar"
              ? "Modifica los datos registrados del usuario"
              : "Ingresa los datos del nuevo usuario"}
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
          {modo === "editar" && (
            <div className="form-campo">
              <label htmlFor="estado-usuario">Estado</label>
              <select id="estado-usuario" value={estado} onChange={(e) => setEstado(e.target.value)} required>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>
          )}

          <div className="form-campo">
            <label htmlFor="contrasena-usuario">
              {modo === "editar"
                ? "Nueva contraseña"
                : "Contraseña"}
            </label>

            <input
              id="contrasena-usuario"
              type="password"
              placeholder={
                modo === "editar"
                  ? "Dejar vacío para conservarla"
                  : "Ingresa la contraseña"
              }
              value={contrasena}
              onChange={(e) =>
                setContrasena(e.target.value)
              }
              required={modo === "registrar"}
            />
          </div>

        </div>

        {error && (
          <div className="mensaje-error-usuario">
            {error}
          </div>
        )}

      </section>

      <div className="form-acciones-usuario">

        <button
          type="button"
          className="btn-cancelar-usuario"
          onClick={onCancelar}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn-guardar-usuario"
        >
          {modo === "editar"
            ? "Guardar cambios"
            : "Registrar usuario"}
        </button>

      </div>
    </form>
  );
}