import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProveedorCard from "../../components/proveedores/ProveedorCard";
import ProveedorFiltros from "../../components/proveedores/ProveedorFiltros";
import Permiso from "../../components/Permiso.jsx";

const Proveedores = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");

  const [proveedores, setProveedores] = useState([
    {
      id: "001",
      razon_social: "Proveedor Minero Chocó",
      tipo_persona: "JURIDICA",
      tipo_documento: "NIT",
      numero_documento: "900123456",
      estado: "ACTIVO",
      camaraComercio: "camara_comercio.pdf",
      rut: "rut.pdf",
      certificadoRucom: "rucom.pdf",
    },
    {
      id: "002",
      razon_social: "Proveedor Minero Bolívar",
      tipo_persona: "JURIDICA",
      tipo_documento: "NIT",
      numero_documento: "900234567",
      estado: "ACTIVO",
      camaraComercio: "camara_comercio.pdf",
      rut: "rut.pdf",
      certificadoRucom: "rucom.pdf",
    },
    {
      id: "003",
      razon_social: "Proveedor Natural",
      tipo_persona: "NATURAL",
      tipo_documento: "CC",
      numero_documento: "1234567890",
      estado: "INACTIVO",
      camaraComercio: "camara_comercio.pdf",
      rut: "rut.pdf",
      certificadoRucom: "rucom.pdf",
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

  const pag = usePaginacion(proveedoresFiltrados);

  return (
    <div className="proveedores-page">
      <div className="proveedores-header">
        <div>
          <h1>Proveedores</h1>
          <p>
            Registro y gestión de proveedores
          </p>
        </div>

        <Permiso accion="crear"><button
          type="button"
          className="btn-registrar-proveedor"
          onClick={() =>
            navigate("/proveedores/registrar")
          }
        >
          + Registrar proveedor
        </button></Permiso>
      </div>

      <ProveedorFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        estado={estado}
        setEstado={setEstado}
      />

      <Permiso dato="estadisticas"><div className="proveedores-resumen">
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
      </div></Permiso>

      <div className="proveedores-lista">
        <BarraListado pag={pag} archivo="proveedores" />
        {proveedoresFiltrados.length > 0 ? (
          pag.items.map((proveedor) => (
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

      <Paginador pag={pag} />
    </div>
  );
};

export default Proveedores;