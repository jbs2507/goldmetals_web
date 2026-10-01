import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProduccionForm from "../../components/produccion/ProduccionForm";

const EditarProduccion = () => {
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

  const actualizarProduccion = (e) => {
    const datos = new FormData(e.target);

    console.log(
      "Producción actualizada:",
      Object.fromEntries(datos.entries())
    );

    navigate("/produccion");
  };

  return (
    <div className="produccion-page">
      <div className="produccion-header">
        <div>
          <h1>Editar producción</h1>
          <p>
            Actualice la información de la producción #{id}
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
        modo="editar"
        produccion={produccion}
        onSubmit={actualizarProduccion}
        onCancelar={() => navigate("/produccion")}
      />
    </div>
  );
};

export default EditarProduccion;