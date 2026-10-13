import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProveedorFiltros from "../../components/proveedores/ProveedorFiltros";
import Permiso from "../../components/Permiso.jsx";
import Tabla, { BotonIcono, Doble, InterruptorEstado } from "../../components/Tabla.jsx";
import DocumentosCargados from "../../components/DocumentosCargados.jsx";
import BotonEliminar from "../../components/BotonEliminar";
import { etiquetaTipoDocumento } from "../../components/clientes/tiposDocumento.js";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES, PROVEEDORES_SEMILLA } from "../../data/semillas.js";

const Proveedores = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");

  const [proveedores, setProveedores] = useAlmacen(CLAVES.proveedores, PROVEEDORES_SEMILLA);

  const eliminarProveedor = (proveedor) => {
    setProveedores((actuales) =>
      actuales.filter((p) => p.id !== proveedor.id)
    );
  };

  const cambiarEstado = (proveedor) => {
    setProveedores((actuales) =>
      actuales.map((p) =>
        p.id === proveedor.id ? { ...p, estado: p.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" } : p
      )
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

        <Tabla
          filas={pag.items}
          clave={(p) => p.id}
          vacio={
            <div className="sin-proveedores">
              <h3>No se encontraron proveedores</h3>
              <p>Intenta realizar otra búsqueda.</p>
            </div>
          }
          columnas={[
            {
              titulo: "Proveedor",
              render: (p) => (
                <Doble
                  principal={p.razon_social}
                  secundario={p.tipo_persona === "JURIDICA" ? "Persona jurídica" : "Persona natural"}
                />
              ),
            },
            {
              titulo: "Documento",
              sinSalto: true,
              render: (p) => (
                <Doble principal={p.numero_documento} secundario={etiquetaTipoDocumento(p.tipo_documento)} />
              ),
            },
          ]}
          interruptor={{
            render: (p) => (
              <InterruptorEstado
                activo={p.estado === "ACTIVO"}
                nombre={p.razon_social}
                onCambiar={() => cambiarEstado(p)}
              />
            ),
          }}
          acciones={(p) => (
            <>
              <BotonIcono icono="ver" titulo="Consultar" onClick={() => consultarProveedor(p)} />
              <DocumentosCargados
                icono
                titulo={`Documentos de ${p.razon_social}`}
                documentos={[
                  { titulo: "Cámara de Comercio", valor: p.camaraComercio },
                  { titulo: "RUT", valor: p.rut },
                  { titulo: "RUCOM", valor: p.certificadoRucom },
                ]}
              />
              <Permiso accion="editar">
                <BotonIcono icono="editar" titulo="Editar" tono="dorado" onClick={() => editarProveedor(p)} />
              </Permiso>
              <BotonEliminar
                icono
                entidad="proveedor"
                nombre={p.razon_social}
                onConfirmar={() => eliminarProveedor(p)}
              />
            </>
          )}
        />
      </div>

      <Paginador pag={pag} />
    </div>
  );
};

export default Proveedores;