import { useNavigate, useParams } from "react-router-dom";
import VentaForm from "../../components/ventas/VentaForm.jsx";

const ventas = [
  {
    id_venta: 1,
    cliente: "M&M Trading S.A.S.",
    pedido: "PED-001",
    tipo_material: "Oro en lingote",
    cantidad: "500 g",
    precio: "120000000",
    moneda: "COP",
    fecha: "2026-09-20",
    pais_destino: "India",
    encargado_transporte: "Carlos Gómez",
    placa_vehiculo: "ABC123",
    estado: "REGISTRADA",
    documentos: true,
    pago_completo: false,
    produccion_lista: false,
  },
  {
    id_venta: 2,
    cliente: "Global Metals International",
    pedido: "PED-002",
    tipo_material: "Arena procesada",
    cantidad: "1.000 kg",
    precio: "85000000",
    moneda: "COP",
    fecha: "2026-09-18",
    pais_destino: "China",
    encargado_transporte: "Juan Rodríguez",
    placa_vehiculo: "XYZ789",
    estado: "DESPACHADA",
    documentos: true,
    pago_completo: false,
    produccion_lista: false,
  },
  {
    id_venta: 3,
    cliente: "Global Metals International",
    pedido: "PED-003",
    tipo_material: "Oro en lingote",
    cantidad: "250 g",
    precio: "62000000",
    moneda: "COP",
    fecha: "2026-09-15",
    pais_destino: "Estados Unidos",
    encargado_transporte: "Laura Pérez",
    placa_vehiculo: "DEF456",
    estado: "CANCELADA",
    documentos: false,
    pago_completo: false,
    produccion_lista: false,
  },
];

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

            <p>
              Actualización de información.
            </p>
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

          <p>
            Actualiza la información registrada de la venta.
          </p>

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