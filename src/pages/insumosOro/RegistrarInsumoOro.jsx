import { useNavigate } from "react-router-dom";
import InsumoOroForm from "../../components/insumosOro/InsumoOroForm.jsx";

export default function RegistrarInsumoOro() {
  const navigate = useNavigate();

  const guardarInsumo = (datos) => {
    console.log("Insumo de oro registrado:", datos);

    navigate("/insumos-oro");
  };

  return (
    <div className="insumos-oro-page">

      <div className="insumos-oro-header">

        <div>
          <h1>Registrar insumo de oro</h1>

          <p>
            Registra la información del nuevo insumo de oro
          </p>
        </div>

        <button
          className="btn-volver-insumo-oro"
          onClick={() => navigate("/insumos-oro")}
        >
          Volver
        </button>

      </div>

      <InsumoOroForm
        modo="registrar"
        onGuardar={guardarInsumo}
        onCancelar={() => navigate("/insumos-oro")}
      />

    </div>
  );
}