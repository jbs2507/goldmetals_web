import React, { useState } from "react";
import { filtrarSoloLetras, hoyISO, hoyMasAnios, validarCampo } from "../../utils/validaciones.js";
import { formatoMonto } from "../../data/produccionesMock.js";
import { puedeVerDato } from "../../permisos.js";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES, CLIENTES_SEMILLA } from "../../data/semillas.js";
import { ACOPIOS_PEDIDO, codigoPedido, pedidosMock } from "../../data/pedidosMock.js";
import { produccionesMock } from "../../data/produccionesMock.js";

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
  const [fecha, setFecha] = useState(produccion.fecha || hoyISO());
  const [cliente, setCliente] = useState(produccion.cliente || "");
  const [pedido, setPedido] = useState(produccion.pedido || "");
  const [mina, setMina] = useState(produccion.mina || "");
  const [errores, setErrores] = useState({});

  // Las listas salen de los módulos de clientes, pedidos y producciones; si el registro ya traía
  // un valor que no está en la lista (datos antiguos), se conserva como opción.
  const [clientes] = useAlmacen(CLAVES.clientes, CLIENTES_SEMILLA);
  const [pedidos] = useAlmacen(CLAVES.pedidos, pedidosMock);
  const [producciones] = useAlmacen(CLAVES.producciones, produccionesMock);

  const conActual = (lista, actual) => (actual && !lista.includes(actual) ? [actual, ...lista] : lista);
  const opcionesCliente = conActual(clientes.map((c) => c.nombre), produccion.cliente);
  const opcionesPedido = conActual(pedidos.map((p) => codigoPedido(p.id_pedido)), produccion.pedido);
  const opcionesOrden = [...new Set([...producciones.map((p) => p.id_orden_produccion), produccion.id_orden_produccion].filter(Boolean))];
  const opcionesAcopio = [
    ...ACOPIOS_PEDIDO.map((a) => ({ id: a.id_acopio, nombre: a.nombre })),
    ...(produccion.id_acopio && !ACOPIOS_PEDIDO.some((a) => a.id_acopio === Number(produccion.id_acopio))
      ? [{ id: produccion.id_acopio, nombre: `Acopio ${produccion.id_acopio}` }]
      : []),
  ];

  return (
    <form
      className="produccion-form"
      onSubmit={(e) => {
        e.preventDefault();

        const nuevosErrores = {};
        const errCantidad = validarCampo(cantidad, { requerido: true, tipo: "number" });
        if (errCantidad) nuevosErrores.cantidad = errCantidad;

        // La fecha no puede ser anterior a hoy; al editar solo se revisa si se cambió.
        const errFecha = validarCampo(fecha, { requerido: true, tipo: "date", valorOriginal: produccion.fecha });
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
          // Se entrega un objeto con los datos del formulario (en vez del evento) para poder guardarlos.
          onSubmit(Object.fromEntries(new FormData(e.currentTarget).entries()));
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

              {opcionesOrden.map((n) => (
                <option key={n} value={n}>
                  Orden de producción #{n}
                </option>
              ))}
            </select>
          </div>

          {/* CLIENTE */}
          <div className="form-campo">
            <label>Cliente</label>
            <select name="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} disabled={esConsulta} required>
              <option value="">Seleccionar cliente</option>
              {opcionesCliente.map((nombre) => (
                <option key={nombre} value={nombre}>{nombre}</option>
              ))}
            </select>
            {errores.cliente && <span className="err">{errores.cliente}</span>}
          </div>

          {/* PEDIDO */}
          <div className="form-campo">
            <label>Pedido</label>
            <select name="pedido" value={pedido} onChange={(e) => setPedido(e.target.value)} disabled={esConsulta} required>
              <option value="">Seleccionar pedido</option>
              {opcionesPedido.map((codigo) => (
                <option key={codigo} value={codigo}>{codigo}</option>
              ))}
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

              {opcionesAcopio.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
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
              min={modo === "editar" ? undefined : hoyISO()}
              max={modo === "editar" ? undefined : hoyMasAnios(1)}
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