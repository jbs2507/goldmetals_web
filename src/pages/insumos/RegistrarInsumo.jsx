import { useNavigate } from "react-router-dom";
import InsumoPolimetalicoForm from "../../components/insumosPolimetalicos/InsumoPolimetalicoForm.jsx";

// Solo se registran manualmente los insumos polimetálicos.
// El oro aumenta con las compras y disminuye con las ventas.
export default function RegistrarInsumo() {
  const navigate = useNavigate();

  const guardarInsumo = (datos) => {
    console.log("Insumo polimetálico registrado:", datos);
    navigate("/insumos");
  };

  const cancelar = () => navigate("/insumos");

  return (
    <div className="insumos-page">
      <div className="insumos-header">
        <div>
          <h1>Registrar insumo polimetálico</h1>
        </div>

        <button type="button" className="btn-volver-insumo" onClick={cancelar}>
          Volver
        </button>
      </div>

      <InsumoPolimetalicoForm
        modo="registrar"
        onGuardar={guardarInsumo}
        onCancelar={cancelar}
      />
    </div>
  );
}
