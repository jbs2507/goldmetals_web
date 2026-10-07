import React from "react";
import { useNavigate } from "react-router-dom";
import CompraForm from "../../components/compras/CompraForm";

const RegistrarCompra = () => {
  const navigate = useNavigate();

  const registrarCompra = (datosCompra) => {
    console.log("Compra registrada:", datosCompra);

    alert("Compra registrada correctamente");

    navigate("/compras");
  };

  return (
    <div className="compras-page">

      <div className="compras-header">
        <div>
          <h1>Registrar compra</h1>
        </div>

        <button
          type="button"
          className="btn-volver-compra"
          onClick={() => navigate("/compras")}
        >
          ← Volver
        </button>
      </div>

      <CompraForm
        onSubmit={registrarCompra}
        onCancel={() => navigate("/compras")}
      />

    </div>
  );
};

export default RegistrarCompra;