import { useState } from "react";
import { comprasDisponibles, ventasDisponibles } from "../../data/insumosVinculos.js";
import { filtrarSoloLetras, validarCampo } from "../../utils/validaciones.js";

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

  const [fechaIngreso, setFechaIngreso] = useState(
    datosIniciales.fecha_ingreso || ""
  );

  const [compraAsociada, setCompraAsociada] = useState(
    datosIniciales.compra_asociada || ""
  );

  const [ventaAsociada, setVentaAsociada] = useState(
    datosIniciales.venta_asociada ? String(datosIniciales.venta_asociada) : ""
  );

  const hoy = new Date().toISOString().slice(0, 10);

  const [error, setError] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault();
    setError("");

    const errNombre = validarCampo(nombre, { requerido: true, soloLetras: true });
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
              onChange={(e) => setMina(e.target.value)}
            >
              <option value="">
                Seleccionar mina
              </option>

              <option value="Mina Chocó">
                Mina Chocó
              </option>

              <option value="Mina Bolívar">
                Mina Bolívar
              </option>
            </select>
          </div>

          {/* ACOPIO */}
          <div className="form-campo">
            <label htmlFor="acopio-insumo-polimetalico">
              Acopio
            </label>

            <select
              id="acopio-insumo-polimetalico"
              value={acopio}
              onChange={(e) => setAcopio(e.target.value)}
            >
              <option value="">
                Seleccionar acopio
              </option>

              <option value="Acopio principal">
                Acopio principal
              </option>

              <option value="Acopio Chocó">
                Acopio Chocó
              </option>

              <option value="Acopio Bolívar">
                Acopio Bolívar
              </option>
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
