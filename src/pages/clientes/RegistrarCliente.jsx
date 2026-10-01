import { useNavigate } from "react-router-dom";
import ClienteForm from "../../components/clientes/ClienteForm.jsx";

export default function RegistrarCliente() {
  const navigate = useNavigate();

  const handleGuardar = (datos) => {
    console.log("Cliente registrado:", datos);

    alert("Cliente registrado correctamente");

    navigate("/clientes");
  };

  return (
    <div className="clientes-page">

      <div className="clientes-header">
        <div>
          <h1>Registrar cliente</h1>

          <p>
            Ingrese la información del nuevo cliente
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

      <ClienteForm
        onGuardar={handleGuardar}
        onCancelar={() => navigate("/clientes")}
      />

    </div>
  );
}