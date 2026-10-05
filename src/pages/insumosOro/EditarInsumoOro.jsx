import { useNavigate, useParams } from "react-router-dom";
import InsumoOroForm from "../../components/insumosOro/InsumoOroForm.jsx";

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

export default function EditarInsumoOro() {
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
            El insumo de oro que deseas editar no existe.
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

  const actualizarInsumo = (datos) => {
    console.log(
      "Insumo de oro actualizado:",
      {
        id_insumo: insumo.id_insumo,
        ...datos,
      }
    );

    navigate("/insumos-oro");
  };

  return (
    <div className="insumos-oro-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="insumos-oro-header">

        <div>

          <h1>
            Editar insumo de oro
          </h1>

          <p>
            Actualiza la información del insumo registrado
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
          FORMULARIO
      ===================================================== */}

      <InsumoOroForm
        modo="editar"
        datosIniciales={insumo}
        onGuardar={actualizarInsumo}
        onCancelar={() => navigate("/insumos-oro")}
      />

    </div>
  );
}