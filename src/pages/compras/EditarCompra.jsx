import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import CompraForm from "../../components/compras/CompraForm";
import { actualizarRegistro, useAlmacen } from "../../utils/almacen.js";
import { CLAVES, COMPRAS_SEMILLA } from "../../data/semillas.js";
import { construirCompra } from "../../data/compras.js";
import { conEstado } from "../../utils/listados.js";

const EditarCompra = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [compras] = useAlmacen(CLAVES.compras, COMPRAS_SEMILLA);
  const compra = compras.find((c) => c.id === id);

  if (!compra) {
    return (
      <div className="compras-page">
        <div className="sin-compras">
          <h3>Compra no encontrada</h3>
          <p>No fue posible encontrar la información solicitada.</p>
          <button type="button" className="btn-volver-compra" onClick={() => navigate("/compras")}>
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  const actualizarCompra = (datosCompra) => {
    let actualizada = { ...compra, ...construirCompra(datosCompra), id: compra.id };
    // Si cambió el estado, queda registrado en el historial.
    if (datosCompra.estado && datosCompra.estado !== compra.estado) {
      actualizada = conEstado(actualizada, datosCompra.estado);
    }
    actualizarRegistro(CLAVES.compras, COMPRAS_SEMILLA, "id", compra.id, actualizada);

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