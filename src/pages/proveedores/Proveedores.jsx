import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProveedorCard from "../../components/proveedores/ProveedorCard";
import ProveedorFiltros from "../../components/proveedores/ProveedorFiltros";

const Proveedores = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");

  const [proveedores, setProveedores] = useState([
    {
      id: "001",
      razon_social: "Proveedor Minero Chocó",
      tipo_persona: "JURIDICA",
      numero_documento: "900123456",
      estado: "ACTIVO",
    },
    {
      id: "002",
      razon_social: "Proveedor Minero Bolívar",
      tipo_persona: "JURIDICA",
      numero_documento: "900234567",
      estado: "ACTIVO",
    },
    {
      id: "003",
      razon_social: "Proveedor Natural",
      tipo_persona: "NATURAL",
      numero_documento: "1234567890",
      estado: "INACTIVO",
    },
  ]);

  const eliminarProveedor = (proveedor) => {
    setProveedores((actuales) =>
      actuales.filter((p) => p.id !== proveedor.id)
    );
  };

  const proveedoresFiltrados = proveedores.filter(
    (proveedor) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        proveedor.razon_social
          .toLowerCase()
          .includes(texto) ||
        proveedor.numero_documento
          .toLowerCase()
          .includes(texto);

      const coincideEstado =
        estado === "" ||
        proveedor.estado === estado;

      return coincideBusqueda && coincideEstado;
    }
  );

  const consultarProveedor = (proveedor) => {
    navigate(
      `/proveedores/consultar/${proveedor.id}`
    );
  };

  const editarProveedor = (proveedor) => {
    navigate(
      `/proveedores/editar/${proveedor.id}`
    );
  };

  return (
    <div className="proveedores-page">
      <div className="proveedores-header">
        <div>
          <h1>Proveedores</h1>
          <p>
            Registro y gestión de proveedores
          </p>
        </div>

        <button
          type="button"
          className="btn-registrar-proveedor"
          onClick={() =>
            navigate("/proveedores/registrar")
          }
        >
          + Registrar proveedor
        </button>
      </div>

      <ProveedorFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        estado={estado}
        setEstado={setEstado}
      />

      <div className="proveedores-resumen">
        <div className="resumen-proveedor-item">
          <span>Total de proveedores</span>

          <strong>
            {proveedores.length}
          </strong>
        </div>

        <div className="resumen-proveedor-item">
          <span>Activos</span>

          <strong>
            {
              proveedores.filter(
                (proveedor) =>
                  proveedor.estado === "ACTIVO"
              ).length
            }
          </strong>
        </div>

        <div className="resumen-proveedor-item">
          <span>Inactivos</span>

          <strong>
            {
              proveedores.filter(
                (proveedor) =>
                  proveedor.estado === "INACTIVO"
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="proveedores-lista">
        {proveedoresFiltrados.length > 0 ? (
          proveedoresFiltrados.map((proveedor) => (
            <ProveedorCard
              key={proveedor.id}
              proveedor={proveedor}
              onConsultar={consultarProveedor}
              onEditar={editarProveedor}
              onEliminar={eliminarProveedor}
            />
          ))
        ) : (
          <div className="sin-proveedores">
            <h3>
              No se encontraron proveedores
            </h3>

            <p>
              Intenta realizar otra búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Proveedores;