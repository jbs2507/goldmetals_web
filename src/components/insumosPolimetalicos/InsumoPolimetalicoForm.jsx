import { useState } from "react";
import { createPortal } from "react-dom";
import { comprasDisponibles, ventasDisponibles } from "../../data/insumosVinculos.js";
import { filtrarSoloLetras, hoyISO, validarCampo } from "../../utils/validaciones.js";
import { agregarAcopio, agregarMina, leerAcopios, leerMinas } from "../../data/origenes.js";

export default function InsumoPolimetalicoForm({
  modo = "registrar",
  datosIniciales = {},
  onGuardar,
  onCancelar,
}) {
  const [nombre, setNombre] = useState(
    datosIniciales.nombre || ""
  );

  const [cantidad, setCantidad] = useState(
    datosIniciales.cantidad || ""
  );

  const [unidadMedida, setUnidadMedida] = useState(
    datosIniciales.unidad_medida || "kg"
  );

  const [mina, setMina] = useState(
    datosIniciales.mina || ""
  );

  const [acopio, setAcopio] = useState(
    datosIniciales.acopio || ""
  );

  // Minas y acopios: el acopio depende de la mina elegida. Se pueden agregar nuevos desde aquí.
  const [versionOrigenes, setVersionOrigenes] = useState(0);
  const [agregando, setAgregando] = useState(null); // "mina" | "acopio" | null
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [errorNuevo, setErrorNuevo] = useState("");

  const minas = [...new Set([...leerMinas(), mina].filter(Boolean))];
  const acopios = [...new Set([...(mina ? leerAcopios(mina) : []), acopio].filter(Boolean))];
  // versionOrigenes fuerza a recalcular las listas cuando se agrega una mina o un acopio.
  void versionOrigenes;

  const AGREGAR = "__AGREGAR__";

  const cambiarMina = (valor) => {
    // La opción "+ Agregar mina" de la lista abre la ventana para crear una nueva.
    if (valor === AGREGAR) {
      abrirNuevo("mina");
      return;
    }
    setMina(valor);
    // El acopio elegido solo es válido si pertenece a la nueva mina.
    if (!valor || !leerAcopios(valor).includes(acopio)) setAcopio("");
  };

  const cambiarAcopio = (valor) => {
    if (valor === AGREGAR) {
      abrirNuevo("acopio");
      return;
    }
    setAcopio(valor);
  };

  const abrirNuevo = (tipo) => {
    setAgregando(tipo);
    setNombreNuevo("");
    setErrorNuevo("");
  };

  const cancelarNuevo = () => {
    setAgregando(null);
    setNombreNuevo("");
    setErrorNuevo("");
  };

  const confirmarNuevo = () => {
    const r = agregando === "mina" ? agregarMina(nombreNuevo) : agregarAcopio(nombreNuevo, mina);
    if (!r.ok) {
      setErrorNuevo(r.error);
      return;
    }
    setVersionOrigenes((v) => v + 1);
    if (agregando === "mina") {
      setMina(r.nombre);
      setAcopio("");
    } else {
      setAcopio(r.nombre);
    }
    cancelarNuevo();
  };

  // Ventana para escribir el nombre de la nueva mina o acopio. Va en un portal (fuera del
  // formulario) para que la tecla Enter no envíe el formulario de insumo.
  const ventanaNueva =
    agregando &&
    createPortal(
      <div className="venta-modal-backdrop" role="presentation" onMouseDown={cancelarNuevo}>
        <div
          className="venta-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-origen-titulo"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="venta-modal-header">
            <div>
              <h3 id="modal-origen-titulo">{agregando === "mina" ? "Agregar mina" : "Agregar acopio"}</h3>
              <p>
                {agregando === "mina"
                  ? "Escribe el nombre de la nueva mina."
                  : `Escribe el nombre del nuevo acopio de ${mina}.`}
              </p>
            </div>
            <button type="button" className="venta-modal-cerrar" onClick={cancelarNuevo} aria-label="Cerrar">
              ×
            </button>
          </div>
          <input
            type="text"
            autoFocus
            value={nombreNuevo}
            onChange={(e) => {
              setNombreNuevo(e.target.value);
              setErrorNuevo("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                confirmarNuevo();
              }
              if (e.key === "Escape") cancelarNuevo();
            }}
            placeholder={agregando === "mina" ? "Ej. Mina Antioquia" : "Ej. Acopio Medellín"}
          />
          {errorNuevo && <span className="err">{errorNuevo}</span>}
          <div className="venta-modal-acciones">
            <button type="button" className="btn-cancelar-venta" onClick={cancelarNuevo}>
              Cancelar
            </button>
            <button type="button" className="btn-guardar-venta" onClick={confirmarNuevo}>
              {agregando === "mina" ? "Agregar mina" : "Agregar acopio"}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );

  const [fechaIngreso, setFechaIngreso] = useState(
    datosIniciales.fecha_ingreso || ""
  );

  const [compraAsociada, setCompraAsociada] = useState(
    datosIniciales.compra_asociada || ""
  );

  const [ventaAsociada, setVentaAsociada] = useState(
    datosIniciales.venta_asociada ? String(datosIniciales.venta_asociada) : ""
  );

  // Fecha local (toISOString usa UTC y en Colombia adelanta el día desde las 7 p. m.).
  const hoy = hoyISO();

  const [error, setError] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault();
    setError("");

    const errNombre = validarCampo(nombre, { requerido: true, soloLetras: true, longitudMin: 3 });
    if (errNombre) {
      setError(errNombre);
      return;
    }

    const errCantidad = validarCampo(cantidad, { requerido: true, tipo: "number" });
    if (errCantidad) {
      setError(errCantidad);
      return;
    }

    const errMina = validarCampo(mina, { requerido: true });
    if (errMina) {
      setError("La mina de origen es obligatoria.");
      return;
    }

    const errAcopio = validarCampo(acopio, { requerido: true });
    if (errAcopio) {
      setError("El acopio es obligatorio.");
      return;
    }

    if (!fechaIngreso) {
      setError("La fecha de ingreso es obligatoria.");
      return;
    }

    if (fechaIngreso > hoy) {
      setError("La fecha de ingreso no puede ser posterior a hoy.");
      return;
    }

    if (!compraAsociada) {
      setError("Debes seleccionar la compra asociada.");
      return;
    }


    const datos = {
      tipo_insumo: "POLIMETALICO",
      nombre: nombre.trim(),
      cantidad: Number(cantidad),
      unidad_medida: unidadMedida,
      mina,
      acopio,
      fecha_ingreso: fechaIngreso,
      compra_asociada: compraAsociada,
      venta_asociada: ventaAsociada ? Number(ventaAsociada) : null,
    };

    onGuardar(datos);
  };

  return (
    <form
      className="insumo-polimetalico-form"
      onSubmit={manejarSubmit}
    >
      {ventanaNueva}
      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>Información del insumo</h2>

          <p>
            Ingresa los datos correspondientes al material polimetálico
          </p>
        </div>

        <div className="form-grid">

          {/* TIPO DE INSUMO */}
          <div className="form-campo">
            <label>Tipo de insumo</label>

            <input
              type="text"
              value="Material polimetálico"
              disabled
            />
          </div>

          {/* NOMBRE */}
          <div className="form-campo">
            <label htmlFor="nombre-insumo-polimetalico">
              Nombre
            </label>

            <input
              id="nombre-insumo-polimetalico"
              type="text"
              placeholder="Ej. Arena polimetálica"
              value={nombre}
              onChange={(e) => setNombre(filtrarSoloLetras(e.target.value))}
            />
          </div>

          {/* CANTIDAD */}
          <div className="form-campo">
            <label htmlFor="cantidad-insumo-polimetalico">
              Cantidad
            </label>

            <input
              id="cantidad-insumo-polimetalico"
              type="number"
              min="0.000001"
              step="0.000001"
              placeholder="Ej. 500"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>

          {/* UNIDAD DE MEDIDA */}
          <div className="form-campo">
            <label htmlFor="unidad-insumo-polimetalico">
              Unidad de medida
            </label>

            <select
              id="unidad-insumo-polimetalico"
              value={unidadMedida}
              onChange={(e) =>
                setUnidadMedida(e.target.value)
              }
            >
              <option value="g">
                Gramos (g)
              </option>

              <option value="kg">
                Kilogramos (kg)
              </option>

              <option value="oz">
                Onzas (oz)
              </option>

              <option value="lb">
                Libras (lb)
              </option>
            </select>
          </div>

          {/* MINA DE ORIGEN */}
          <div className="form-campo">
            <label htmlFor="mina-insumo-polimetalico">
              Mina de origen
            </label>

            <select
              id="mina-insumo-polimetalico"
              value={mina}
              onChange={(e) => cambiarMina(e.target.value)}
            >
              <option value="">
                Seleccionar mina
              </option>

              {minas.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}

              <option value={AGREGAR}>+ Agregar mina</option>
            </select>
          </div>

          {/* ACOPIO (solo los de la mina seleccionada) */}
          <div className="form-campo">
            <label htmlFor="acopio-insumo-polimetalico">
              Acopio
            </label>

            <select
              id="acopio-insumo-polimetalico"
              value={acopio}
              onChange={(e) => cambiarAcopio(e.target.value)}
              disabled={!mina}
            >
              <option value="">
                {mina ? "Seleccionar acopio" : "Primero selecciona la mina"}
              </option>

              {acopios.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}

              {mina && <option value={AGREGAR}>+ Agregar acopio</option>}
            </select>
          </div>

          <div className="form-campo">
            <label htmlFor="fecha-ingreso-insumo-polimetalico">Fecha de ingreso</label>
            <input
              id="fecha-ingreso-insumo-polimetalico"
              type="date"
              max={hoy}
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
            />
          </div>

          <div className="form-campo">
            <label htmlFor="compra-insumo-polimetalico">Compra asociada (opcional)</label>
            <select
              id="compra-insumo-polimetalico"
              value={compraAsociada}
              onChange={(e) => setCompraAsociada(e.target.value)}
            >
              <option value="">Sin compra (ingreso manual)</option>
              {comprasDisponibles().map((c) => (
                <option key={c.id} value={c.id}>
                  {`Compra #${c.id} · ${c.proveedor}`}
                </option>
              ))}
            </select>
          </div>

          {modo === "editar" && (
            <div className="form-campo">
              <label htmlFor="venta-insumo-polimetalico">Venta asociada (salida del insumo)</label>
              <select
                id="venta-insumo-polimetalico"
                value={ventaAsociada}
                onChange={(e) => setVentaAsociada(e.target.value)}
              >
                <option value="">Aún no ha salido</option>
                {ventasDisponibles("POLIMETALICO").map((v) => (
                  <option key={v.id_venta} value={String(v.id_venta)}>
                    {`Venta #${v.id_venta} · ${v.cliente} · ${v.cantidad}`}
                  </option>
                ))}
              </select>
            </div>
          )}

        </div>

        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="mensaje-error-insumo-polimetalico">
            {error}
          </div>
        )}

      </section>

      {/* BOTONES */}
      <div className="form-acciones-insumo-polimetalico">

        <button
          type="button"
          className="btn-cancelar-insumo-polimetalico"
          onClick={onCancelar}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn-guardar-insumo-polimetalico"
        >
          {modo === "editar"
            ? "Guardar cambios"
            : "Registrar insumo"}
        </button>

      </div>
    </form>
  );
}
