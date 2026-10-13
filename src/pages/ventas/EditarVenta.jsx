import { useNavigate, useParams } from "react-router-dom";
import VentaForm from "../../components/ventas/VentaForm.jsx";
import { construirVenta, ventasMock, ventaVisible } from "../../data/ventasMock.js";
import { actualizarRegistro, useAlmacen } from "../../utils/almacen.js";
import { CLAVES } from "../../data/semillas.js";
import { conEstado } from "../../utils/listados.js";


export default function EditarVenta() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [ventas] = useAlmacen(CLAVES.ventas, ventasMock);
  const venta = ventas.filter(ventaVisible).find(
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
    let actualizada = { ...venta, ...construirVenta(datos), id_venta: venta.id_venta };
    // Si cambió el estado, queda registrado en el historial.
    if (datos.estado && datos.estado !== venta.estado) {
      actualizada = conEstado(actualizada, datos.estado);
    }
    actualizarRegistro(CLAVES.ventas, ventasMock, "id_venta", venta.id_venta, actualizada);

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