import { Link, useNavigate } from "react-router-dom";
import EmpleadoForm from "../../components/empleados/EmpleadoForm.jsx";

export default function RegistrarEmpleado() {
  const navigate = useNavigate();

  const volverEmpleados = () => {
    navigate("/empleados", { replace: true });
  };

  const manejarRegistro = (datos) => {
    console.log("Empleado registrado:", datos);
    alert("Empleado registrado correctamente.");
    volverEmpleados();
  };

  return (
    <div className="empleados-page">
      <div className="empleados-header">
        <div>
          <h1>Registrar empleado</h1>
          <p>Registra la información correspondiente al empleado.</p>
        </div>

        <Link to="/empleados" replace className="btn-volver-empleado">
          Volver
        </Link>
      </div>

      <EmpleadoForm
        onSubmit={manejarRegistro}
        onCancel={volverEmpleados}
      />
    </div>
  );
}
