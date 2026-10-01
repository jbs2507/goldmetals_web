import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProduccionForm from "../../components/produccion/ProduccionForm";

const ConsultarProduccion = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const produccion = {
    id: id,
    id_orden_produccion: 1,
    id_acopio: 1,
    insumo: "Material polimetálico",
    cantidad: "500 kg",
    fecha: "23/09/2026",
    cliente: "Cliente 1",
      pedido: "Pedido 001",
      mina: "Mina principal",
  };

  return (
    <div className="produccion-page">
      <div className="produccion-header">
        <div>
          <h1>Consultar producción</h1>
          <p>
            Información detallada de la producción #{id}
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
        modo="consultar"
        produccion={produccion}
      />

      <div className="consulta-acciones-produccion">
      </div>
    </div>
  );
};

export default ConsultarProduccion;