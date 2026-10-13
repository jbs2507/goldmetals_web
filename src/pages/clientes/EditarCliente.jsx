import { useNavigate, useParams } from "react-router-dom";

import ClienteForm from "../../components/clientes/ClienteForm.jsx";
import { actualizarRegistro, useAlmacen } from "../../utils/almacen.js";
import { CLAVES, CLIENTES_SEMILLA } from "../../data/semillas.js";

export default function EditarCliente() {
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

  const handleGuardar = (datos) => {
    // En edición solo cambia el estado; el resto de datos queda bloqueado.
    actualizarRegistro(CLAVES.clientes, CLIENTES_SEMILLA, "id_cliente", cliente.id_cliente, {
      estado: datos.estado,
    });

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