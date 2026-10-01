import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrarRol() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      return;
    }

    const nuevoRol = {
      nombre: nombre.trim(),
    };

    console.log("Rol registrado:", nuevoRol);

    navigate("/roles");
  };

  return (
    <div className="roles-page">

      <div className="roles-header">
        <div>
          <h1>Registrar rol</h1>

          <p>
            Registra un nuevo rol en el sistema
          </p>
        </div>

        <button
          type="button"
          className="btn-volver-rol"
          onClick={() => navigate("/roles")}
        >
          Volver
        </button>
      </div>

      <form
        className="rol-form"
        onSubmit={manejarSubmit}
      >
        <section className="form-seccion">

          <div className="form-seccion-titulo">
            <h2>Información del rol</h2>

            <p>
              Ingresa el nombre del nuevo rol
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
                  setNombre(e.target.value)
                }
                required
              />
            </div>

          </div>
        </section>

        <div className="form-acciones-rol">

          <button
            type="button"
            className="btn-cancelar-rol"
            onClick={() => navigate("/roles")}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-guardar-rol"
          >
            Registrar rol
          </button>

        </div>
      </form>
    </div>
  );
}