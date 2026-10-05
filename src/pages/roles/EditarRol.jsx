import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RolForm from "../../components/roles/RolForm.jsx";
import { actualizarRol, obtenerRol } from "../../permisos.js";

export default function EditarRol() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rol] = useState(() => obtenerRol(id));
  const [error, setError] = useState("");

  const guardar = (datos) => {
    const r = actualizarRol(id, datos);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    navigate("/roles");
  };

  if (!rol) {
    return (
      <div className="roles-page">
        <div className="sin-roles">
          <h3>Rol no encontrado</h3>
          <p>El rol que deseas editar no existe.</p>
        </div>

        <div className="consulta-acciones-rol">
          <button type="button" className="btn-volver-rol" onClick={() => navigate("/roles")}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="roles-page">
      <div className="roles-header">
        <div>
          <h1>Editar rol</h1>
          <p>Actualiza la información, los permisos y los privilegios del rol</p>
        </div>

        <button type="button" className="btn-volver-rol" onClick={() => navigate("/roles")}>
          Volver
        </button>
      </div>

      <RolForm
        modo="editar"
        datosIniciales={rol}
        onGuardar={guardar}
        onCancelar={() => navigate("/roles")}
        error={error}
      />
    </div>
  );
}
