import { useEffect, useMemo, useState } from "react";
import { filtrarSoloLetras, validarFormulario } from "../../utils/validaciones.js";
import DocumentoAdjunto from "../DocumentoAdjunto.jsx";

const DATOS_INICIALES_VACIOS = Object.freeze({});

const crearFormularioVenta = (datos = DATOS_INICIALES_VACIOS) => ({
  cliente: datos.cliente || "",
  pedido: datos.pedido || "",
  tipo_material: datos.tipo_material || "",
  unidad_medida: datos.unidad_medida || "",
  cantidad: datos.cantidad || "",
  precio: datos.precio || "",
  moneda: datos.moneda || "COP",
  fecha: datos.fecha || "",
  pais_destino: datos.pais_destino || "",
  encargado_transporte: datos.encargado_transporte || "",
  placa_vehiculo: datos.placa_vehiculo || "",
  estado: datos.estado || "REGISTRADA",
  factura: datos.factura || null,
  resultado_laboratorio: datos.resultado_laboratorio || null,
});

const REGLAS_VENTA = {
  cliente: { requerido: true },
  pedido: { requerido: true },
  tipo_material: { requerido: true },
  cantidad: { requerido: true },
  precio: { requerido: true, tipo: "number" },
  fecha: { requerido: true, tipo: "date" },
  pais_destino: { requerido: true, soloLetras: true },
  encargado_transporte: { soloLetras: true },
};

export default function VentaForm({
  datosIniciales = DATOS_INICIALES_VACIOS,
  onSubmit,
  onCancel,
  modoEdicion = false,
}) {
  const [formulario, setFormulario] = useState(() => crearFormularioVenta(datosIniciales));

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

  const unidadBase = formulario.tipo_material === "Oro en lingote"
    ? "Gramos"
    : formulario.tipo_material === "Arenas polimetálicas"
      ? "Gramos por tonelada"
      : "";

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
      const unidad = value === "Oro en lingote"
        ? "Gramos"
        : value === "Arenas polimetálicas"
          ? "Gramos por tonelada"
          : "";

      setFormulario((prev) => ({
        ...prev,
        tipo_material: value,
        unidad_medida: unidad,
      }));
      setErrores((prev) => ({ ...prev, tipo_material: undefined, unidad_medida: undefined }));
      return;
    }

    const limpio =
      name === "pais_destino" || name === "encargado_transporte" ? filtrarSoloLetras(value) : value;

    setFormulario((prev) => ({
      ...prev,
      [name]: limpio,
    }));
  };

  const puedeIngresarTransporte =
    datosIniciales?.pago_completo === true &&
    datosIniciales?.produccion_lista === true;

  const manejarArchivoDocumento = (e) => {
    const { name, files } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: files?.[0] || null }));
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario(formulario, REGLAS_VENTA);

    if (!formulario.factura) nuevosErrores.factura = "Adjunte la factura";
    if (!formulario.resultado_laboratorio) nuevosErrores.resultado_laboratorio = "Adjunte el resultado de laboratorio";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onSubmit(formulario);
  };

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

          <h2>
            Información de la venta
          </h2>

          <p>
            Registra los datos principales de la operación comercial.
          </p>

        </div>

        <div className="form-grid">

          {/* CLIENTE */}

          <div className="form-campo">

            <label htmlFor="cliente">
              Cliente
            </label>

            <select
              id="cliente"
              name="cliente"
              value={formulario.cliente}
              onChange={manejarCambio}
              required
            >
              <option value="">
                Seleccione el cliente
              </option>

              <option value="M&M Trading S.A.S.">
                M&M Trading S.A.S.
              </option>

              <option value="Global Metals International">
                Global Metals International
              </option>
            </select>
            {errores.cliente && <span className="err">{errores.cliente}</span>}

          </div>

          {/* PEDIDO */}

          <div className="form-campo">

            <label htmlFor="pedido">
              Pedido
            </label>

            <select
              id="pedido"
              name="pedido"
              value={formulario.pedido}
              onChange={manejarCambio}
              required
            >
              <option value="">
                Seleccione el pedido
              </option>

              <option value="PED-001">
                PED-001
              </option>

              <option value="PED-002">
                PED-002
              </option>

              <option value="PED-003">
                PED-003
              </option>
            </select>
            {errores.pedido && <span className="err">{errores.pedido}</span>}

          </div>

          {/* TIPO DE MATERIAL */}

          <div className="form-campo">

            <label htmlFor="tipo_material">
              Tipo de material
            </label>

            <select
              id="tipo_material"
              name="tipo_material"
              value={formulario.tipo_material}
              onChange={manejarCambio}
              required
            >
              <option value="">
                Seleccione
              </option>

              <option value="Oro en lingote">
                Oro en lingote
              </option>

              <option value="Arenas polimetálicas">
                Arenas polimetálicas
              </option>
            </select>
            {errores.tipo_material && <span className="err">{errores.tipo_material}</span>}

          </div>

          {/* UNIDAD DE MEDIDA */}

          <div className="form-campo">
            <label htmlFor="unidad_medida">
              Unidad de medida
            </label>

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
              disabled={!formulario.tipo_material}
            >
              <option value="">
                {formulario.tipo_material ? "Seleccione la unidad" : "Seleccione primero el material"}
              </option>
              {unidadBase && (
                <option value={unidadBase}>{unidadBase}</option>
              )}
              {unidadesPersonalizadas
                .filter((unidad) => unidad !== unidadBase)
                .map((unidad) => (
                  <option key={unidad} value={unidad}>{unidad}</option>
                ))}
              <option value="__AGREGAR_UNIDAD__">
                + Agregar unidad de medida
              </option>
            </select>


          </div>

          {/* CANTIDAD */}

          <div className="form-campo">

            <label htmlFor="cantidad">
              Cantidad
            </label>

            <input
              id="cantidad"
              name="cantidad"
              type="text"
              value={formulario.cantidad}
              onChange={manejarCambio}
              placeholder="Ingrese la cantidad"
              required
            />
            {errores.cantidad && <span className="err">{errores.cantidad}</span>}

          </div>

          {/* PRECIO */}

          <div className="form-campo">

            <label htmlFor="precio">
              Precio
            </label>

            <input
              id="precio"
              name="precio"
              type="number"
              min="0"
              value={formulario.precio}
              onChange={manejarCambio}
              placeholder="Ingrese el precio"
              required
            />
            {errores.precio && <span className="err">{errores.precio}</span>}

          </div>

          {/* MONEDA */}

          <div className="form-campo">

            <label htmlFor="moneda">
              Moneda
            </label>

            <select
              id="moneda"
              name="moneda"
              value={formulario.moneda}
              onChange={manejarCambio}
              required
            >
              <option value="">
                Seleccione la moneda
              </option>

              <option value="COP">
                COP - Peso colombiano
              </option>

              <option value="USD">
                USD - Dólar estadounidense
              </option>

            </select>

          </div>

          {/* FECHA */}

          <div className="form-campo">

            <label htmlFor="fecha">
              Fecha
            </label>

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

            <label htmlFor="pais_destino">
              País destino
            </label>

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
              <option value="__AGREGAR_PAIS__">
                + Agregar país
              </option>
            </select>

            {errores.pais_destino && <span className="err">{errores.pais_destino}</span>}

          </div>
          {modoEdicion && (
            <div className="form-campo">
              <label htmlFor="estado">Estado</label>
              <select id="estado" name="estado" value={formulario.estado} onChange={manejarCambio} required>
                <option value="REGISTRADA">REGISTRADA</option>
                <option value="DESPACHADA">DESPACHADA</option>
                <option value="ENTREGADA">ENTREGADA</option>
                <option value="CANCELADA">CANCELADA</option>
              </select>
            </div>
          )}

          {puedeIngresarTransporte && (
            <>
              <div className="form-campo">
                <label htmlFor="encargado_transporte">
                  Encargado de transporte
                </label>
                <input
                  id="encargado_transporte"
                  name="encargado_transporte"
                  type="text"
                  value={formulario.encargado_transporte}
                  onChange={manejarCambio}
                  placeholder="Ingrese el encargado de transporte"
                />
              </div>

              <div className="form-campo">
                <label htmlFor="placa_vehiculo">
                  Placa del vehículo
                </label>
                <input
                  id="placa_vehiculo"
                  name="placa_vehiculo"
                  type="text"
                  value={formulario.placa_vehiculo}
                  onChange={manejarCambio}
                  placeholder="Ingrese la placa del vehículo"
                />
              </div>
            </>
          )}

        </div>

      </section>

      {/* =========================================
          DOCUMENTOS LEGALES
      ========================================= */}

      <section className="form-seccion">

        <div className="form-seccion-titulo">

          <h2>
            Documentos legales de la venta
          </h2>

          <p>
            Registra la documentación legal asociada a la venta.
          </p>

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

      {/* =========================================
          ACCIONES
      ========================================= */}

      <div className="form-acciones-venta">

        <button
          type="button"
          className="btn-cancelar-venta"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn-guardar-venta"
        >
          {modoEdicion
            ? "Guardar cambios"
            : "Registrar venta"}
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