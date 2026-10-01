import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonEliminar from "../../components/BotonEliminar";

const insumosOroIniciales = [
  {
    id_insumo: 1,
    tipo_insumo: "ORO",
    nombre: "Oro",
    cantidad: 500,
    unidad_medida: "g",
    estado: "ACTIVO",
  },
  {
    id_insumo: 2,
    tipo_insumo: "ORO",
    nombre: "Oro en polvo",
    cantidad: 250,
    unidad_medida: "g",
    estado: "ACTIVO",
  },
  {
    id_insumo: 3,
    tipo_insumo: "ORO",
    nombre: "Oro en lingote",
    cantidad: 2,
    unidad_medida: "kg",
    estado: "INACTIVO",
  },
];

const formatearUnidad = (unidad) => {
  const unidades = {
    g: "Gramos (g)",
    kg: "Kilogramos (kg)",
    oz: "Onzas (oz)",
    lb: "Libras (lb)",
  };

  return unidades[unidad] || unidad;
};

export default function InsumosOro() {
  const navigate = useNavigate();

  const [insumos, setInsumos] = useState(
    insumosOroIniciales
  );

  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("TODOS");

  const eliminarInsumo = (id) => {
    setInsumos((actuales) =>
      actuales.filter((i) => i.id_insumo !== id)
    );
  };

  const insumosFiltrados = insumos.filter((insumo) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      insumo.nombre.toLowerCase().includes(texto);

    const coincideEstado =
      estado === "TODOS" ||
      insumo.estado === estado;

    return coincideBusqueda && coincideEstado;
  });

  const totalInsumos = insumos.length;

  const insumosActivos = insumos.filter(
    (insumo) => insumo.estado === "ACTIVO"
  ).length;

  const insumosInactivos = insumos.filter(
    (insumo) => insumo.estado === "INACTIVO"
  ).length;

  return (
    <div className="insumos-oro-page">

      {/* ENCABEZADO */}
      <div className="insumos-oro-header">
        <div>
          <h1>Insumos de oro</h1>

          <p>
            Gestión de insumos de oro registrados
          </p>
        </div>

        <button
          className="btn-registrar-insumo-oro"
          onClick={() =>
            navigate("/insumos-oro/registrar")
          }
        >
          + Registrar insumo
        </button>
      </div>

      {/* FILTROS */}
      <div className="insumos-oro-filtros">

        <div className="campo-busqueda-insumo-oro">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
          />
        </div>

        <select
          value={estado}
          onChange={(e) =>
            setEstado(e.target.value)
          }
        >
          <option value="TODOS">
            Todos los estados
          </option>

          <option value="ACTIVO">
            Activo
          </option>

          <option value="INACTIVO">
            Inactivo
          </option>
        </select>

      </div>

      {/* RESUMEN */}
      <div className="insumos-oro-resumen">

        <div className="resumen-insumo-oro-item">
          <span>Total insumos</span>

          <strong>
            {totalInsumos}
          </strong>
        </div>

        <div className="resumen-insumo-oro-item">
          <span>Activos</span>

          <strong>
            {insumosActivos}
          </strong>
        </div>

        <div className="resumen-insumo-oro-item">
          <span>Inactivos</span>

          <strong>
            {insumosInactivos}
          </strong>
        </div>

      </div>

      {/* LISTA */}
      <div className="insumos-oro-lista">

        {insumosFiltrados.length === 0 ? (

          <div className="sin-insumos-oro">

            <h3>
              No se encontraron insumos
            </h3>

            <p>
              Intenta cambiar los filtros de búsqueda.
            </p>

          </div>

        ) : (

          insumosFiltrados.map((insumo) => (

            <div
              className="insumo-oro-card"
              key={insumo.id_insumo}
            >

              {/* CABECERA */}
              <div className="insumo-oro-card-header">

                <div>

                  <span className="insumo-oro-label">
                    Insumo
                  </span>

                  <h2>
                    {insumo.nombre}
                  </h2>

                </div>

                <span
                  className={`estado-insumo-oro ${
                    insumo.estado === "ACTIVO"
                      ? "estado-insumo-oro-activo"
                      : "estado-insumo-oro-inactivo"
                  }`}
                >
                  {insumo.estado}
                </span>

              </div>

              {/* INFORMACIÓN */}
              <div className="insumo-oro-card-body">

                <div className="dato-insumo-oro">
                  <span>Tipo de insumo</span>

                  <strong>
                    Oro
                  </strong>
                </div>

                <div className="dato-insumo-oro">
                  <span>Nombre</span>

                  <strong>
                    {insumo.nombre}
                  </strong>
                </div>

                <div className="dato-insumo-oro">
                  <span>Cantidad</span>

                  <strong>
                    {insumo.cantidad}
                  </strong>
                </div>

                <div className="dato-insumo-oro">
                  <span>Unidad de medida</span>

                  <strong>
                    {formatearUnidad(
                      insumo.unidad_medida
                    )}
                  </strong>
                </div>

              </div>

              {/* ACCIONES */}
              <div className="insumo-oro-card-actions">

                <button
                  className="btn-consultar-insumo-oro"
                  onClick={() =>
                    navigate(
                      `/insumos-oro/consultar/${insumo.id_insumo}`
                    )
                  }
                >
                  Consultar
                </button>

                <button
                  className="btn-editar-insumo-oro"
                  onClick={() =>
                    navigate(
                      `/insumos-oro/editar/${insumo.id_insumo}`
                    )
                  }
                >
                  Editar
                </button>

                <BotonEliminar
                  entidad="insumo de oro"
                  nombre={insumo.nombre}
                  onConfirmar={() => eliminarInsumo(insumo.id_insumo)}
                />

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}