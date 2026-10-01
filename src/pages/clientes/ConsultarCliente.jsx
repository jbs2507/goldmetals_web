import { useNavigate, useParams } from "react-router-dom";

const clientes = [
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

export default function ConsultarCliente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const cliente = clientes.find(
    (item) => item.id_cliente === Number(id)
  );

  if (!cliente) {
    return (
      <div className="clientes-page">

        <div className="sin-clientes">
          <h2>
            Cliente no encontrado
          </h2>

          <button
            type="button"
            className="btn-volver-cliente"
            onClick={() => navigate("/clientes")}
          >
            ← Volver
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="clientes-page">

      <div className="clientes-header">

        <div>
          <h1>
            Consultar cliente
          </h1>

          <p>
            Información detallada del cliente
          </p>
        </div>

        <button
          type="button"
          className="btn-volver-cliente"
          onClick={() => navigate("/clientes")}
        >
          ← Volver
        </button>

      </div>

      <div className="cliente-form">

        {/* =========================================
            INFORMACIÓN DEL CLIENTE
        ========================================= */}

        <section className="form-seccion">

          <h2 className="form-seccion-titulo">
            Información del cliente
          </h2>

          <div className="form-grid">

            <div className="form-campo">
              <label>
                Tipo de cliente
              </label>

              <input
                value={
                  cliente.tipo_cliente === "JURIDICA"
                    ? "Persona jurídica"
                    : "Persona natural"
                }
                readOnly
              />
            </div>

            <div className="form-campo">
              <label>
                Nombre / Razón social
              </label>

              <input
                value={cliente.nombre}
                readOnly
              />
            </div>

            <div className="form-campo">
              <label>
                Identificación tributaria
              </label>

              <input
                value={cliente.identificacion_tributaria}
                readOnly
              />
            </div>

            <div className="form-campo">
              <label>
                País
              </label>

              <input
                value={cliente.pais}
                readOnly
              />
            </div>

            <div className="form-campo">
              <label>
                Estado
              </label>

              <input
                value={cliente.estado}
                readOnly
              />
            </div>

          </div>

        </section>

        {/* =========================================
            ACCIONES
        ========================================= */}

        <div className="consulta-acciones-cliente">

          <button
            type="button"
            className="btn-cancelar-cliente"
            onClick={() =>
              navigate("/clientes")
            }
          >
            Volver
          </button>

        </div>

      </div>

    </div>
  );
}