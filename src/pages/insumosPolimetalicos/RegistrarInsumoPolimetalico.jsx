import { useNavigate } from "react-router-dom";
import InsumoPolimetalicoForm from "../../components/insumosPolimetalicos/InsumoPolimetalicoForm.jsx";

export default function RegistrarInsumoPolimetalico() {
  const navigate = useNavigate();

  const guardarInsumo = (datos) => {
    console.log(
      "Insumo polimetálico registrado:",
      datos
    );

    navigate("/insumos-polimetalicos");
  };

  return (
    <div className="insumos-polimetalicos-page">
      <div className="insumos-polimetalicos-header">
        <div>
          <h1>
            Registrar insumo polimetálico
          </h1>

          <p>
            Registra la información del nuevo
            material polimetálico
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

      <InsumoPolimetalicoForm
        modo="registrar"
        onGuardar={guardarInsumo}
        onCancelar={() =>
          navigate("/insumos-polimetalicos")
        }
      />
    </div>
  );
}