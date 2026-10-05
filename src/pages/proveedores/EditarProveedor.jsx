import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProveedorForm from "../../components/proveedores/ProveedorForm";

const EditarProveedor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const proveedor = {
    id: id,
    razon_social: "Proveedor Minero Chocó",
    tipo_persona: "JURIDICA",
    tipo_documento: "NIT",
    numero_documento: "900123456",
    estado: "ACTIVO",
    camaraComercio: "camara_comercio.pdf",
    rut: "rut.pdf",
    certificadoRucom: "rucom.pdf",
  };

  const actualizarProveedor = (e) => {
    const datos = new FormData(e.target);

    console.log(
      "Proveedor actualizado:",
      Object.fromEntries(datos.entries())
    );

    navigate("/proveedores");
  };

  return (
    <div className="proveedores-page">

      <div className="proveedores-header">
        <div>
          <h1>
            Editar proveedor
          </h1>

          <p>
            Actualice la información del proveedor
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
        modo="editar"
        proveedor={proveedor}
        onSubmit={actualizarProveedor}
        onCancelar={() => navigate("/proveedores")}
      />

    </div>
  );
};

export default EditarProveedor;