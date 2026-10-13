import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProduccionForm from "../../components/produccion/ProduccionForm";
import HistorialProduccion from "../../components/produccion/HistorialProduccion.jsx";
import { produccionesMock, fechaAISO, fechaDeISO } from "../../data/produccionesMock.js";
import { actualizarRegistro, useAlmacen } from "../../utils/almacen.js";
import { CLAVES } from "../../data/semillas.js";

const EditarProduccion = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [producciones] = useAlmacen(CLAVES.producciones, produccionesMock);
  const encontrada = producciones.find((p) => p.id === id);

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

  const actualizarProduccion = (datos) => {
    actualizarRegistro(CLAVES.producciones, produccionesMock, "id", encontrada.id, {
      id_orden_produccion: Number(datos.id_orden_produccion) || encontrada.id_orden_produccion,
      id_acopio: Number(datos.id_acopio) || encontrada.id_acopio,
      insumo: datos.insumo,
      cantidad: datos.cantidad,
      fecha: fechaDeISO(datos.fecha),
      cliente: datos.cliente,
      pedido: datos.pedido,
      mina: datos.mina,
    });

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