import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonEliminar from "../../components/BotonEliminar";

const rolesIniciales = [
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

export default function Roles() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState(rolesIniciales);
  const [busqueda, setBusqueda] = useState("");

  const eliminarRol = (id) => {
    setRoles((actuales) =>
      actuales.filter((r) => r.id_rol !== id)
    );
  };

  const rolesFiltrados = roles.filter((rol) => {
    const texto = busqueda.toLowerCase().trim();

    return rol.nombre.toLowerCase().includes(texto);
  });

  return (
    <div className="roles-page">

      {/* ENCABEZADO */}
      <div className="roles-header">
        <div>
          <h1>Roles</h1>

          <p>
            Gestión de roles y permisos del sistema
          </p>
        </div>

        <button
          type="button"
          className="btn-registrar-rol"
          onClick={() => navigate("/roles/registrar")}
        >
          + Registrar rol
        </button>
      </div>

      {/* FILTROS */}
      <div className="roles-filtros">
        <div className="campo-busqueda-rol">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* RESUMEN */}
      <div className="roles-resumen">
        <div className="resumen-rol-item">
          <span>Total roles</span>

          <strong>
            {roles.length}
          </strong>
        </div>
      </div>

      {/* LISTA */}
      <div className="roles-lista">

        {rolesFiltrados.length === 0 ? (
          <div className="sin-roles">
            <h3>
              No se encontraron roles
            </h3>

            <p>
              Intenta realizar otra búsqueda.
            </p>
          </div>
        ) : (
          rolesFiltrados.map((rol) => (
            <div
              className="rol-card"
              key={rol.id_rol}
            >

              {/* CABECERA */}
              <div className="rol-card-header">
                <div>
                  <span className="rol-label">
                    Rol
                  </span>

                  <h2>
                    {rol.nombre}
                  </h2>
                </div>
              </div>

              {/* INFORMACIÓN */}
              <div className="rol-card-body">
                <div className="dato-rol">
                  <span>
                    Nombre del rol
                  </span>

                  <strong>
                    {rol.nombre}
                  </strong>
                </div>
              </div>

              {/* ACCIONES */}
              <div className="rol-card-actions">

                <button
                  type="button"
                  className="btn-consultar-rol"
                  onClick={() =>
                    navigate(
                      `/roles/consultar/${rol.id_rol}`
                    )
                  }
                >
                  Consultar
                </button>

                <button
                  type="button"
                  className="btn-editar-rol"
                  onClick={() =>
                    navigate(
                      `/roles/editar/${rol.id_rol}`
                    )
                  }
                >
                  Editar
                </button>

                <BotonEliminar
                  entidad="rol"
                  nombre={rol.nombre}
                  onConfirmar={() => eliminarRol(rol.id_rol)}
                />

              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}