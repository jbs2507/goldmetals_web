import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import CompraForm from "../../components/compras/CompraForm";

const EditarCompra = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Datos temporales del frontend
  // Posteriormente estos datos vendrán del backend.
  const compra = {
    id: id,
    fechaCompra: "2026-09-23",
    idProveedor: "1",
    idAcopio: "1",
    moneda: "COP",
    tasaCambio: "1",
    idInsumo: "1",
    peso: "500",
    ley: "90",
    precioUnitario: "10000",
    valorRegalias: "500000",
    estado: "REGISTRADA",
    certificadoOrigen: "certificado_origen.pdf",
    resultadoLaboratorio: "resultado_laboratorio.pdf",
    factura: "factura.pdf",
  };

  const actualizarCompra = (datosCompra) => {
    console.log("Compra actualizada:", {
      id: compra.id,
      ...datosCompra,
    });

    alert("Compra actualizada correctamente");

    navigate(`/compras/consultar/${compra.id}`);
  };

  return (
    <div className="compras-page">

      {/* ENCABEZADO */}
      <div className="compras-header">
        <div>
          <h1>
            Editar compra #{compra.id}
          </h1>

          <p>
            Actualiza la información registrada de la compra
          </p>
        </div>

        <button
          type="button"
          className="btn-volver-compra"
          onClick={() =>
            navigate(`/compras/consultar/${compra.id}`)
          }
        >
          ← Volver
        </button>
      </div>

      {/* FORMULARIO */}
      <CompraForm
        compraInicial={compra}
        onSubmit={actualizarCompra}
        onCancel={() =>
          navigate(`/compras/consultar/${compra.id}`)
        }
      />

    </div>
  );
};

export default EditarCompra;