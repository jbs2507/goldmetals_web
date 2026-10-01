import { useNavigate, useParams } from "react-router-dom";
import InsumoPolimetalicoForm from "../../components/insumosPolimetalicos/InsumoPolimetalicoForm.jsx";

const insumosPolimetalicos = [
  {
    id_insumo: 1,
    tipo_insumo: "POLIMETALICO",
    nombre: "Arena polimetálica",
    unidad_medida: "kg",
    estado: "ACTIVO",
    mina: "Mina Chocó",
  },
  {
    id_insumo: 2,
    tipo_insumo: "POLIMETALICO",
    nombre: "Arena polimetálica fina",
    unidad_medida: "kg",
    estado: "ACTIVO",
    mina: "Mina Bolívar",
  },
  {
    id_insumo: 3,
    tipo_insumo: "POLIMETALICO",
    nombre: "Material polimetálico de acopio",
    unidad_medida: "kg",
    estado: "INACTIVO",
    mina: "Acopio",
  },
];

export default function EditarInsumoPolimetalico() {
  const navigate = useNavigate();
  const { id } = useParams();

  const insumo = insumosPolimetalicos.find(
    (item) =>
      item.id_insumo === Number(id)
  );

  if (!insumo) {
    return (
      <div className="insumos-polimetalicos-page">
        <div className="sin-insumos-polimetalicos">
          <h3>Insumo no encontrado</h3>

          <p>
            El insumo polimetálico que deseas
            editar no existe.
          </p>

          <button
            className="btn-volver-insumo-polimetalico"
            onClick={() =>
              navigate("/insumos-polimetalicos")
            }
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const actualizarInsumo = (datos) => {
    console.log(
      "Insumo polimetálico actualizado:",
      {
        id_insumo: insumo.id_insumo,
        ...datos,
      }
    );

    navigate("/insumos-polimetalicos");
  };

  return (
    <div className="insumos-polimetalicos-page">
      <div className="insumos-polimetalicos-header">
        <div>
          <h1>
            Editar insumo polimetálico
          </h1>

          <p>
            Actualiza la información del insumo
            registrado
          </p>
        </div>

        <button
          className="btn-volver-insumo-polimetalico"
          onClick={() =>
            navigate("/insumos-polimetalicos")
          }
        >
          Volver
        </button>
      </div>

      <InsumoPolimetalicoForm
        modo="editar"
        datosIniciales={insumo}
        onGuardar={actualizarInsumo}
        onCancelar={() =>
          navigate("/insumos-polimetalicos")
        }
      />
    </div>
  );
}