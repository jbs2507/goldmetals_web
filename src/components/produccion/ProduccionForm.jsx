import React, { useState } from "react";
import { filtrarSoloLetras, validarCampo } from "../../utils/validaciones.js";
import { formatoMonto } from "../../data/produccionesMock.js";
import { puedeVerDato } from "../../permisos.js";

const ProduccionForm = ({
  modo = "registrar",
  produccion = {},
  onSubmit,
  onCancelar,
}) => {
  const esConsulta = modo === "consultar";
  // En consulta se ocultan cantidades y montos a los roles que no tienen ese privilegio.
  const ocultarCantidades = esConsulta && !puedeVerDato("cantidades");
  const ocultarPrecios = esConsulta && !puedeVerDato("precios");

  const [cantidad, setCantidad] = useState(produccion.cantidad || "");
  const [fecha, setFecha] = useState(produccion.fecha || "2026-09-23");
  const [cliente, setCliente] = useState(produccion.cliente || "");
  const [pedido, setPedido] = useState(produccion.pedido || "");
  const [mina, setMina] = useState(produccion.mina || "");
  const [errores, setErrores] = useState({});

  return (
    <form
      className="produccion-form"
      onSubmit={(e) => {
        e.preventDefault();

        const nuevosErrores = {};
        const errCantidad = validarCampo(cantidad, { requerido: true, tipo: "number" });
        if (errCantidad) nuevosErrores.cantidad = errCantidad;

        const errFecha = validarCampo(fecha, { requerido: true });
        if (errFecha) nuevosErrores.fecha = errFecha;

        const errCliente = validarCampo(cliente, { requerido: true });
        if (errCliente) nuevosErrores.cliente = errCliente;
        const errPedido = validarCampo(pedido, { requerido: true });
        if (errPedido) nuevosErrores.pedido = errPedido;
        const errMina = validarCampo(mina, { requerido: true, soloLetras: true });
        if (errMina) nuevosErrores.mina = errMina;

        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        if (onSubmit) {
          onSubmit(e);
        }
      }}
    >
      {/* INFORMACIÓN DE PRODUCCIÓN */}
      <div className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Información de producción</h2>

          <p>
            Registre los datos correspondientes a la producción.
          </p>
        </div>

        <div className="form-grid">

          {/* ORDEN DE PRODUCCIÓN */}
          <div className="form-campo">
            <label>Orden de producción</label>

            <select
              name="id_orden_produccion"
              defaultValue={produccion.id_orden_produccion || ""}
              disabled={esConsulta}
              required
            >
              <option value="">
                Seleccionar orden de producción
              </option>

              <option value="1">
                Orden de producción disponible
              </option>
            </select>
          </div>

          {/* CLIENTE */}
          <div className="form-campo">
            <label>Cliente</label>
            <select name="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} disabled={esConsulta} required>
              <option value="">Seleccionar cliente</option>
              <option value="Cliente 1">Cliente 1</option>
              <option value="Cliente 2">Cliente 2</option>
              <option value="Cliente 3">Cliente 3</option>
            </select>
            {errores.cliente && <span className="err">{errores.cliente}</span>}
          </div>

          {/* PEDIDO */}
          <div className="form-campo">
            <label>Pedido</label>
            <select name="pedido" value={pedido} onChange={(e) => setPedido(e.target.value)} disabled={esConsulta} required>
              <option value="">Seleccionar pedido</option>
              <option value="Pedido 001">Pedido 001</option>
              <option value="Pedido 002">Pedido 002</option>
              <option value="Pedido 003">Pedido 003</option>
            </select>
            {errores.pedido && <span className="err">{errores.pedido}</span>}
          </div>

          {/* ACOPIO */}
          <div className="form-campo">
            <label>Acopio</label>

            <select
              name="id_acopio"
              defaultValue={produccion.id_acopio || ""}
              disabled={esConsulta}
              required
            >
              <option value="">
                Seleccionar acopio
              </option>

              <option value="1">
                Acopio disponible
              </option>
            </select>
          </div>

          {/* INSUMO / MATERIAL */}
          <div className="form-campo">
            <label>Insumo / material</label>

            <select
              name="insumo"
              defaultValue={produccion.insumo || ""}
              disabled={esConsulta}
              required
            >
              <option value="">
                Seleccionar insumo
              </option>

              <option value="Oro">
                Oro
              </option>

              <option value="Material polimetálico">
                Material polimetálico
              </option>
            </select>
          </div>

          {/* CANTIDAD */}
          {!ocultarCantidades && (
          <div className="form-campo">
            <label>Cantidad</label>

            <input
              type="text"
              name="cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Ingrese la cantidad"
              disabled={esConsulta}
              required
            />
            {errores.cantidad && <span className="err">{errores.cantidad}</span>}
          </div>
          )}

          {/* FECHA */}
          <div className="form-campo">
            <label>Fecha</label>

            <input
              type="date"
              name="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              disabled={esConsulta}
              required
            />
            {errores.fecha && <span className="err">{errores.fecha}</span>}
          </div>

          {/* MINA */}
          <div className="form-campo">
            <label>Mina</label>
            <input type="text" name="mina" value={mina} onChange={(e) => setMina(e.target.value)} placeholder="Ingrese la mina" disabled={esConsulta} required />
            {errores.mina && <span className="err">{errores.mina}</span>}
          </div>

          {/* MONTO (calculado a partir del pedido) */}
          {produccion.monto != null && !ocultarPrecios && (
            <div className="form-campo">
              <label>Monto de la producción</label>
              <input type="text" value={formatoMonto(produccion.monto)} disabled readOnly />
            </div>
          )}

        </div>
      </div>

      {/* ACCIONES */}
      {!esConsulta && (
        <div className="form-acciones-produccion">
          <button
            type="button"
            className="btn-cancelar-produccion"
            onClick={onCancelar}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-guardar-produccion"
          >
            {modo === "editar"
              ? "Actualizar producción"
              : "Guardar producción"}
          </button>
        </div>
      )}
    </form>
  );
};

export default ProduccionForm;