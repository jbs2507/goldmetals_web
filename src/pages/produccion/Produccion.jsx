import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProduccionCard from "../../components/produccion/ProduccionCard";
import ProduccionFiltros from "../../components/produccion/ProduccionFiltros";

const Produccion = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");

  const [producciones, setProducciones] = useState([
    {
      id: "001",
      id_orden_produccion: 1,
      id_acopio: 1,
      insumo: "Material polimetálico",
      cantidad: "500 kg",
      fecha: "23/09/2026",
      cliente: "Cliente 1",
      pedido: "Pedido 001",
      mina: "Mina principal",
    },
    {
      id: "002",
      id_orden_produccion: 2,
      id_acopio: 2,
      insumo: "Oro",
      cantidad: "250 g",
      fecha: "22/09/2026",
      cliente: "Cliente 1",
      pedido: "Pedido 001",
      mina: "Mina principal",
    },
    {
      id: "003",
      id_orden_produccion: 3,
      id_acopio: 3,
      insumo: "Material polimetálico",
      cantidad: "300 kg",
      fecha: "20/09/2026",
      cliente: "Cliente 1",
      pedido: "Pedido 001",
      mina: "Mina principal",
    },
  ]);

  const eliminarProduccion = (produccion) => {
    setProducciones((actuales) =>
      actuales.filter((p) => p.id !== produccion.id)
    );
  };

  const produccionesFiltradas = producciones.filter((produccion) => {
    const texto = busqueda.toLowerCase();

    return (
      produccion.insumo.toLowerCase().includes(texto) ||
      produccion.cliente.toLowerCase().includes(texto) ||
      produccion.pedido.toLowerCase().includes(texto) ||
      produccion.mina.toLowerCase().includes(texto) ||
      produccion.fecha.toLowerCase().includes(texto)
    );
  });

  const consultarProduccion = (produccion) => {
    navigate(`/produccion/consultar/${produccion.id}`);
  };

  const editarProduccion = (produccion) => {
    navigate(`/produccion/editar/${produccion.id}`);
  };

  return (
    <div className="produccion-page">
      <div className="produccion-header">
        <div>
          <h1>Producción</h1>
          <p>Registro y gestión de producción</p>
        </div>

        <button
          type="button"
          className="btn-registrar-produccion"
          onClick={() => navigate("/produccion/registrar")}
        >
          + Registrar producción
        </button>
      </div>

      <ProduccionFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />

      <div className="produccion-resumen">
        <div className="resumen-produccion-item">
          <span>Total de producciones</span>
          <strong>{producciones.length}</strong>
        </div>
      </div>

      <div className="producciones-lista">
        {produccionesFiltradas.length > 0 ? (
          produccionesFiltradas.map((produccion) => (
            <ProduccionCard
              key={produccion.id}
              produccion={produccion}
              onConsultar={consultarProduccion}
              onEditar={editarProduccion}
              onEliminar={eliminarProduccion}
            />
          ))
        ) : (
          <div className="sin-producciones">
            <h3>No se encontraron producciones</h3>
            <p>Intenta realizar otra búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Produccion;