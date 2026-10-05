import { useNavigate, useParams } from "react-router-dom";
import { formatearFecha, textoCompra, textoVenta } from "../../data/insumosVinculos.js";

const insumosPolimetalicos = [
  {
    id_insumo: 1,
    tipo_insumo: "POLIMETALICO",
    nombre: "Arena polimetálica",
    unidad_medida: "kg",
    fecha_ingreso: "2026-09-22",
    compra_asociada: "002",
    venta_asociada: null,
    mina: "Mina Chocó",
  },
  {
    id_insumo: 2,
    tipo_insumo: "POLIMETALICO",
    nombre: "Arena polimetálica fina",
    unidad_medida: "kg",
    fecha_ingreso: "2026-09-23",
    compra_asociada: "001",
    venta_asociada: null,
    mina: "Mina Bolívar",
  },
  {
    id_insumo: 3,
    tipo_insumo: "POLIMETALICO",
    nombre: "Material polimetálico de acopio",
    unidad_medida: "kg",
    fecha_ingreso: "2026-09-20",
    compra_asociada: "001",
    venta_asociada: 2,
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
              <span>Fecha de ingreso</span>
              <strong>{formatearFecha(insumo.fecha_ingreso)}</strong>
            </div>

            <div className="dato-insumo-polimetalico">
              <span>Compra asociada</span>
              <strong>{textoCompra(insumo.compra_asociada)}</strong>
            </div>

            <div className="dato-insumo-polimetalico">
              <span>Venta asociada</span>
              <strong>{textoVenta(insumo.venta_asociada)}</strong>
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