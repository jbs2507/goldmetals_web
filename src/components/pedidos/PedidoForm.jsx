import { useState } from "react";
import { validarCampo } from "../../utils/validaciones.js";

const calcularFechaEntrega = (fechaInicio) => {
  if (!fechaInicio) return "";
  const fecha = new Date(fechaInicio);
  if (Number.isNaN(fecha.getTime())) return "";
  const dia = fecha.getDate();
  fecha.setMonth(fecha.getMonth() + 1);
  // Si el mes siguiente no tiene el mismo día, usar el último día de ese mes.
  if (fecha.getDate() !== dia) fecha.setDate(0);
  const pad = (n) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
};

const clientes = [
  {
    id_cliente: 1,
    nombre: "M&M Trading S.A.S.",
  },
  {
    id_cliente: 2,
    nombre: "Global Metals International",
  },
];

const acopios = [
  {
    id_acopio: 1,
    nombre: "Acopio Chocó",
  },
  {
    id_acopio: 2,
    nombre: "Acopio Bolívar",
  },
];

const insumos = [
  {
    id_insumo: 1,
    nombre: "Oro",
  },
  {
    id_insumo: 2,
    nombre: "Material polimetálico",
  },
];

export default function PedidoForm({
  modo = "registrar",
  datosIniciales = {},
  onGuardar,
  onCancelar,
}) {
  const [cliente, setCliente] = useState(
    datosIniciales.id_cliente || ""
  );

  const [acopio, setAcopio] = useState(
    datosIniciales.id_acopio || ""
  );

  const [fechaPedido, setFechaPedido] = useState(
    datosIniciales.fecha_pedido || ""
  );

  const fechaEntrega = calcularFechaEntrega(fechaPedido);

  const [estado, setEstado] = useState(
    datosIniciales.estado || "ABIERTO"
  );

  const [moneda, setMoneda] = useState(
    datosIniciales.moneda || "COP"
  );

  const [tasaCambio, setTasaCambio] = useState(
    datosIniciales.tasa_cambio || ""
  );

  const [valorTotal, setValorTotal] = useState(
    datosIniciales.valor_total || ""
  );

  const [valorPagado, setValorPagado] = useState(
    datosIniciales.valor_pagado || ""
  );

  const [porcentajePagoInicial, setPorcentajePagoInicial] =
    useState(
      datosIniciales.porcentaje_pago_inicial !== undefined
        ? datosIniciales.porcentaje_pago_inicial
        : 0.9
    );

  const [detalles, setDetalles] = useState(
    datosIniciales.detalles || [
      {
        id_insumo: "",
        cantidad: "",
        precio_unitario: "",
        valor_total: "",
      },
    ]
  );

  const [pagos, setPagos] = useState(
    datosIniciales.pagos || [
      {
        fecha_pago: "",
        valor: "",
        cuenta_bancaria: "",
        comprobante: null,
      },
    ]
  );

  const actualizarDetalle = (index, campo, valor) => {
    setDetalles((actuales) =>
      actuales.map((detalle, i) => {
        if (i !== index) {
          return detalle;
        }

        const actualizado = {
          ...detalle,
          [campo]: valor,
        };

        if (
          campo === "cantidad" ||
          campo === "precio_unitario"
        ) {
          const cantidad = Number(
            campo === "cantidad"
              ? valor
              : actualizado.cantidad
          );

          const precio = Number(
            campo === "precio_unitario"
              ? valor
              : actualizado.precio_unitario
          );

          actualizado.valor_total =
            cantidad > 0 && precio >= 0
              ? cantidad * precio
              : "";
        }

        return actualizado;
      })
    );
  };

  const agregarDetalle = () => {
    setDetalles((actuales) => [
      ...actuales,
      {
        id_insumo: "",
        cantidad: "",
        precio_unitario: "",
        valor_total: "",
      },
    ]);
  };

  const eliminarDetalle = (index) => {
    setDetalles((actuales) =>
      actuales.filter((_, i) => i !== index)
    );
  };

  const actualizarPago = (index, campo, valor) => {
    setPagos((actuales) =>
      actuales.map((pago, i) =>
        i === index
          ? {
              ...pago,
              [campo]: valor,
            }
          : pago
      )
    );
  };

  const eliminarPago = (index) => {
    setPagos((actuales) =>
      actuales.filter((_, i) => i !== index)
    );
  };

  const [errorFecha, setErrorFecha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const msgFecha = validarCampo(fechaPedido, { requerido: true, tipo: "date" });
    setErrorFecha(msgFecha);
    if (msgFecha) return;

    const datos = {
      id_cliente: Number(cliente),
      id_acopio: Number(acopio),
      fecha_pedido: fechaPedido,
      fecha_entrega: fechaEntrega,
      estado,
      moneda,
      tasa_cambio:
        tasaCambio === ""
          ? null
          : Number(tasaCambio),
      valor_total: Number(valorTotal),
      valor_pagado: Number(valorPagado),
      porcentaje_pago_inicial:
        Number(porcentajePagoInicial),

      detalles_pedido: detalles.map((detalle) => ({
        id_insumo: Number(detalle.id_insumo),
        cantidad: Number(detalle.cantidad),
        precio_unitario: Number(
          detalle.precio_unitario
        ),
        valor_total: Number(
          detalle.valor_total
        ),
      })),

      pagos_pedido: pagos
        .filter((pago) => pago.valor !== "")
        .map((pago) => ({
          fecha_pago: pago.fecha_pago,
          valor: Number(pago.valor),
          cuenta_bancaria: pago.cuenta_bancaria || null,
          comprobante: pago.comprobante || null,
        })),
    };

    onGuardar(datos);
  };

  return (
    <form
      className="pedido-form"
      onSubmit={handleSubmit}
    >

      {/* INFORMACIÓN PRINCIPAL */}

      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>Información del pedido</h2>
          <p>
            Registra los datos principales del pedido
          </p>
        </div>

        <div className="form-grid">

          <div className="form-campo">
            <label>Cliente</label>

            <select
              value={cliente}
              onChange={(e) =>
                setCliente(e.target.value)
              }
              required
            >
              <option value="">
                Seleccionar cliente
              </option>

              {clientes.map((item) => (
                <option
                  key={item.id_cliente}
                  value={item.id_cliente}
                >
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-campo">
            <label>Acopio</label>

            <select
              value={acopio}
              onChange={(e) =>
                setAcopio(e.target.value)
              }
              required
            >
              <option value="">
                Seleccionar acopio
              </option>

              {acopios.map((item) => (
                <option
                  key={item.id_acopio}
                  value={item.id_acopio}
                >
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-campo">
            <label>Fecha del pedido</label>

            <input
              type="datetime-local"
              value={fechaPedido}
              onChange={(e) =>
                setFechaPedido(e.target.value)
              }
              required
            />
            {errorFecha && <span className="err">{errorFecha}</span>}
          </div>

          <div className="form-campo">
            <label>Fecha de entrega</label>
            <input
              type="datetime-local"
              value={fechaEntrega}
              readOnly
            />
            <small>Se calcula automáticamente un mes después de la fecha de inicio del pedido.</small>
          </div>

          {modo === "editar" && (
            <div className="form-campo">
              <label>Estado</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)} required>
                <option value="ABIERTO">ABIERTO</option>
                <option value="EN_PRODUCCION">EN PRODUCCIÓN</option>
                <option value="LISTO">LISTO</option>
                <option value="ENTREGADO">ENTREGADO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
            </div>
          )}

          <div className="form-campo">
            <label>Moneda</label>

            <select
              value={moneda}
              onChange={(e) =>
                setMoneda(e.target.value)
              }
              required
            >
              <option value="COP">COP</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div className="form-campo">
            <label>Tasa de cambio</label>

            <input
              type="number"
              step="0.000001"
              min="0"
              value={tasaCambio}
              onChange={(e) =>
                setTasaCambio(e.target.value)
              }
              placeholder="Ingrese la tasa de cambio"
            />
          </div>

          <div className="form-campo">
            <label>Valor total</label>

            <input
              type="number"
              step="0.01"
              min="0"
              value={valorTotal}
              onChange={(e) =>
                setValorTotal(e.target.value)
              }
              required
              placeholder="Ingrese el valor total"
            />
          </div>

          <div className="form-campo">
            <label>Valor pagado</label>

            <input
              type="number"
              step="0.01"
              min="0"
              value={valorPagado}
              onChange={(e) =>
                setValorPagado(e.target.value)
              }
              required
              placeholder="Ingrese el valor pagado"
            />
          </div>

          <div className="form-campo">
            <label>
              Porcentaje de pago inicial
            </label>

            <input
              type="number"
              step="0.0001"
              min="0"
              max="1"
              value={porcentajePagoInicial}
              onChange={(e) =>
                setPorcentajePagoInicial(
                  e.target.value
                )
              }
              required
            />
          </div>

        </div>

      </section>

      {/* DETALLES */}

      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>Detalle del pedido</h2>
          <p>
            Registra los insumos incluidos en el pedido
          </p>
        </div>

        <div className="pedido-form-lista">

          {detalles.map((detalle, index) => (
            <div
              className="pedido-form-item"
              key={index}
            >

              <div className="form-campo">
                <label>Insumo</label>

                <select
                  value={detalle.id_insumo}
                  onChange={(e) =>
                    actualizarDetalle(
                      index,
                      "id_insumo",
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Seleccionar insumo
                  </option>

                  {insumos.map((item) => (
                    <option
                      key={item.id_insumo}
                      value={item.id_insumo}
                    >
                      {item.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-campo">
                <label>Cantidad</label>

                <input
                  type="number"
                  step="0.000001"
                  min="0.000001"
                  value={detalle.cantidad}
                  onChange={(e) =>
                    actualizarDetalle(
                      index,
                      "cantidad",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-campo">
                <label>Precio unitario</label>

                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  value={detalle.precio_unitario}
                  onChange={(e) =>
                    actualizarDetalle(
                      index,
                      "precio_unitario",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-campo">
                <label>Valor total</label>

                <input
                  type="number"
                  value={detalle.valor_total}
                  readOnly
                />
              </div>

              {detalles.length > 1 && (
                <button
                  type="button"
                  className="btn-eliminar-pedido-item"
                  onClick={() =>
                    eliminarDetalle(index)
                  }
                >
                  Eliminar
                </button>
              )}

            </div>
          ))}

        </div>

        <button
          type="button"
          className="btn-agregar-pedido-item"
          onClick={agregarDetalle}
        >
          + Agregar insumo
        </button>

      </section>

      {/* PAGOS */}

      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>Pagos del pedido</h2>
          <p>
            Registra los pagos realizados para el pedido
          </p>
        </div>

        <div className="pedido-form-lista">

          {pagos.map((pago, index) => (
            <div className="pedido-form-item" key={index}>

              <div className="form-campo">
                <label>Fecha de pago</label>
                <input
                  type="datetime-local"
                  value={pago.fecha_pago}
                  onChange={(e) =>
                    actualizarPago(index, "fecha_pago", e.target.value)
                  }
                />
              </div>

              <div className="form-campo">
                <label>Valor</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={pago.valor}
                  onChange={(e) =>
                    actualizarPago(index, "valor", e.target.value)
                  }
                />
              </div>

              <div className="form-campo">
                <label>Cuenta bancaria</label>
                <select
                  value={pago.cuenta_bancaria}
                  onChange={(e) =>
                    actualizarPago(index, "cuenta_bancaria", e.target.value)
                  }
                >
                  <option value="">Seleccionar cuenta</option>
                  <option value="BANCOLOMBIA">Bancolombia</option>
                  <option value="DAVIVIENDA">Davivienda</option>
                </select>
              </div>

              <div className="form-campo pedido-comprobante-campo">
                <label>Comprobante de pago</label>
                <label className="btn-adjuntar-comprobante">
                  Adjuntar imagen del comprobante
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) =>
                      actualizarPago(
                        index,
                        "comprobante",
                        e.target.files?.[0] || null
                      )
                    }
                  />
                </label>
                <small>
                  {pago.comprobante?.name || "No se ha adjuntado comprobante"}
                </small>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* ACCIONES */}

      <div className="form-acciones-pedido">

        <button
          type="button"
          className="btn-cancelar-pedido"
          onClick={onCancelar}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn-guardar-pedido"
        >
          {modo === "editar"
            ? "Guardar cambios"
            : "Registrar pedido"}
        </button>

      </div>

    </form>
  );
}