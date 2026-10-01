import React from "react";
import { useNavigate } from "react-router-dom";
import ProduccionForm from "../../components/produccion/ProduccionForm";

const RegistrarProduccion = () => {
  const navigate = useNavigate();

  const guardarProduccion = (e) => {
    const datos = new FormData(e.target);

    console.log(
      "Producción registrada:",
      Object.fromEntries(datos.entries())
    );

    navigate("/produccion");
  };

  return (
    <div className="produccion-page">
      <div className="produccion-header">
        <div>
          <h1>Registrar producción</h1>
          <p>
            Registre la información correspondiente a la producción.
          </p>
        </div>

        <button
          type="button"
          className="btn-volver-produccion"
          onClick={() => navigate("/produccion")}
        >
          ← Volver
        </button>
      </div>

      <ProduccionForm
        modo="registrar"
        onSubmit={guardarProduccion}
        onCancelar={() => navigate("/produccion")}
      />
    </div>
  );
};

export default RegistrarProduccion;