import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonEliminar from "../../components/BotonEliminar";
import { etiquetaTipoDocumento } from "../../components/clientes/tiposDocumento.js";
import DocumentosCargados from "../../components/DocumentosCargados.jsx";
import Permiso from "../../components/Permiso.jsx";
import Tabla, { BotonIcono, Doble, InterruptorEstado } from "../../components/Tabla.jsx";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES, CLIENTES_SEMILLA } from "../../data/semillas.js";

// Columnas del Excel: lo mismo que se ve en pantalla.
const columnasExcel = [
  { titulo: "Cliente", valor: (c) => c.nombre },
  { titulo: "Tipo de cliente", valor: (c) => (c.tipo_cliente === "JURIDICA" ? "Persona jurídica" : c.tipo_cliente === "NATURAL" ? "Persona natural" : c.tipo_cliente) },
  { titulo: "Tipo de documento", valor: (c) => etiquetaTipoDocumento(c.tipo_documento) },
  { titulo: "Identificación", valor: (c) => c.identificacion_tributaria },
  { titulo: "País", valor: (c) => c.pais },
  { titulo: "Teléfono", valor: (c) => c.telefono },
  { titulo: "Correo", valor: (c) => c.correo },
  { titulo: "Estado", valor: (c) => c.estado },
];

export default function Clientes() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useAlmacen(CLAVES.clientes, CLIENTES_SEMILLA);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("TODOS");

  const eliminarCliente = (id) => {
    setClientes((actuales) =>
      actuales.filter((c) => c.id_cliente !== id)
    );
  };

  const cambiarEstado = (id) => {
    setClientes((actuales) =>
      actuales.map((c) =>
        c.id_cliente === id ? { ...c, estado: c.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" } : c
      )
    );
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      cliente.nombre.toLowerCase().includes(texto) ||
      cliente.identificacion_tributaria
        .toLowerCase()
        .includes(texto) ||
      (cliente.correo || "").toLowerCase().includes(texto) ||
      (cliente.telefono || "").includes(texto);

    const coincideEstado =
      estado === "TODOS" ||
      cliente.estado === estado;

    return coincideBusqueda && coincideEstado;
  });

  const pag = usePaginacion(clientesFiltrados);

  return (
    <div className="clientes-page">

      <div className="clientes-header">
        <div>
          <h1>Clientes</h1>
        </div>

        <Permiso accion="crear"><button
          type="button"
          className="btn-registrar-cliente"
          onClick={() =>
            navigate("/clientes/registrar")
          }
        >
          + Registrar cliente
        </button></Permiso>
      </div>

      <div className="clientes-filtros">

        <div className="campo-busqueda-cliente">
          <input
            type="text"
            placeholder="Nombre o identificación tributaria"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
          />
        </div>

        <div className="campo-filtro-cliente">
          <select
            value={estado}
            onChange={(e) =>
              setEstado(e.target.value)
            }
          >
            <option value="TODOS">
              Todos
            </option>

            <option value="ACTIVO">
              Activo
            </option>

            <option value="INACTIVO">
              Inactivo
            </option>
          </select>
        </div>

      </div>

      <Permiso dato="estadisticas"><div className="clientes-resumen">

        <div className="resumen-cliente-item">
          <span>Total clientes</span>

          <strong>
            {clientes.length}
          </strong>
        </div>

        <div className="resumen-cliente-item">
          <span>Activos</span>

          <strong>
            {
              clientes.filter(
                (cliente) =>
                  cliente.estado === "ACTIVO"
              ).length
            }
          </strong>
        </div>

        <div className="resumen-cliente-item">
          <span>Inactivos</span>

          <strong>
            {
              clientes.filter(
                (cliente) =>
                  cliente.estado === "INACTIVO"
              ).length
            }
          </strong>
        </div>

      </div></Permiso>

      <div className="clientes-lista">

        <BarraListado pag={pag} archivo="clientes" excel columnas={columnasExcel} />

        <Tabla
          filas={pag.items}
          clave={(c) => c.id_cliente}
          vacio={
            <div className="sin-clientes">
              <h3>No se encontraron clientes</h3>
              <p>Intenta cambiar los filtros de búsqueda.</p>
            </div>
          }
          columnas={[
            {
              titulo: "Cliente",
              render: (c) => (
                <Doble
                  principal={c.nombre}
                  secundario={c.tipo_cliente === "JURIDICA" ? "Persona jurídica" : "Persona natural"}
                />
              ),
            },
            {
              titulo: "Documento",
              sinSalto: true,
              render: (c) => (
                <Doble
                  principal={c.identificacion_tributaria}
                  secundario={etiquetaTipoDocumento(c.tipo_documento)}
                />
              ),
            },
            { titulo: "País", render: (c) => c.pais },
            {
              titulo: "Contacto",
              render: (c) => <Doble principal={c.telefono || "No registrado"} secundario={c.correo || "Sin correo"} />,
            },
          ]}
          interruptor={{
            render: (c) => (
              <InterruptorEstado
                activo={c.estado === "ACTIVO"}
                nombre={c.nombre}
                onCambiar={() => cambiarEstado(c.id_cliente)}
              />
            ),
          }}
          acciones={(c) => (
            <>
              <BotonIcono
                icono="ver"
                titulo="Consultar"
                onClick={() => navigate(`/clientes/consultar/${c.id_cliente}`)}
              />
              <DocumentosCargados
                icono
                titulo={`Documentos de ${c.nombre}`}
                documentos={[
                  { titulo: "Cámara de Comercio", valor: c.camaraComercio },
                  { titulo: "Contrato", valor: c.contrato },
                ]}
              />
              <Permiso accion="editar">
                <BotonIcono
                  icono="editar"
                  titulo="Editar"
                  tono="dorado"
                  onClick={() => navigate(`/clientes/editar/${c.id_cliente}`)}
                />
              </Permiso>
              <BotonEliminar
                icono
                entidad="cliente"
                nombre={c.nombre}
                onConfirmar={() => eliminarCliente(c.id_cliente)}
              />
            </>
          )}
        />
      </div>

      <Paginador pag={pag} />
    </div>
  );
}