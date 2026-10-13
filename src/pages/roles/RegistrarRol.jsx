import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import Roles from "./Roles.jsx";
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

  // El registro es una ventana emergente sobre la lista.
  return (
    <>
      <Roles />
      <Modal
        titulo="Registrar rol"
        subtitulo="Define el nombre del rol y sus permisos"
        ancho={1040}
        onCerrar={() => navigate("/roles")}
      >
        <RolForm modo="registrar" onGuardar={guardar} onCancelar={() => navigate("/roles")} error={error} />
      </Modal>
    </>
  );
}
