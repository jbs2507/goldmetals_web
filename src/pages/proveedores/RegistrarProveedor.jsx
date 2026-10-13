import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import Proveedores from "./Proveedores.jsx";

import ProveedorForm from "../../components/proveedores/ProveedorForm";
import { agregarRegistro, leerLista, sinArchivos, siguienteIdTexto } from "../../utils/almacen.js";
import { CLAVES, PROVEEDORES_SEMILLA } from "../../data/semillas.js";

const RegistrarProveedor = () => {
  const navigate = useNavigate();

  const guardarProveedor = (datos) => {
    const lista = leerLista(CLAVES.proveedores, PROVEEDORES_SEMILLA);
    agregarRegistro(CLAVES.proveedores, PROVEEDORES_SEMILLA, {
      ...sinArchivos(datos),
      id: siguienteIdTexto(lista, "id"),
      estado: datos.estado || "ACTIVO",
    });

    navigate("/proveedores");
  };

  // El registro es una ventana emergente sobre la lista.
  return (
    <>
      <Proveedores />
      <Modal
        titulo="Registrar proveedor"
        subtitulo="Completa los datos y los documentos del proveedor"
        ancho={900}
        onCerrar={() => navigate("/proveedores")}
      >
        <ProveedorForm
          modo="registrar"
          onSubmit={guardarProveedor}
          onCancelar={() => navigate("/proveedores")}
        />
      </Modal>
    </>
  );
};

export default RegistrarProveedor;