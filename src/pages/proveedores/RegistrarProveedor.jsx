import React from "react";
import { useNavigate } from "react-router-dom";

import ProveedorForm from "../../components/proveedores/ProveedorForm";

const RegistrarProveedor = () => {
  const navigate = useNavigate();

  const guardarProveedor = (e) => {
    const datos = new FormData(e.target);

    console.log(
      "Proveedor registrado:",
      Object.fromEntries(datos.entries())
    );

    navigate("/proveedores");
  };

  return (
    <div className="proveedores-page">
      <div className="proveedores-header">
        <div>
          <h1>Registrar proveedor</h1>

          <p>
            Registre la información legal, comercial y de contacto
            del proveedor.
          </p>
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
        modo="registrar"
        onSubmit={guardarProveedor}
        onCancelar={() => navigate("/proveedores")}
      />
    </div>
  );
};

export default RegistrarProveedor;