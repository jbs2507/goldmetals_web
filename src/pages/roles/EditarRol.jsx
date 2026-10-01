import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const roles = [
  {
    id_rol: 1,
    nombre: "Administrador",
  },
  {
    id_rol: 2,
    nombre: "Jefe de compras",
  },
  {
    id_rol: 3,
    nombre: "Analista de producción",
  },
  {
    id_rol: 4,
    nombre: "Auxiliar de logística",
  },
];

export default function EditarRol() {
  const navigate = useNavigate();
  const { id } = useParams();

  const rol = roles.find(
    (item) => item.id_rol === Number(id)
  );

  const [nombre, setNombre] = useState(
    rol?.nombre || ""
  );

  const manejarSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      return;
    }

    const rolActualizado = {
      id_rol: Number(id),
      nombre: nombre.trim(),
    };

    console.log("Rol actualizado:", rolActualizado);

    navigate("/roles");
  };

  if (!rol) {
    return (
      <div className="roles-page">

        <div className="sin-roles">
          <h3>Rol no encontrado</h3>

          <p>
            El rol que deseas editar no existe.
          </p>
        </div>

        <div className="consulta-acciones-rol">
          <button
            type="button"
            className="btn-volver-rol"
            onClick={() => navigate("/roles")}
          >
            Volver
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="roles-page">

      <div className="roles-header">
        <div>
          <h1>Editar rol</h1>

          <p>
            Actualiza la información del rol
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
              Modifica el nombre del rol
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
            Guardar cambios
          </button>

        </div>
      </form>

    </div>
  );
}