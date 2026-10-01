import { useState } from "react";
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

  const [estado, setEstado] = useState(
    datosIniciales.estado || "ACTIVO"
  );

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

    const datos = {
      tipo_insumo: "ORO",
      nombre: nombre.trim(),
      cantidad: Number(cantidad),
      unidad_medida: unidadMedida,
      estado,
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
          {modo === "editar" && (
            <div className="form-campo">
              <label htmlFor="estado-insumo-oro">Estado</label>
              <select id="estado-insumo-oro" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
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

