import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import Compras from "./Compras.jsx";
import CompraForm from "../../components/compras/CompraForm";
import { agregarRegistro, hoyISO, leerLista, siguienteIdTexto } from "../../utils/almacen.js";
import { CLAVES, COMPRAS_SEMILLA } from "../../data/semillas.js";
import { construirCompra } from "../../data/compras.js";

const RegistrarCompra = () => {
  const navigate = useNavigate();

  const registrarCompra = (datosCompra) => {
    const lista = leerLista(CLAVES.compras, COMPRAS_SEMILLA);
    agregarRegistro(CLAVES.compras, COMPRAS_SEMILLA, {
      ...construirCompra(datosCompra),
      id: siguienteIdTexto(lista, "id"),
      estado: datosCompra.estado || "REGISTRADA",
      historial: [{ estado: "REGISTRADA", fecha: hoyISO(), motivo: "" }],
    });

    navigate("/compras");
  };

  // El registro es una ventana emergente sobre la lista.
  return (
    <>
      <Compras />
      <Modal
        titulo="Registrar compra"
        subtitulo="Completa los datos de la compra"
        ancho={1040}
        onCerrar={() => navigate("/compras")}
      >
        <CompraForm
          onSubmit={registrarCompra}
          onCancel={() => navigate("/compras")}
        />
      </Modal>
    </>
  );
};

export default RegistrarCompra;