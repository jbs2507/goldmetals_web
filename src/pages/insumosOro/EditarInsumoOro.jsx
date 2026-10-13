import { useNavigate, useParams } from "react-router-dom";
import InsumoOroForm from "../../components/insumosOro/InsumoOroForm.jsx";
import { useAlmacen, actualizarRegistro } from "../../utils/almacen.js";
import { CLAVES, INSUMOS_ORO_SEMILLA } from "../../data/semillas.js";


export default function EditarInsumoOro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [insumosOro] = useAlmacen(CLAVES.insumosOro, INSUMOS_ORO_SEMILLA);

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
    actualizarRegistro(CLAVES.insumosOro, INSUMOS_ORO_SEMILLA, "id_insumo", insumo.id_insumo, datos);
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