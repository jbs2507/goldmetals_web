import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProveedorForm from "../../components/proveedores/ProveedorForm";

const ConsultarProveedor = () => {
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

  return (
    <div className="proveedores-page">

      <div className="proveedores-header">
        <div>
          <h1>
            Consultar proveedor
          </h1>

          <p>
            Información detallada del proveedor
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
        modo="consultar"
        proveedor={proveedor}
      />

      <div className="consulta-acciones-proveedor">
      </div>

    </div>
  );
};

export default ConsultarProveedor;