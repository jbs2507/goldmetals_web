import { useNavigate, useParams } from "react-router-dom";
import { formatearFecha, textoCompra, textoVenta } from "../../data/insumosVinculos.js";

const insumosOro = [
  {
    id_insumo: 1,
    tipo_insumo: "ORO",
    nombre: "Oro",
    unidad_medida: "g",
    fecha_ingreso: "2026-09-23",
    compra_asociada: "001",
    venta_asociada: null,
  },
  {
    id_insumo: 2,
    tipo_insumo: "ORO",
    nombre: "Oro en polvo",
    unidad_medida: "g",
    fecha_ingreso: "2026-09-22",
    compra_asociada: "002",
    venta_asociada: null,
  },
  {
    id_insumo: 3,
    tipo_insumo: "ORO",
    nombre: "Oro en lingote",
    unidad_medida: "kg",
    fecha_ingreso: "2026-09-20",
    compra_asociada: "001",
    venta_asociada: 1,
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

export default function ConsultarInsumoOro() {
  const navigate = useNavigate();
  const { id } = useParams();

  const insumo = insumosOro.find(
    (item) => item.id_insumo === Number(id)
  );

  if (!insumo) {
    return (
      <div className="insumos-oro-page">

        <div className="sin-insumos-oro">

          <h3>
            Insumo no encontrado
          </h3>

          <p>
            El insumo de oro solicitado no existe.
          </p>

          <button
            className="btn-volver-insumo-oro"
            onClick={() => navigate("/insumos-oro")}
          >
            Volver
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="insumos-oro-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="insumos-oro-header">

        <div>

          <h1>
            Consultar insumo de oro
          </h1>

          <p>
            Información detallada del insumo registrado
          </p>

        </div>

        <button
          className="btn-volver-insumo-oro"
          onClick={() => navigate("/insumos-oro")}
        >
          Volver
        </button>

      </div>

      {/* =====================================================
          INFORMACIÓN DEL INSUMO
      ===================================================== */}

      <div className="insumo-oro-form">

        <section className="form-seccion">

          <div className="form-seccion-titulo">

            <h2>
              Información del insumo
            </h2>

            <p>
              Datos principales del insumo de oro
            </p>

          </div>

          <div className="insumo-oro-detalle-grid">

            <div className="dato-insumo-oro">

              <span>
                Tipo de insumo
              </span>

              <strong>
                Oro
              </strong>

            </div>

            <div className="dato-insumo-oro">

              <span>
                Nombre
              </span>

              <strong>
                {insumo.nombre}
              </strong>

            </div>

            <div className="dato-insumo-oro">

              <span>
                Unidad de medida
              </span>

              <strong>
                {formatearUnidad(
                  insumo.unidad_medida
                )}
              </strong>

            </div>

            <div className="dato-insumo-oro">
              <span>Fecha de ingreso</span>
              <strong>{formatearFecha(insumo.fecha_ingreso)}</strong>
            </div>

            <div className="dato-insumo-oro">
              <span>Compra asociada</span>
              <strong>{textoCompra(insumo.compra_asociada)}</strong>
            </div>

            <div className="dato-insumo-oro">
              <span>Venta asociada</span>
              <strong>{textoVenta(insumo.venta_asociada)}</strong>
            </div>

          </div>

        </section>

        {/* =================================================
            ACCIONES
        ================================================= */}

        <div className="consulta-acciones-insumo-oro">

          <button
            className="btn-volver-insumo-oro"
            onClick={() => navigate("/insumos-oro")}
          >
            Volver a insumos
          </button>

        </div>

      </div>

    </div>
  );
}