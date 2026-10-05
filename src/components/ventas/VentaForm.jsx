import { useEffect, useMemo, useState } from "react";
import { filtrarSoloDigitos, filtrarSoloLetras, validarFormulario } from "../../utils/validaciones.js";
import DocumentoAdjunto from "../DocumentoAdjunto.jsx";
import { pedidosParaVenta, codigoPedido, materialDeInsumo } from "../../data/pedidosMock.js";
import { ACOPIOS, MINAS } from "../../data/origenes.js";
import { contactoDeCliente } from "../../data/clientesMock.js";

const DATOS_INICIALES_VACIOS = Object.freeze({});

const ORO = "Oro en lingote";
const ARENAS = "Arenas polimetálicas";

// Convierte "500 g" o "1.000 kg" en número (el punto es separador de miles).
const numeroDe = (valor) => {
  if (typeof valor === "number") return valor;
  const m = String(valor ?? "").match(/[\d.,]+/);
  if (!m) return 0;
  let t = m[0];
  if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");
  else t = t.replace(",", ".");
  return Number(t) || 0;
};

const unidadBaseDe = (material) =>
  material === ORO ? "Gramos" : material === ARENAS ? "Toneladas" : "";

const crearFormularioVenta = (datos = DATOS_INICIALES_VACIOS) => {
  const cantidadNum = numeroDe(datos.cantidad);
  const precioUnitario =
    datos.precio_unitario ??
    (cantidadNum > 0 && numeroDe(datos.precio) > 0
      ? Math.round((numeroDe(datos.precio) / cantidadNum) * 100) / 100
      : "");

  return {
    cliente: datos.cliente || "",
    pedido: datos.pedido || "",
    tipo_material: datos.tipo_material || "",
    unidad_medida: datos.unidad_medida || unidadBaseDe(datos.tipo_material),
    cantidad: cantidadNum > 0 ? String(cantidadNum) : "",
    ley: datos.ley || "",
    precio_unitario: precioUnitario,
    moneda: datos.moneda || "COP",
    fecha: datos.fecha || "",
    pais_destino: datos.pais_destino || "",
    acopio: datos.acopio || "",
    mina: datos.mina || "",
    encargado_transporte: datos.encargado_transporte || "",
    placa_vehiculo: datos.placa_vehiculo || "",
    direccion_puerto: datos.direccion_puerto || "",
    contacto_entrega_nombre: datos.contacto_entrega_nombre || "",
    contacto_entrega_telefono: datos.contacto_entrega_telefono || "",
    estado: datos.estado || "REGISTRADA",
    factura: datos.factura || null,
    resultado_laboratorio: datos.resultado_laboratorio || null,
  };
};

// Reglas comunes; las específicas de oro o arenas se agregan según el material.
const reglasVenta = (material, directa) => ({
  cliente: { requerido: true },
  ...(directa ? {} : { pedido: { requerido: true } }),
  tipo_material: { requerido: true },
  cantidad: { requerido: true, tipo: "number" },
  ...(material === ARENAS ? { ley: { requerido: true, tipo: "number" } } : {}),
  precio_unitario: { requerido: true, tipo: "number" },
  fecha: { requerido: true, tipo: "date" },
  pais_destino: { requerido: true, soloLetras: true },
  acopio: { requerido: true },
  mina: { requerido: true },
  // La venta solo existe cuando el pedido está 100 % pagado: el transporte se registra aquí.
  encargado_transporte: { requerido: true, soloLetras: true },
  placa_vehiculo: { requerido: true },
  direccion_puerto: { requerido: true },
  contacto_entrega_nombre: { requerido: true, soloLetras: true },
  contacto_entrega_telefono: { requerido: true, soloDigitos: true },
});

export default function VentaForm({
  datosIniciales = DATOS_INICIALES_VACIOS,
  onSubmit,
  onCancel,
  modoEdicion = false,
  ventaDirecta = false,
}) {
  // Toda venta nueva sale de un pedido: el pedido define si es oro o arenas.
  // (Las ventas directas de oro antiguas se siguen mostrando y editando.)
  const directa = ventaDirecta || datosIniciales.pedido === "Venta directa";

  const [formulario, setFormulario] = useState(() =>
    ventaDirecta
      ? { ...crearFormularioVenta(datosIniciales), pedido: "Venta directa", tipo_material: ORO, unidad_medida: "Gramos" }
      : crearFormularioVenta(datosIniciales)
  );

  // En REGISTRAR no se reinicia el formulario al cambiar cualquier estado interno.
  // En EDITAR sí se cargan los datos de la venta seleccionada.
  useEffect(() => {
    if (modoEdicion) {
      setFormulario(crearFormularioVenta(datosIniciales));
    }
  }, [modoEdicion, datosIniciales]);

  const [errores, setErrores] = useState({});
  const [paises, setPaises] = useState(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem("goldmetal_paises_destino"));
      return Array.isArray(guardados) && guardados.length
        ? guardados
        : ["Singapur", "Estados Unidos", "China"];
    } catch {
      return ["Singapur", "Estados Unidos", "China"];
    }
  });
  const [mostrarNuevoPais, setMostrarNuevoPais] = useState(false);
  const [nuevoPais, setNuevoPais] = useState("");
  const [unidadesPersonalizadas, setUnidadesPersonalizadas] = useState(() => {
    try {
      const guardadas = JSON.parse(localStorage.getItem("goldmetal_unidades_medida"));
      return Array.isArray(guardadas) ? guardadas : [];
    } catch {
      return [];
    }
  });
  const [mostrarNuevaUnidad, setMostrarNuevaUnidad] = useState(false);
  const [nuevaUnidad, setNuevaUnidad] = useState("");

  // Hasta que no se elija un pedido solo se muestra el selector de pedido.
  const mostrarCampos = directa || !!formulario.pedido;

  const material = formulario.tipo_material;
  const esOro = material === ORO;
  const esArenas = material === ARENAS;
  const unidadBase = unidadBaseDe(material);

  // Pedidos que se pueden relacionar con la venta (listos o entregados); en edición se conserva el actual.
  const pedidoSeleccionado = useMemo(
    () => pedidosParaVenta.find((p) => codigoPedido(p.id_pedido) === formulario.pedido) || null,
    [formulario.pedido]
  );
  const opcionesPedido = useMemo(() => {
    const codigos = pedidosParaVenta.map((p) => codigoPedido(p.id_pedido));
    return datosIniciales.pedido && datosIniciales.pedido !== "Venta directa" && !codigos.includes(datosIniciales.pedido)
      ? [...codigos, datosIniciales.pedido]
      : codigos;
  }, [datosIniciales.pedido]);

  // Materiales que trae el pedido seleccionado.
  const materialesDelPedido = useMemo(() => {
    if (!pedidoSeleccionado) return [];
    return [...new Set(pedidoSeleccionado.detalles.map((d) => materialDeInsumo(d.insumo)))];
  }, [pedidoSeleccionado]);

  const unidadesDisponibles = useMemo(() => {
    return [...new Set([unidadBase, ...unidadesPersonalizadas].filter(Boolean))];
  }, [unidadBase, unidadesPersonalizadas]);

  useEffect(() => {
    if (unidadBase && !formulario.unidad_medida) {
      setFormulario((prev) => ({ ...prev, unidad_medida: unidadBase }));
    }
  }, [unidadBase]);

  useEffect(() => {
    localStorage.setItem("goldmetal_paises_destino", JSON.stringify(paises));
  }, [paises]);

  useEffect(() => {
    localStorage.setItem("goldmetal_unidades_medida", JSON.stringify(unidadesPersonalizadas));
  }, [unidadesPersonalizadas]);

  // Valor total de la venta = cantidad × precio unitario.
  const cantidadNum = Number(formulario.cantidad) || 0;
  const precioNum = Number(formulario.precio_unitario) || 0;
  const valorTotal = cantidadNum > 0 && precioNum >= 0 ? cantidadNum * precioNum : 0;
  const formatoValor = (n) =>
    `${formulario.moneda || "COP"} ${n.toLocaleString(formulario.moneda === "USD" ? "en-US" : "es-CO", {
      minimumFractionDigits: formulario.moneda === "USD" ? 2 : 0,
      maximumFractionDigits: formulario.moneda === "USD" ? 2 : 0,
    })}`;

  // Carga en el formulario los datos del material elegido dentro del pedido.
  const datosDePedido = (pedido, materialElegido) => {
    const detalles = pedido.detalles.filter((d) => materialDeInsumo(d.insumo) === materialElegido);
    const cantidad = detalles.reduce((acc, d) => acc + d.cantidad, 0);
    const total = detalles.reduce((acc, d) => acc + d.cantidad * d.precio_unitario, 0);
    return {
      tipo_material: materialElegido,
      unidad_medida: unidadBaseDe(materialElegido),
      cantidad: cantidad ? String(cantidad) : "",
      precio_unitario: cantidad ? Math.round((total / cantidad) * 100) / 100 : "",
    };
  };

  const cambiarPedido = (codigo) => {
    const pedido = pedidosParaVenta.find((p) => codigoPedido(p.id_pedido) === codigo);
    if (!pedido) {
      setFormulario((prev) => ({ ...prev, pedido: codigo }));
      return;
    }
    const primerMaterial = materialDeInsumo(pedido.detalles[0].insumo);
    setFormulario((prev) => ({
      ...prev,
      pedido: codigo,
      cliente: pedido.cliente,
      contacto_entrega_nombre: prev.contacto_entrega_nombre || contactoDeCliente(pedido.cliente)?.nombre || pedido.cliente,
      contacto_entrega_telefono: prev.contacto_entrega_telefono || contactoDeCliente(pedido.cliente)?.telefono || "",
      moneda: pedido.moneda,
      acopio: pedido.acopio || prev.acopio,
      ley: "",
      ...datosDePedido(pedido, primerMaterial),
    }));
    setErrores((prev) => ({ ...prev, pedido: undefined, cliente: undefined }));
  };

  const agregarPais = () => {
    const pais = nuevoPais.trim().replace(/\s+/g, " ");
    if (!pais) return;
    const existente = paises.find((item) => item.toLowerCase() === pais.toLowerCase());
    if (existente) {
      setFormulario((prev) => ({ ...prev, pais_destino: existente }));
    } else {
      setPaises((prev) => [...prev, pais]);
      setFormulario((prev) => ({ ...prev, pais_destino: pais }));
    }
    setNuevoPais("");
    setMostrarNuevoPais(false);
  };

  const agregarUnidad = () => {
    const unidad = nuevaUnidad.trim().replace(/\s+/g, " ");
    if (!unidad) return;
    const existente = unidadesDisponibles.find((item) => item.toLowerCase() === unidad.toLowerCase());
    if (existente) {
      setFormulario((prev) => ({ ...prev, unidad_medida: existente }));
    } else {
      setUnidadesPersonalizadas((prev) => [...prev, unidad]);
      setFormulario((prev) => ({ ...prev, unidad_medida: unidad }));
    }
    setNuevaUnidad("");
    setMostrarNuevaUnidad(false);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    if (name === "tipo_material") {
      // Con un pedido, el material cambia los datos que trae el pedido para ese material.
      if (pedidoSeleccionado && !directa) {
        setFormulario((prev) => ({ ...prev, ley: "", ...datosDePedido(pedidoSeleccionado, value) }));
      } else {
        setFormulario((prev) => ({
          ...prev,
          tipo_material: value,
          unidad_medida: unidadBaseDe(value),
          ley: "",
        }));
      }
      setErrores((prev) => ({ ...prev, tipo_material: undefined, unidad_medida: undefined }));
      return;
    }

    const limpio =
      name === "pais_destino" || name === "encargado_transporte" || name === "contacto_entrega_nombre"
        ? filtrarSoloLetras(value)
        : name === "contacto_entrega_telefono"
        ? filtrarSoloDigitos(value)
        : value;

    setFormulario((prev) => ({
      ...prev,
      [name]: limpio,
    }));
  };

  const manejarArchivoDocumento = (e) => {
    const { name, files } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: files?.[0] || null }));
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario(formulario, reglasVenta(material, directa));

    if (!formulario.factura) nuevosErrores.factura = "Adjunte la factura";
    if (!formulario.resultado_laboratorio) nuevosErrores.resultado_laboratorio = "Adjunte el resultado de laboratorio";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onSubmit({
      ...formulario,
      origen: directa ? "DIRECTA" : "PEDIDO",
      id_pedido: pedidoSeleccionado?.id_pedido ?? null,
      cantidad: cantidadNum,
      ley: esArenas ? Number(formulario.ley) : null,
      precio_unitario: precioNum,
      valor_total: valorTotal,
      // Compatibilidad con el listado: "precio" es el valor total de la venta.
      precio: String(valorTotal),
    });
  };

  const etiquetaCantidad = esArenas ? "Cantidad (toneladas)" : esOro ? "Cantidad (gramos)" : "Cantidad";
  const etiquetaPrecio = esArenas ? "Precio por tonelada" : esOro ? "Precio por gramo" : "Precio unitario";

  return (
    <form
      className="venta-form"
      onSubmit={manejarSubmit}
    >

      {/* =========================================
          INFORMACIÓN DE LA VENTA
      ========================================= */}

      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>Información de la venta</h2>
          <p>Registra los datos principales de la operación comercial.</p>
        </div>

        <div className="form-grid">

          {/* PEDIDO: las ventas de producción nacen del pedido pagado completamente */}

          {!directa && (
            <div className="form-campo">
              <label htmlFor="pedido">Pedido</label>
              <select
                id="pedido"
                name="pedido"
                value={formulario.pedido}
                onChange={(e) => cambiarPedido(e.target.value)}
                disabled={modoEdicion}
                required
              >
                <option value="">Seleccione el pedido</option>
                {opcionesPedido.map((codigo) => {
                  const ped = pedidosParaVenta.find((p) => codigoPedido(p.id_pedido) === codigo);
                  return (
                    <option key={codigo} value={codigo}>
                      {ped ? `${codigo} · ${ped.cliente}` : codigo}
                    </option>
                  );
                })}
              </select>
              {errores.pedido && <span className="err">{errores.pedido}</span>}
              {pedidoSeleccionado && (
                <small>
                  Pedido {formulario.pedido} · valor total {pedidoSeleccionado.moneda}{" "}
                  {pedidoSeleccionado.valor_total.toLocaleString("es-CO")}. Los datos se cargan desde el pedido.
                </small>
              )}
            </div>
          )}

          {mostrarCampos && (
          <>
          {/* CLIENTE */}

          <div className="form-campo">
            <label htmlFor="cliente">Cliente</label>
            <select
              id="cliente"
              name="cliente"
              value={formulario.cliente}
              onChange={manejarCambio}
              disabled={!directa && !!pedidoSeleccionado}
              required
            >
              <option value="">Seleccione el cliente</option>
              <option value="M&M Trading S.A.S.">M&M Trading S.A.S.</option>
              <option value="Global Metals International">Global Metals International</option>
            </select>
            {errores.cliente && <span className="err">{errores.cliente}</span>}
          </div>

          {/* TIPO DE MATERIAL */}

          <div className="form-campo">
            <label htmlFor="tipo_material">Tipo de material</label>
            <select
              id="tipo_material"
              name="tipo_material"
              value={formulario.tipo_material}
              onChange={manejarCambio}
              disabled={directa || (pedidoSeleccionado ? materialesDelPedido.length <= 1 : !modoEdicion)}
              required
            >
              <option value="">
                {!directa && !formulario.pedido ? "Se define con el pedido" : "Seleccione"}
              </option>
              {(directa || !pedidoSeleccionado || materialesDelPedido.includes(ORO)) && (
                <option value={ORO}>Oro en lingote</option>
              )}
              {!directa && (!pedidoSeleccionado || materialesDelPedido.includes(ARENAS)) && (
                <option value={ARENAS}>Arenas polimetálicas</option>
              )}
            </select>
            {errores.tipo_material && <span className="err">{errores.tipo_material}</span>}
          </div>

          {/* UNIDAD DE MEDIDA */}

          <div className="form-campo">
            <label htmlFor="unidad_medida">Unidad de medida</label>
            <select
              id="unidad_medida"
              name="unidad_medida"
              value={formulario.unidad_medida}
              onChange={(e) => {
                if (e.target.value === "__AGREGAR_UNIDAD__") {
                  setMostrarNuevaUnidad(true);
                  return;
                }
                manejarCambio(e);
              }}
              required
              disabled={!material}
            >
              <option value="">
                {material ? "Seleccione la unidad" : "Seleccione primero el material"}
              </option>
              {unidadBase && <option value={unidadBase}>{unidadBase}</option>}
              {unidadesPersonalizadas
                .filter((unidad) => unidad !== unidadBase)
                .map((unidad) => (
                  <option key={unidad} value={unidad}>{unidad}</option>
                ))}
              <option value="__AGREGAR_UNIDAD__">+ Agregar unidad de medida</option>
            </select>
          </div>

          {/* DATOS SEGÚN EL MATERIAL */}

          {material && (
            <>
              <div className="form-campo">
                <label htmlFor="cantidad">{etiquetaCantidad}</label>
                <input
                  id="cantidad"
                  name="cantidad"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={formulario.cantidad}
                  onChange={manejarCambio}
                  placeholder="Ingrese la cantidad"
                  required
                />
                {errores.cantidad && <span className="err">{errores.cantidad}</span>}
              </div>

              {esArenas && (
                <div className="form-campo">
                  <label htmlFor="ley">Ley (gramos por tonelada)</label>
                  <input
                    id="ley"
                    name="ley"
                    type="number"
                    step="0.0001"
                    min="0"
                    value={formulario.ley}
                    onChange={manejarCambio}
                    placeholder="Ej. 12.5"
                    required
                  />
                  {errores.ley && <span className="err">{errores.ley}</span>}
                </div>
              )}

              <div className="form-campo">
                <label htmlFor="precio_unitario">{etiquetaPrecio}</label>
                <input
                  id="precio_unitario"
                  name="precio_unitario"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={formulario.precio_unitario}
                  onChange={manejarCambio}
                  placeholder="Ingrese el precio"
                  required
                />
                {errores.precio_unitario && <span className="err">{errores.precio_unitario}</span>}
              </div>

              <div className="form-campo">
                <label htmlFor="moneda">Moneda</label>
                <select
                  id="moneda"
                  name="moneda"
                  value={formulario.moneda}
                  onChange={manejarCambio}
                  disabled={!directa && !!pedidoSeleccionado}
                  required
                >
                  <option value="">Seleccione la moneda</option>
                  <option value="COP">COP - Peso colombiano</option>
                  <option value="USD">USD - Dólar estadounidense</option>
                </select>
              </div>

              <div className="form-campo">
                <label>Valor total de la venta</label>
                <input type="text" value={formatoValor(valorTotal)} readOnly />
                <small>
                  {cantidadNum > 0 && precioNum >= 0
                    ? `${cantidadNum.toLocaleString("es-CO")} × ${formatoValor(precioNum)}`
                    : "Cantidad × precio"}
                </small>
              </div>
            </>
          )}

          {/* FECHA */}

          <div className="form-campo">
            <label htmlFor="fecha">Fecha</label>
            <input
              id="fecha"
              name="fecha"
              type="date"
              value={formulario.fecha}
              onChange={manejarCambio}
              required
            />
            {errores.fecha && <span className="err">{errores.fecha}</span>}
          </div>

          {/* PAÍS DESTINO */}

          <div className="form-campo">
            <label htmlFor="pais_destino">País destino</label>
            <select
              id="pais_destino"
              name="pais_destino"
              value={formulario.pais_destino}
              onChange={(e) => {
                if (e.target.value === "__AGREGAR_PAIS__") {
                  setMostrarNuevoPais(true);
                  return;
                }
                manejarCambio(e);
              }}
              required
            >
              <option value="">Seleccione el país destino</option>
              {paises.map((pais) => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
              <option value="__AGREGAR_PAIS__">+ Agregar país</option>
            </select>
            {errores.pais_destino && <span className="err">{errores.pais_destino}</span>}
          </div>

          {/* ACOPIO Y MINA DE ORIGEN */}

          <div className="form-campo">
            <label htmlFor="acopio">Acopio de origen</label>
            <select
              id="acopio"
              name="acopio"
              value={formulario.acopio}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccione el acopio</option>
              {[...new Set([...ACOPIOS, formulario.acopio].filter(Boolean))].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            {errores.acopio && <span className="err">{errores.acopio}</span>}
          </div>

          <div className="form-campo">
            <label htmlFor="mina">Mina de origen</label>
            <select
              id="mina"
              name="mina"
              value={formulario.mina}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccione la mina</option>
              {[...new Set([...MINAS, formulario.mina].filter(Boolean))].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errores.mina && <span className="err">{errores.mina}</span>}
          </div>

          {modoEdicion && (
            <div className="form-campo">
              <label htmlFor="estado">Estado</label>
              <select id="estado" name="estado" value={formulario.estado} onChange={manejarCambio} required>
                <option value="REGISTRADA">REGISTRADA</option>
                <option value="DESPACHADA">DESPACHADA</option>
                <option value="ENTREGADA">ENTREGADA</option>
                <option value="ANULADA">ANULADA</option>
              </select>
            </div>
          )}

          </>
          )}

        </div>

      </section>

      {mostrarCampos && (
      <>
      {/* =========================================
          TRANSPORTE (la venta ya está 100 % pagada)
      ========================================= */}

      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>Información de transporte</h2>
          <p>Datos de quien transporta el material. La venta se registra cuando el pedido ya está pagado por completo.</p>
        </div>

        <div className="form-grid">
          <div className="form-campo">
            <label htmlFor="encargado_transporte">Encargado de transporte</label>
            <input
              id="encargado_transporte"
              name="encargado_transporte"
              type="text"
              value={formulario.encargado_transporte}
              onChange={manejarCambio}
              placeholder="Ingrese el encargado de transporte"
              required
            />
            {errores.encargado_transporte && <span className="err">{errores.encargado_transporte}</span>}
          </div>

          <div className="form-campo">
            <label htmlFor="placa_vehiculo">Placa del vehículo</label>
            <input
              id="placa_vehiculo"
              name="placa_vehiculo"
              type="text"
              value={formulario.placa_vehiculo}
              onChange={(e) =>
                manejarCambio({ target: { name: "placa_vehiculo", value: e.target.value.toUpperCase() } })
              }
              placeholder="Ej. ABC123"
              maxLength={10}
              required
            />
            {errores.placa_vehiculo && <span className="err">{errores.placa_vehiculo}</span>}
          </div>

          <div className="form-campo">
            <label htmlFor="direccion_puerto">Dirección del puerto</label>
            <input
              id="direccion_puerto"
              name="direccion_puerto"
              type="text"
              value={formulario.direccion_puerto}
              onChange={manejarCambio}
              placeholder="Ej. Puerto de Cartagena, Terminal Contecar"
              required
            />
            {errores.direccion_puerto && <span className="err">{errores.direccion_puerto}</span>}
          </div>

          <div className="form-campo">
            <label htmlFor="contacto_entrega_nombre">Nombre del cliente que recibe</label>
            <input
              id="contacto_entrega_nombre"
              name="contacto_entrega_nombre"
              type="text"
              value={formulario.contacto_entrega_nombre}
              onChange={manejarCambio}
              placeholder="Persona del cliente que recibe la entrega"
              required
            />
            {errores.contacto_entrega_nombre && <span className="err">{errores.contacto_entrega_nombre}</span>}
          </div>

          <div className="form-campo">
            <label htmlFor="contacto_entrega_telefono">Número de contacto para la entrega</label>
            <input
              id="contacto_entrega_telefono"
              name="contacto_entrega_telefono"
              type="text"
              inputMode="numeric"
              value={formulario.contacto_entrega_telefono}
              onChange={manejarCambio}
              placeholder="Ingrese el número de teléfono"
              required
            />
            {errores.contacto_entrega_telefono && <span className="err">{errores.contacto_entrega_telefono}</span>}
          </div>
        </div>

      </section>

      {/* =========================================
          DOCUMENTOS LEGALES
      ========================================= */}

      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>Documentos legales de la venta</h2>
          <p>Registra la documentación legal asociada a la venta.</p>
        </div>

        <div className="documentos-unificados-grid">
          <DocumentoAdjunto
            titulo="Factura"
            name="factura"
            value={formulario.factura}
            onChange={manejarArchivoDocumento}
            accept=".pdf,image/*"
            error={errores.factura}
          />

          <DocumentoAdjunto
            titulo="Resultado de laboratorio"
            name="resultado_laboratorio"
            value={formulario.resultado_laboratorio}
            onChange={manejarArchivoDocumento}
            accept=".pdf,image/*"
            error={errores.resultado_laboratorio}
          />
        </div>

      </section>

      </>
      )}

      {/* =========================================
          ACCIONES
      ========================================= */}

      <div className="form-acciones-venta">

        <button type="button" className="btn-cancelar-venta" onClick={onCancel}>
          Cancelar
        </button>

        <button type="submit" className="btn-guardar-venta" disabled={!mostrarCampos}>
          {modoEdicion ? "Guardar cambios" : "Registrar venta"}
        </button>

      </div>

      {mostrarNuevoPais && (
        <div className="venta-modal-backdrop" role="presentation" onMouseDown={() => setMostrarNuevoPais(false)}>
          <div className="venta-modal" role="dialog" aria-modal="true" aria-labelledby="modal-pais-titulo" onMouseDown={(e) => e.stopPropagation()}>
            <div className="venta-modal-header">
              <div>
                <h3 id="modal-pais-titulo">Agregar país</h3>
                <p>Escribe el nuevo país que quieres añadir a la lista.</p>
              </div>
              <button type="button" className="venta-modal-cerrar" onClick={() => setMostrarNuevoPais(false)} aria-label="Cerrar">×</button>
            </div>
            <input
              type="text"
              value={nuevoPais}
              onChange={(e) => setNuevoPais(e.target.value)}
              placeholder="Ej. Canadá"
              autoFocus
            />
            <div className="venta-modal-acciones">
              <button type="button" className="btn-cancelar-venta" onClick={() => setMostrarNuevoPais(false)}>Cancelar</button>
              <button type="button" className="btn-guardar-venta" onClick={agregarPais}>Agregar país</button>
            </div>
          </div>
        </div>
      )}

      {mostrarNuevaUnidad && (
        <div className="venta-modal-backdrop" role="presentation" onMouseDown={() => setMostrarNuevaUnidad(false)}>
          <div className="venta-modal" role="dialog" aria-modal="true" aria-labelledby="modal-unidad-titulo" onMouseDown={(e) => e.stopPropagation()}>
            <div className="venta-modal-header">
              <div>
                <h3 id="modal-unidad-titulo">Agregar unidad de medida</h3>
                <p>Escribe la nueva unidad que quieres añadir a la lista.</p>
              </div>
              <button type="button" className="venta-modal-cerrar" onClick={() => setMostrarNuevaUnidad(false)} aria-label="Cerrar">×</button>
            </div>
            <input
              type="text"
              value={nuevaUnidad}
              onChange={(e) => setNuevaUnidad(e.target.value)}
              placeholder="Ej. Kilogramos"
              autoFocus
            />
            <div className="venta-modal-acciones">
              <button type="button" className="btn-cancelar-venta" onClick={() => setMostrarNuevaUnidad(false)}>Cancelar</button>
              <button type="button" className="btn-guardar-venta" onClick={agregarUnidad}>Agregar unidad</button>
            </div>
          </div>
        </div>
      )}

    </form>
  );
}