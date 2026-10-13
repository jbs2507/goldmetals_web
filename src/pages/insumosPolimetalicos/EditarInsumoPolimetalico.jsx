import { useNavigate, useParams } from "react-router-dom";
import InsumoPolimetalicoForm from "../../components/insumosPolimetalicos/InsumoPolimetalicoForm.jsx";
import { useAlmacen, actualizarRegistro } from "../../utils/almacen.js";
import { CLAVES, INSUMOS_POLI_SEMILLA } from "../../data/semillas.js";


export default function EditarInsumoPolimetalico() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [insumosPolimetalicos] = useAlmacen(CLAVES.insumosPoli, INSUMOS_POLI_SEMILLA);

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
            El insumo polimetálico que deseas
            editar no existe.
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

  const actualizarInsumo = (datos) => {
    actualizarRegistro(CLAVES.insumosPoli, INSUMOS_POLI_SEMILLA, "id_insumo", insumo.id_insumo, datos);
    navigate("/insumos-polimetalicos");
  };

  return (
    <div className="insumos-polimetalicos-page">
      <div className="insumos-polimetalicos-header">
        <div>
          <h1>
            Editar insumo polimetálico
          </h1>
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

      <InsumoPolimetalicoForm
        modo="editar"
        datosIniciales={insumo}
        onGuardar={actualizarInsumo}
        onCancelar={() =>
          navigate("/insumos-polimetalicos")
        }
      />
    </div>
  );
}