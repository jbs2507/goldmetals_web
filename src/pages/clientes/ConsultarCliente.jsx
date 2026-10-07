import { useNavigate, useParams } from "react-router-dom";
import { etiquetaTipoDocumento } from "../../components/clientes/tiposDocumento.js";
import DocumentoAdjunto from "../../components/DocumentoAdjunto.jsx";

const clientes = [
  {
    id_cliente: 1,
    tipo_cliente: "JURIDICA",
    tipo_documento: "NIT",
    nombre: "M&M Trading S.A.S.",
    identificacion_tributaria: "900123456-1",
    pais: "Colombia",
    telefono: "3001112233",
    correo: "contacto@mmtrading.com",
    camaraComercio: "camara_comercio.pdf",
    contrato: "contrato.pdf",
    estado: "ACTIVO",
  },
  {
    id_cliente: 2,
    tipo_cliente: "JURIDICA",
    tipo_documento: "NIT",
    nombre: "Global Metals International",
    identificacion_tributaria: "901234567-8",
    pais: "Estados Unidos",
    telefono: "3104445566",
    correo: "ventas@globalmetals.com",
    camaraComercio: "camara_comercio.pdf",
    contrato: "contrato.pdf",
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
                Tipo de documento
              </label>

              <input
                value={etiquetaTipoDocumento(cliente.tipo_documento)}
                readOnly
              />
            </div>

            <div className="form-campo">
              <label>
                {cliente.tipo_documento === "NIT" ? "Número de NIT" : "Número de documento"}
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
                Número de teléfono
              </label>

              <input
                value={cliente.telefono || "No registrado"}
                readOnly
              />
            </div>

            <div className="form-campo">
              <label>
                Correo electrónico
              </label>

              <input
                value={cliente.correo || "No registrado"}
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
            DOCUMENTOS LEGALES
        ========================================= */}

        <section className="form-seccion">
          <div className="form-seccion-titulo">
            <h2>Documentos legales del cliente</h2>
            <p>Documentos cargados. Puedes verlos o descargarlos.</p>
          </div>

          <div className="documentos-unificados-grid">
            <DocumentoAdjunto
              titulo="Cámara de Comercio"
              name="camaraComercio"
              value={cliente.camaraComercio}
              disabled
            />
            <DocumentoAdjunto
              titulo="Contrato"
              name="contrato"
              value={cliente.contrato}
              disabled
            />
          </div>
        </section>

      </div>

    </div>
  );
}