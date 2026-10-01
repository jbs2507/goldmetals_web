import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonEliminar from "../../components/BotonEliminar";

const insumosPolimetalicosIniciales = [
  {
    id_insumo: 1,
    tipo_insumo: "POLIMETALICO",
    nombre: "Arena polimetálica",
    cantidad: 500,
    unidad_medida: "kg",
    estado: "ACTIVO",
    mina: "Mina Chocó",
    acopio: "Acopio principal",
  },
  {
    id_insumo: 2,
    tipo_insumo: "POLIMETALICO",
    nombre: "Arena polimetálica fina",
    cantidad: 250,
    unidad_medida: "kg",
    estado: "ACTIVO",
    mina: "Mina Bolívar",
    acopio: "Acopio Bolívar",
  },
  {
    id_insumo: 3,
    tipo_insumo: "POLIMETALICO",
    nombre: "Material polimetálico de acopio",
    cantidad: 100,
    unidad_medida: "kg",
    estado: "INACTIVO",
    mina: "Mina Chocó",
    acopio: "Acopio Chocó",
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

export default function InsumosPolimetalicos() {
  const navigate = useNavigate();

  const [insumos, setInsumos] = useState(
    insumosPolimetalicosIniciales
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
      insumo.nombre.toLowerCase().includes(texto) ||
      insumo.mina.toLowerCase().includes(texto) ||
      insumo.acopio.toLowerCase().includes(texto);

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
    <div className="insumos-polimetalicos-page">

      {/* ENCABEZADO */}
      <div className="insumos-polimetalicos-header">
        <div>
          <h1>Insumos de materiales polimetálicos</h1>

          <p>
            Gestión de insumos de materiales polimetálicos registrados
          </p>
        </div>

        <button
          className="btn-registrar-insumo-polimetalico"
          onClick={() =>
            navigate("/insumos-polimetalicos/registrar")
          }
        >
          + Registrar insumo
        </button>
      </div>

      {/* FILTROS */}
      <div className="insumos-polimetalicos-filtros">

        <div className="campo-busqueda-insumo-polimetalico">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar por nombre, mina o acopio"
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
      <div className="insumos-polimetalicos-resumen">

        <div className="resumen-insumo-polimetalico-item">
          <span>Total insumos</span>
          <strong>{totalInsumos}</strong>
        </div>

        <div className="resumen-insumo-polimetalico-item">
          <span>Activos</span>
          <strong>{insumosActivos}</strong>
        </div>

        <div className="resumen-insumo-polimetalico-item">
          <span>Inactivos</span>
          <strong>{insumosInactivos}</strong>
        </div>

      </div>

      {/* LISTA */}
      <div className="insumos-polimetalicos-lista">

        {insumosFiltrados.length === 0 ? (

          <div className="sin-insumos-polimetalicos">
            <h3>No se encontraron insumos</h3>

            <p>
              Intenta cambiar los filtros de búsqueda.
            </p>
          </div>

        ) : (

          insumosFiltrados.map((insumo) => (

            <div
              className="insumo-polimetalico-card"
              key={insumo.id_insumo}
            >

              {/* CABECERA DE LA TARJETA */}
              <div className="insumo-polimetalico-card-header">

                <div>
                  <span className="insumo-polimetalico-label">
                    Insumo
                  </span>

                  <h2>
                    {insumo.nombre}
                  </h2>
                </div>

                <span
                  className={`estado-insumo-polimetalico ${
                    insumo.estado === "ACTIVO"
                      ? "estado-insumo-polimetalico-activo"
                      : "estado-insumo-polimetalico-inactivo"
                  }`}
                >
                  {insumo.estado}
                </span>

              </div>

              {/* INFORMACIÓN */}
              <div className="insumo-polimetalico-card-body">

                <div className="dato-insumo-polimetalico">
                  <span>Tipo de insumo</span>

                  <strong>
                    Material polimetálico
                  </strong>
                </div>

                <div className="dato-insumo-polimetalico">
                  <span>Nombre</span>

                  <strong>
                    {insumo.nombre}
                  </strong>
                </div>

                <div className="dato-insumo-polimetalico">
                  <span>Cantidad</span>

                  <strong>
                    {insumo.cantidad}{" "}
                    {formatearUnidad(insumo.unidad_medida)}
                  </strong>
                </div>

                <div className="dato-insumo-polimetalico">
                  <span>Unidad de medida</span>

                  <strong>
                    {formatearUnidad(
                      insumo.unidad_medida
                    )}
                  </strong>
                </div>

                <div className="dato-insumo-polimetalico">
                  <span>Mina de origen</span>

                  <strong>
                    {insumo.mina}
                  </strong>
                </div>

                <div className="dato-insumo-polimetalico">
                  <span>Acopio</span>

                  <strong>
                    {insumo.acopio}
                  </strong>
                </div>

              </div>

              {/* ACCIONES */}
              <div className="insumo-polimetalico-card-actions">

                <button
                  className="btn-consultar-insumo-polimetalico"
                  onClick={() =>
                    navigate(
                      `/insumos-polimetalicos/consultar/${insumo.id_insumo}`
                    )
                  }
                >
                  Consultar
                </button>

                <button
                  className="btn-editar-insumo-polimetalico"
                  onClick={() =>
                    navigate(
                      `/insumos-polimetalicos/editar/${insumo.id_insumo}`
                    )
                  }
                >
                  Editar
                </button>

                <BotonEliminar
                  entidad="insumo polimetálico"
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
