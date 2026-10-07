import { useNavigate, useParams } from "react-router-dom";
import VentaForm from "../../components/ventas/VentaForm.jsx";
import { ventasVisibles as ventas } from "../../data/ventasMock.js";


export default function EditarVenta() {
  const navigate = useNavigate();
  const { id } = useParams();

  const venta = ventas.find(
    (item) => item.id_venta === Number(id)
  );

  if (!venta) {
    return (
      <div className="ventas-page">

        <div className="ventas-header">

          <div>
            <h1>
              Editar venta
            </h1>
          </div>

        </div>

        <div className="sin-ventas">

          <h3>
            Venta no encontrada
          </h3>

          <p>
            No fue posible encontrar la información solicitada.
          </p>

        </div>

        <div className="consulta-acciones-venta">

          <button
            type="button"
            className="btn-volver-venta"
            onClick={() => navigate("/ventas")}
          >
            Volver
          </button>

        </div>

      </div>
    );
  }

  const manejarActualizacion = (datos) => {
    console.log(
      "Venta actualizada:",
      datos
    );

    alert(
      "Venta actualizada correctamente."
    );

    navigate("/ventas");
  };

  return (
    <div className="ventas-page">

      <div className="ventas-header">

        <div>

          <h1>
            Editar venta
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
        datosIniciales={venta}
        onSubmit={manejarActualizacion}
        onCancel={() => navigate("/ventas")}
        modoEdicion
      />

    </div>
  );
}