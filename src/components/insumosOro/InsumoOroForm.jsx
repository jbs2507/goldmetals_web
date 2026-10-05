import { useState } from "react";
import { comprasDisponibles, ventasDisponibles } from "../../data/insumosVinculos.js";
import { filtrarSoloLetras, validarCampo } from "../../utils/validaciones.js";

export default function InsumoOroForm({
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
    datosIniciales.unidad_medida || "g"
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
      tipo_insumo: "ORO",
      nombre: nombre.trim(),
      cantidad: Number(cantidad),
      unidad_medida: unidadMedida,
      fecha_ingreso: fechaIngreso,
      compra_asociada: compraAsociada,
      venta_asociada: ventaAsociada ? Number(ventaAsociada) : null,
    };

    onGuardar(datos);
  };

  return (
    <form
      className="insumo-oro-form"
      onSubmit={manejarSubmit}
    >
      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>Información del insumo</h2>

          <p>
            Ingresa los datos correspondientes al insumo de oro
          </p>
        </div>

        <div className="form-grid">

          <div className="form-campo">
            <label>Tipo de insumo</label>

            <input
              type="text"
              value="Oro"
              disabled
            />
          </div>

          <div className="form-campo">
            <label htmlFor="nombre-insumo-oro">
              Nombre
            </label>

            <input
              id="nombre-insumo-oro"
              type="text"
              placeholder="Ej. Oro en polvo"
              value={nombre}
              onChange={(e) =>
                setNombre(filtrarSoloLetras(e.target.value))
              }
            />
          </div>

          <div className="form-campo">
            <label htmlFor="cantidad-insumo-oro">
              Cantidad
            </label>

            <input
              id="cantidad-insumo-oro"
              type="number"
              min="0.000001"
              step="0.000001"
              placeholder="Ej. 250"
              value={cantidad}
              onChange={(e) =>
                setCantidad(e.target.value)
              }
            />
          </div>

          <div className="form-campo">
            <label htmlFor="unidad-insumo-oro">
              Unidad de medida
            </label>

            <select
              id="unidad-insumo-oro"
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
          <div className="form-campo">
            <label htmlFor="fecha-ingreso-insumo-oro">Fecha de ingreso</label>
            <input
              id="fecha-ingreso-insumo-oro"
              type="date"
              max={hoy}
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
            />
          </div>

          <div className="form-campo">
            <label htmlFor="compra-insumo-oro">Compra asociada</label>
            <select
              id="compra-insumo-oro"
              value={compraAsociada}
              onChange={(e) => setCompraAsociada(e.target.value)}
            >
              <option value="">Seleccionar compra</option>
              {comprasDisponibles().map((c) => (
                <option key={c.id} value={c.id}>
                  {`Compra #${c.id} · ${c.proveedor}`}
                </option>
              ))}
            </select>
          </div>

          {modo === "editar" && (
            <div className="form-campo">
              <label htmlFor="venta-insumo-oro">Venta asociada (salida del insumo)</label>
              <select
                id="venta-insumo-oro"
                value={ventaAsociada}
                onChange={(e) => setVentaAsociada(e.target.value)}
              >
                <option value="">Aún no ha salido</option>
                {ventasDisponibles("ORO").map((v) => (
                  <option key={v.id_venta} value={String(v.id_venta)}>
                    {`Venta #${v.id_venta} · ${v.cliente} · ${v.cantidad}`}
                  </option>
                ))}
              </select>
            </div>
          )}

        </div>

        {error && (
          <div className="mensaje-error-insumo-oro">
            {error}
          </div>
        )}

      </section>

      <div className="form-acciones-insumo-oro">

        <button
          type="button"
          className="btn-cancelar-insumo-oro"
          onClick={onCancelar}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn-guardar-insumo-oro"
        >
          {modo === "editar"
            ? "Guardar cambios"
            : "Registrar insumo"}
        </button>

      </div>
    </form>
  );
}

