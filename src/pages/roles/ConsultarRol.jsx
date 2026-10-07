import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RolForm from "../../components/roles/RolForm.jsx";
import { obtenerRol } from "../../permisos.js";

export default function ConsultarRol() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rol] = useState(() => obtenerRol(id));

  return (
    <div className="roles-page">
      <div className="roles-header">
        <div>
          <h1>Consultar rol</h1>
        </div>

        <button type="button" className="btn-volver-rol" onClick={() => navigate("/roles")}>
          Volver
        </button>
      </div>

      {rol ? (
        <RolForm
          modo="consultar"
          datosIniciales={rol}
          soloLectura
          onGuardar={() => {}}
          onCancelar={() => navigate("/roles")}
        />
      ) : (
        <div className="sin-roles">
          <h3>Rol no encontrado</h3>
          <p>El rol que deseas consultar no existe.</p>
        </div>
      )}
    </div>
  );
}
