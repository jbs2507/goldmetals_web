import { useNavigate, useParams } from "react-router-dom";
import { etiquetaTipoDocumento } from "../../components/clientes/tiposDocumento.js";
import DocumentoAdjunto from "../../components/DocumentoAdjunto.jsx";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES, CLIENTES_SEMILLA } from "../../data/semillas.js";

export default function ConsultarCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [clientes] = useAlmacen(CLAVES.clientes, CLIENTES_SEMILLA);

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

          <div className="form-seccion-titulo">
            <h2>Información del cliente</h2>
            <p>Datos registrados del cliente.</p>
          </div>

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
                {cliente.tipo_cliente === "NATURAL" ? "Nombre" : "Razón social"}
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

            {cliente.tipo_cliente === "JURIDICA" && (
              <>
                <div className="form-campo">
                  <label>
                    Nombre del representante legal
                  </label>

                  <input
                    value={cliente.representante_nombre || "No registrado"}
                    readOnly
                  />
                </div>

                <div className="form-campo">
                  <label>
                    Correo del representante legal
                  </label>

                  <input
                    value={cliente.representante_correo || "No registrado"}
                    readOnly
                  />
                </div>
              </>
            )}

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
                {cliente.tipo_cliente === "JURIDICA" ? "Correo electrónico de la empresa" : "Correo electrónico"}
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