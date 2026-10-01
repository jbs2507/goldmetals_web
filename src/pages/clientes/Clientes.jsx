import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonEliminar from "../../components/BotonEliminar";

const clientesIniciales = [
  {
    id_cliente: 1,
    tipo_cliente: "JURIDICA",
    nombre: "M&M Trading S.A.S.",
    identificacion_tributaria: "900123456-1",
    pais: "Colombia",
    estado: "ACTIVO",
  },
  {
    id_cliente: 2,
    tipo_cliente: "JURIDICA",
    nombre: "Global Metals International",
    identificacion_tributaria: "901234567-8",
    pais: "Estados Unidos",
    estado: "ACTIVO",
  },
];

export default function Clientes() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState(clientesIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("TODOS");

  const eliminarCliente = (id) => {
    setClientes((actuales) =>
      actuales.filter((c) => c.id_cliente !== id)
    );
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      cliente.nombre.toLowerCase().includes(texto) ||
      cliente.identificacion_tributaria
        .toLowerCase()
        .includes(texto);

    const coincideEstado =
      estado === "TODOS" ||
      cliente.estado === estado;

    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="clientes-page">

      <div className="clientes-header">
        <div>
          <h1>Clientes</h1>

          <p>
            Gestión de clientes registrados
          </p>
        </div>

        <button
          type="button"
          className="btn-registrar-cliente"
          onClick={() =>
            navigate("/clientes/registrar")
          }
        >
          + Registrar cliente
        </button>
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

      <div className="clientes-resumen">

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

      </div>

      <div className="clientes-lista">

        {clientesFiltrados.length === 0 ? (
          <div className="sin-clientes">
            <h3>
              No se encontraron clientes
            </h3>

            <p>
              Intenta cambiar los filtros de búsqueda.
            </p>
          </div>
        ) : (
          clientesFiltrados.map((cliente) => (

            <div
              className="cliente-card"
              key={cliente.id_cliente}
            >

              <div className="cliente-card-header">

                <div>
                  <span className="cliente-label">
                    Cliente
                  </span>

                  <h2>
                    {cliente.nombre}
                  </h2>
                </div>

                <span
                  className={`estado-cliente ${
                    cliente.estado === "ACTIVO"
                      ? "activo"
                      : "inactivo"
                  }`}
                >
                  {cliente.estado}
                </span>

              </div>

              <div className="cliente-card-body">

                <div className="dato-cliente">
                  <span>
                    Tipo de cliente
                  </span>

                  <strong>
                    {cliente.tipo_cliente ===
                    "JURIDICA"
                      ? "Persona jurídica"
                      : "Persona natural"}
                  </strong>
                </div>

                <div className="dato-cliente">
                  <span>
                    Identificación tributaria
                  </span>

                  <strong>
                    {cliente.identificacion_tributaria}
                  </strong>
                </div>

                <div className="dato-cliente">
                  <span>
                    País
                  </span>

                  <strong>
                    {cliente.pais}
                  </strong>
                </div>

              </div>

              <div className="cliente-card-actions">

                <button
                  type="button"
                  className="btn-consultar-cliente"
                  onClick={() =>
                    navigate(
                      `/clientes/consultar/${cliente.id_cliente}`
                    )
                  }
                >
                  Consultar
                </button>

                <button
                  type="button"
                  className="btn-editar-cliente"
                  onClick={() =>
                    navigate(
                      `/clientes/editar/${cliente.id_cliente}`
                    )
                  }
                >
                  Editar
                </button>

                <BotonEliminar
                  entidad="cliente"
                  nombre={cliente.nombre}
                  onConfirmar={() => eliminarCliente(cliente.id_cliente)}
                />

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}