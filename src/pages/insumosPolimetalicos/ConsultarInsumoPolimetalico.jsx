import { useNavigate, useParams } from "react-router-dom";

const insumosPolimetalicos = [
  {
    id_insumo: 1,
    tipo_insumo: "POLIMETALICO",
    nombre: "Arena polimetálica",
    unidad_medida: "kg",
    estado: "ACTIVO",
    mina: "Mina Chocó",
  },
  {
    id_insumo: 2,
    tipo_insumo: "POLIMETALICO",
    nombre: "Arena polimetálica fina",
    unidad_medida: "kg",
    estado: "ACTIVO",
    mina: "Mina Bolívar",
  },
  {
    id_insumo: 3,
    tipo_insumo: "POLIMETALICO",
    nombre: "Material polimetálico de acopio",
    unidad_medida: "kg",
    estado: "INACTIVO",
    mina: "Acopio",
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

export default function ConsultarInsumoPolimetalico() {
  const navigate = useNavigate();
  const { id } = useParams();

  const insumo = insumosPolimetalicos.find(
    (item) =>
      item.id_insumo === Number(id)
  );

  if (!insumo) {
    return (
      <div className="insumos-polimetalicos-page">
        <div className="sin-insumos-polimetalicos">
          <h3>Insumo no encontrado</h3>

          <p>
            El insumo polimetálico solicitado
            no existe.
          </p>

          <button
            className="btn-volver-insumo-polimetalico"
            onClick={() =>
              navigate("/insumos-polimetalicos")
            }
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="insumos-polimetalicos-page">
      <div className="insumos-polimetalicos-header">
        <div>
          <h1>
            Consultar insumo polimetálico
          </h1>

          <p>
            Información detallada del insumo
            registrado
          </p>
        </div>

        <button
          className="btn-volver-insumo-polimetalico"
          onClick={() =>
            navigate("/insumos-polimetalicos")
          }
        >
          Volver
        </button>
      </div>

      <div className="insumo-polimetalico-form">
        <section className="form-seccion">
          <div className="form-seccion-titulo">
            <h2>
              Información del insumo
            </h2>

            <p>
              Datos principales del material
              polimetálico
            </p>
          </div>

          <div className="insumo-polimetalico-detalle-grid">
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
              <span>Estado</span>
              <strong>
                {insumo.estado}
              </strong>
            </div>
          </div>
        </section>

        <div className="consulta-acciones-insumo-polimetalico">
          <button
            className="btn-volver-insumo-polimetalico"
            onClick={() =>
              navigate("/insumos-polimetalicos")
            }
          >
            Volver a insumos
          </button>
        </div>
      </div>
    </div>
  );
}