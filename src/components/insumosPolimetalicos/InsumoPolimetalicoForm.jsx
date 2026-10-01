import { useState } from "react";
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

    const datos = {
      tipo_insumo: "POLIMETALICO",
      nombre: nombre.trim(),
      cantidad: Number(cantidad),
      unidad_medida: unidadMedida,
      mina,
      acopio,
      estado,
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
          {modo === "editar" && (
            <div className="form-campo">
              <label htmlFor="estado-insumo-polimetalico">Estado</label>
              <select id="estado-insumo-polimetalico" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
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
