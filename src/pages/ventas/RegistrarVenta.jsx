import { useNavigate } from "react-router-dom";
import VentaForm from "../../components/ventas/VentaForm.jsx";

export default function RegistrarVenta() {
  const navigate = useNavigate();

  const manejarRegistro = (datos) => {
    console.log("Venta registrada:", datos);

    alert("Venta registrada correctamente.");

    navigate("/ventas");
  };

  return (
    <div className="ventas-page">

      <div className="ventas-header">

        <div>
          <h1>
            Registrar venta
          </h1>
        </div>

        <button
          type="button"
          className="btn-volver-venta"
          onClick={() => navigate("/ventas")}
        >
          Volver
        </button>

      </div>

      <VentaForm
        onSubmit={manejarRegistro}
        onCancel={() => navigate("/ventas")}
      />

    </div>
  );
}