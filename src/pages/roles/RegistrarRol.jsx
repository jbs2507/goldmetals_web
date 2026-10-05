import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RolForm from "../../components/roles/RolForm.jsx";
import { crearRol } from "../../permisos.js";

export default function RegistrarRol() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const guardar = (datos) => {
    const r = crearRol(datos);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    navigate("/roles");
  };

  return (
    <div className="roles-page">
      <div className="roles-header">
        <div>
          <h1>Registrar rol</h1>
          <p>Registra un nuevo rol y define sus permisos y privilegios</p>
        </div>

        <button type="button" className="btn-volver-rol" onClick={() => navigate("/roles")}>
          Volver
        </button>
      </div>

      <RolForm modo="registrar" onGuardar={guardar} onCancelar={() => navigate("/roles")} error={error} />
    </div>
  );
}
