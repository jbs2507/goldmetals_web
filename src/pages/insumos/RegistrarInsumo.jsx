import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InsumoOroForm from "../../components/insumosOro/InsumoOroForm.jsx";
import InsumoPolimetalicoForm from "../../components/insumosPolimetalicos/InsumoPolimetalicoForm.jsx";

export default function RegistrarInsumo() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("");

  const guardarInsumo = (datos) => {
    console.log("Insumo registrado:", datos);
    navigate("/insumos");
  };

  const cancelar = () => navigate("/insumos");

  return (
    <div className="insumos-page">
      <div className="insumos-header">
        <div>
          <h1>Registrar insumo</h1>
          <p>Selecciona primero el tipo de insumo que deseas registrar</p>
        </div>

        <button type="button" className="btn-volver-insumo" onClick={cancelar}>
          Volver
        </button>
      </div>

      <section className="selector-tipo-insumo">
        <div className="selector-tipo-insumo-titulo">
          <h2>Tipo de insumo</h2>
          <p>Según la opción seleccionada se mostrará el formulario correspondiente.</p>
        </div>

        <div className="form-campo selector-tipo-insumo-campo">
          <label htmlFor="tipo-insumo-registro">Selecciona el tipo de insumo</label>
          <select
            id="tipo-insumo-registro"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Seleccionar tipo de insumo</option>
            <option value="ORO">Insumo de oro</option>
            <option value="POLIMETALICO">Insumo polimetálico</option>
          </select>
        </div>
      </section>

      {tipo === "ORO" && (
        <InsumoOroForm
          modo="registrar"
          onGuardar={guardarInsumo}
          onCancelar={cancelar}
        />
      )}

      {tipo === "POLIMETALICO" && (
        <InsumoPolimetalicoForm
          modo="registrar"
          onGuardar={guardarInsumo}
          onCancelar={cancelar}
        />
      )}

      {!tipo && (
        <div className="mensaje-seleccion-insumo">
          <strong>Selecciona un tipo de insumo</strong>
          <span>El formulario aparecerá aquí después de seleccionar Oro o Material polimetálico.</span>
        </div>
      )}
    </div>
  );
}
