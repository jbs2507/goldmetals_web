import { useNavigate, useParams } from "react-router-dom";

import ClienteForm from "../../components/clientes/ClienteForm.jsx";

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

export default function EditarCliente() {
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

  const handleGuardar = (datos) => {
    console.log("Estado del cliente actualizado:", {
      id_cliente: cliente.id_cliente,
      ...datos,
    });

    alert("Estado del cliente actualizado correctamente");

    navigate("/clientes");
  };

  return (
    <div className="clientes-page">

      <div className="clientes-header">

        <div>
          <h1>
            Editar cliente
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

      <ClienteForm
        cliente={cliente}
        soloEstado
        onGuardar={handleGuardar}
        onCancelar={() => navigate("/clientes")}
      />

    </div>
  );
}