import { useState } from "react";
import { filtrarSoloLetras, validarCampo } from "../../utils/validaciones.js";

export default function RolForm({
  modo = "registrar",
  datosIniciales = {},
  onGuardar,
  onCancelar,
}) {
  const [nombre, setNombre] = useState(
    datosIniciales.nombre || ""
  );

  const [error, setError] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault();

    const msg = validarCampo(nombre, { requerido: true, soloLetras: true });
    setError(msg);
    if (msg) return;

    const datos = {
      nombre: nombre.trim(),
    };

    onGuardar(datos);
  };

  return (
    <form
      className="rol-form"
      onSubmit={manejarSubmit}
    >
      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>Información del rol</h2>

          <p>
            Ingresa el nombre del rol
          </p>
        </div>

        <div className="form-grid">

          <div className="form-campo">
            <label htmlFor="nombre-rol">
              Nombre del rol
            </label>

            <input
              id="nombre-rol"
              type="text"
              placeholder="Ej. Administrador"
              value={nombre}
              onChange={(e) =>
                setNombre(filtrarSoloLetras(e.target.value))
              }
              required
            />
          </div>

        </div>

        {error && (
          <div className="mensaje-error-rol">
            {error}
          </div>
        )}

      </section>

      <div className="form-acciones-rol">

        <button
          type="button"
          className="btn-cancelar-rol"
          onClick={onCancelar}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn-guardar-rol"
        >
          {modo === "editar"
            ? "Guardar cambios"
            : "Registrar rol"}
        </button>

      </div>
    </form>
  );
}