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

export default function ConsultarRol() {
  const navigate = useNavigate();
  const { id } = useParams();

  const rol = roles.find(
    (item) => item.id_rol === Number(id)
  );

  return (
    <div className="roles-page">

      <div className="roles-header">
        <div>
          <h1>Consultar rol</h1>

          <p>
            Consulta la información del rol seleccionado
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

      {rol ? (
        <div className="rol-form">

          <section className="form-seccion">

            <div className="form-seccion-titulo">
              <h2>Información del rol</h2>

              <p>
                Datos registrados del rol
              </p>
            </div>

            <div className="rol-detalle-grid">

              <div className="dato-rol">
                <span>
                  Nombre del rol
                </span>

                <strong>
                  {rol.nombre}
                </strong>
              </div>

            </div>
          </section>

          <div className="consulta-acciones-rol">

            <button
              type="button"
              className="btn-cancelar-rol"
              onClick={() => navigate("/roles")}
            >
              Volver
            </button>

          </div>

        </div>
      ) : (
        <div className="sin-roles">

          <h3>
            Rol no encontrado
          </h3>

          <p>
            El rol que deseas consultar no existe.
          </p>

        </div>
      )}

    </div>
  );
}