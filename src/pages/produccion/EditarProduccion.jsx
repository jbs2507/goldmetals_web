import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProduccionForm from "../../components/produccion/ProduccionForm";
import HistorialProduccion from "../../components/produccion/HistorialProduccion.jsx";
import { produccionesMock, fechaAISO } from "../../data/produccionesMock.js";

const EditarProduccion = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const encontrada = produccionesMock.find((p) => p.id === id);

  if (!encontrada) {
    return (
      <div className="produccion-page">
        <div className="sin-producciones">
          <h3>Producción no encontrada</h3>
          <p>No fue posible encontrar la información solicitada.</p>
          <button
            type="button"
            className="btn-volver-produccion"
            onClick={() => navigate("/produccion")}
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  const produccion = { ...encontrada, fecha: fechaAISO(encontrada.fecha) };

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
        </div>

        <div className="produccion-header-acciones">
          <HistorialProduccion produccion={encontrada} />

          <button
            type="button"
            className="btn-volver-produccion"
            onClick={() => navigate("/produccion")}
          >
            ← Volver
          </button>
        </div>
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