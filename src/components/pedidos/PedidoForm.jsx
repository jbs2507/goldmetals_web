import { useEffect, useState } from "react";
import { validarCampo } from "../../utils/validaciones.js";
import { usePreciosDia, precioOroPorGramo } from "../../utils/precios.js";

// El pago inicial siempre es del 90 % del valor del pedido.
const PORCENTAJE_PAGO_INICIAL = 0.9;
const ID_INSUMO_ORO = 1;

const esOro = (detalle) => Number(detalle.id_insumo) === ID_INSUMO_ORO;

const calcularTotalDetalle = (cantidad, precio) => {
  const c = Number(cantidad);
  const p = Number(precio);
  return precio !== "" && c > 0 && p >= 0 ? c * p : "";
};

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

  const [detalles, setDetalles] = useState(
    datosIniciales.detalles || [
      {
        producto: "",
        detalle_producto: "",
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
        cuenta_bancaria: "",
        comprobante: null,
      },
    ]
  );

  // Valores del pedido: todo se calcula a partir del detalle.
  // Pago inicial = 90 % del total; el 10 % restante se paga al entregar y se registra como venta.
  const redondear = (n) =>
    moneda === "USD" ? Math.round(n * 100) / 100 : Math.round(n);
  // El valor total se puede digitar; si no se digita, se sugiere la suma del detalle.
  const [valorTotalManual, setValorTotalManual] = useState(
    datosIniciales.valor_total ?? ""
  );
  const sumaDetalles = redondear(
    detalles.reduce((acc, d) => acc + (Number(d.valor_total) || 0), 0)
  );
  const valorTotal =
    valorTotalManual !== "" ? Number(valorTotalManual) || 0 : sumaDetalles;

  // Cada vez que cambia el detalle (ej. gramos de oro × precio del gramo), el valor total
  // del pedido se actualiza solo. Sigue siendo editable si hace falta ajustarlo.
  useEffect(() => {
    if (sumaDetalles > 0) setValorTotalManual(String(sumaDetalles));
  }, [sumaDetalles]);
  const valorPagado = redondear(valorTotal * PORCENTAJE_PAGO_INICIAL);
  const saldoPendiente = redondear(valorTotal - valorPagado);
  const formatoValor = (n) =>
    `${moneda} ${n.toLocaleString(moneda === "USD" ? "en-US" : "es-CO", {
      minimumFractionDigits: moneda === "USD" ? 2 : 0,
      maximumFractionDigits: moneda === "USD" ? 2 : 0,
    })}`;

  const { precios, error: errorPrecios } = usePreciosDia();

  // Cuando llega el precio del día, completa el precio de las filas de oro que estén vacías.
  useEffect(() => {
    if (!precios) return;
    const precioOro = precioOroPorGramo(precios, moneda);
    setDetalles((actuales) =>
      actuales.map((d) =>
        esOro(d) && d.precio_unitario === ""
          ? {
              ...d,
              precio_unitario: precioOro,
              valor_total: calcularTotalDetalle(d.cantidad, precioOro),
            }
          : d
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precios]);

  // Al cambiar la moneda se recalcula el precio de las filas de oro.
  const cambiarMoneda = (nuevaMoneda) => {
    setMoneda(nuevaMoneda);
    if (!precios) return;
    const precioOro = precioOroPorGramo(precios, nuevaMoneda);
    setDetalles((actuales) =>
      actuales.map((d) =>
        esOro(d)
          ? {
              ...d,
              precio_unitario: precioOro,
              valor_total: calcularTotalDetalle(d.cantidad, precioOro),
            }
          : d
      )
    );
  };

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

        // Si el insumo es oro, el precio unitario sale del precio del día.
        if (campo === "id_insumo" && Number(valor) === ID_INSUMO_ORO) {
          actualizado.precio_unitario = precioOroPorGramo(precios, moneda);
        }

        if (
          campo === "cantidad" ||
          campo === "precio_unitario" ||
          campo === "id_insumo"
        ) {
          actualizado.valor_total = calcularTotalDetalle(
            actualizado.cantidad,
            actualizado.precio_unitario
          );
        }

        return actualizado;
      })
    );
  };

  const agregarDetalle = () => {
    setDetalles((actuales) => [
      ...actuales,
      {
        producto: "",
        detalle_producto: "",
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
      valor_total: valorTotal,
      valor_pagado: valorPagado,
      saldo_pendiente: saldoPendiente,
      // Al entregar, el 10 % restante se cobra y el pedido pasa a ser una venta.
      generar_venta: estado === "ENTREGADO",
      porcentaje_pago_inicial: PORCENTAJE_PAGO_INICIAL,

      detalles_pedido: detalles.map((detalle) => ({
        producto: detalle.producto.trim(),
        detalle_producto: detalle.detalle_producto.trim(),
        id_insumo: Number(detalle.id_insumo),
        cantidad: Number(detalle.cantidad),
        precio_unitario: Number(
          detalle.precio_unitario
        ),
        valor_total: Number(
          detalle.valor_total
        ),
      })),

      // El pago inicial es el 90 % del valor total (calculado arriba).
      pagos_pedido: pagos
        .filter((pago) => Number(valorPagado) > 0)
        .map((pago) => ({
          fecha_pago: pago.fecha_pago,
          valor: Number(valorPagado),
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
                <option value="ANULADO">ANULADO</option>
              </select>
            </div>
          )}

          <div className="form-campo">
            <label>Moneda</label>

            <select
              value={moneda}
              onChange={(e) =>
                cambiarMoneda(e.target.value)
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
            <label>Valor total ({moneda})</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={valorTotalManual !== "" ? valorTotalManual : sumaDetalles || ""}
              onChange={(e) => setValorTotalManual(e.target.value)}
              placeholder="Ingrese el valor total"
              required
            />
            <small>Ingresa el valor del pedido; el 90 % y el 10 % se calculan solos.</small>
          </div>

          <div className="form-campo">
            <label>Valor pagado (pago inicial 90 %)</label>
            <input type="text" value={formatoValor(valorPagado)} readOnly />
            <small>Se calcula automáticamente.</small>
          </div>

          <div className="form-campo">
            <label>Saldo pendiente (10 %)</label>
            <input type="text" value={formatoValor(saldoPendiente)} readOnly />
            <small>
              {estado === "ENTREGADO"
                ? "Al guardar como entregado, este saldo se registra como venta."
                : "Se paga al entregar el pedido y ahí pasa a ser una venta."}
            </small>
          </div>

        </div>

      </section>

      {/* DETALLES */}

      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>Detalle del pedido</h2>
          <p>
            Registra los productos del pedido (puede ser más de uno) y el insumo con el que se elaboran
          </p>
        </div>

        <div className="pedido-form-lista">

          {detalles.map((detalle, index) => {
            const oro = esOro(detalle);

            return (
              <div
                className="pedido-form-item pedido-detalle-form"
                key={index}
              >

                <div className="pedido-detalle-titulo">
                  <strong>Producto {index + 1}</strong>

                  {detalles.length > 1 && (
                    <button
                      type="button"
                      className="btn-eliminar-pedido-item"
                      onClick={() => eliminarDetalle(index)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="form-campo pd-insumo">
                  <label>Insumo / material</label>

                  <select
                    value={detalle.id_insumo}
                    onChange={(e) =>
                      actualizarDetalle(index, "id_insumo", e.target.value)
                    }
                    required
                  >
                    <option value="">Seleccionar insumo</option>

                    {insumos.map((item) => (
                      <option key={item.id_insumo} value={item.id_insumo}>
                        {item.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {detalle.id_insumo !== "" && (
                  <>
                    <div className="form-campo pd-producto">
                      <label>Producto</label>

                      <input
                        type="text"
                        value={detalle.producto}
                        onChange={(e) => actualizarDetalle(index, "producto", e.target.value)}
                        placeholder="Ej. Metalpolietileno, Oro en lingote"
                        required
                      />
                    </div>

                    <div className="form-campo pd-descripcion">
                      <label>Descripción del producto</label>

                      <textarea
                        rows="3"
                        value={detalle.detalle_producto}
                        onChange={(e) => actualizarDetalle(index, "detalle_producto", e.target.value)}
                        placeholder="Especificaciones, pureza, presentación, observaciones..."
                        required
                      />
                    </div>

                    <div className="form-campo pd-cantidad">
                      <label>Cantidad</label>

                      <input
                        type="number"
                        step="0.000001"
                        min="0.000001"
                        value={detalle.cantidad}
                        onChange={(e) =>
                          actualizarDetalle(index, "cantidad", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-campo pd-precio">
                      <label>
                        {oro ? `Precio unitario por gramo (${moneda})` : `Precio unitario (${moneda})`}
                      </label>

                      <input
                        type="number"
                        step="0.000001"
                        min="0"
                        value={detalle.precio_unitario}
                        readOnly={oro && !!precios}
                        onChange={(e) =>
                          actualizarDetalle(index, "precio_unitario", e.target.value)
                        }
                        placeholder={oro && !precios && !errorPrecios ? "Cargando precio del oro..." : ""}
                        required
                      />
                      {oro && errorPrecios && !precios && (
                        <small>No se pudo obtener el precio del oro; ingrésalo manualmente.</small>
                      )}
                    </div>

                    <div className="form-campo pd-total">
                      <label>Valor total</label>

                      <input
                        type="number"
                        value={detalle.valor_total}
                        readOnly
                        required
                      />
                      {detalle.valor_total !== "" && (
                        <small>
                          {Number(detalle.cantidad).toLocaleString("es-CO")}
                          {oro ? " g" : ""} × {formatoValor(Number(detalle.precio_unitario))}
                        </small>
                      )}
                    </div>
                  </>
                )}

              </div>
            );
          })}

        </div>

        <button
          type="button"
          className="btn-agregar-pedido-item"
          onClick={agregarDetalle}
        >
          + Agregar producto
        </button>

      </section>

      {/* PAGOS */}

      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>Pagos del pedido</h2>
          <p>
            Registra el pago realizado (pago inicial del 90 % del valor total)
          </p>
        </div>

        <div className="pedido-form-lista">

          {pagos.map((pago, index) => (
            <div className="pedido-form-item pedido-pago-form" key={index}>

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
                <label
                  className={`btn-adjuntar-comprobante${pago.comprobante ? " adjunto" : ""}`}
                  title={pago.comprobante?.name || ""}
                >
                  <span>
                    {pago.comprobante
                      ? `✓ ${pago.comprobante.name}`
                      : "Adjuntar imagen del comprobante"}
                  </span>
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