import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProveedorForm from "../../components/proveedores/ProveedorForm";
import { actualizarRegistro, sinArchivos, useAlmacen } from "../../utils/almacen.js";
import { CLAVES, PROVEEDORES_SEMILLA } from "../../data/semillas.js";

const EditarProveedor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [proveedores] = useAlmacen(CLAVES.proveedores, PROVEEDORES_SEMILLA);
  const proveedor = proveedores.find((p) => p.id === id);

  if (!proveedor) {
    return (
      <div className="proveedores-page">
        <div className="sin-proveedores">
          <h3>Proveedor no encontrado</h3>
          <p>No fue posible encontrar la información solicitada.</p>
          <button type="button" className="btn-volver-proveedor" onClick={() => navigate("/proveedores")}>
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  const actualizarProveedor = (datos) => {
    actualizarRegistro(CLAVES.proveedores, PROVEEDORES_SEMILLA, "id", proveedor.id, sinArchivos(datos));

    navigate("/proveedores");
  };

  return (
    <div className="proveedores-page">

      <div className="proveedores-header">
        <div>
          <h1>
            Editar proveedor
          </h1>
        </div>

        <button
          type="button"
          className="btn-volver-proveedor"
          onClick={() => navigate("/proveedores")}
        >
          ← Volver
        </button>
      </div>

      <ProveedorForm
        modo="editar"
        proveedor={proveedor}
        onSubmit={actualizarProveedor}
        onCancelar={() => navigate("/proveedores")}
      />

    </div>
  );
};

export default EditarProveedor;