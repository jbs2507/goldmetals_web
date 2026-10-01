import { useEffect, useState } from "react";
import { filtrarSoloDigitos, filtrarSoloLetras, validarFormulario } from "../../utils/validaciones.js";

const DATOS_EMPLEADO_VACIOS = {
  nombre_completo: "",
  cargo: "",
  numero_documento: "",
  telefono: "",
  estado: "ACTIVO",
};

const REGLAS_EMPLEADO = {
  nombre_completo: { requerido: true, soloLetras: true },
  cargo: { requerido: true, soloLetras: true },
  numero_documento: { requerido: true, soloDigitos: true },
  telefono: { soloDigitos: true },
};

export default function EmpleadoForm({
  datosIniciales = DATOS_EMPLEADO_VACIOS,
  onSubmit,
  onCancel,
  modoEdicion = false,
}) {
  const [formulario, setFormulario] = useState(() => ({
    nombre_completo: datosIniciales?.nombre_completo || "",
    cargo: datosIniciales?.cargo || "",
    numero_documento: datosIniciales?.numero_documento || "",
    telefono: datosIniciales?.telefono || "",
    estado: datosIniciales?.estado || "ACTIVO",
  }));

  // Si datosIniciales llega o cambia después del montaje (por ejemplo,
  // cuando el empleado a editar se carga de forma asíncrona), se
  // sincroniza el formulario para no dejar los campos en blanco.
  useEffect(() => {
    if (!datosIniciales) return;
    setFormulario({
      nombre_completo: datosIniciales.nombre_completo || "",
      cargo: datosIniciales.cargo || "",
      numero_documento: datosIniciales.numero_documento || "",
      telefono: datosIniciales.telefono || "",
      estado: datosIniciales.estado || "ACTIVO",
    });
  }, [datosIniciales]);

  const [errores, setErrores] = useState({});

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    const limpio =
      name === "nombre_completo"
        ? filtrarSoloLetras(value)
        : name === "cargo"
        ? filtrarSoloLetras(value)
        : name === "numero_documento" || name === "telefono"
        ? filtrarSoloDigitos(value)
        : value;

    setFormulario((prev) => ({
      ...prev,
      [name]: limpio,
    }));
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario(formulario, REGLAS_EMPLEADO);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onSubmit({
      ...formulario,
    });
  };

  return (
    <form
      className="empleado-form"
      onSubmit={manejarSubmit}
    >

      <section className="form-seccion">

        <div className="form-seccion-titulo">
          <h2>
            {modoEdicion
              ? "Actualizar información"
              : "Información del empleado"}
          </h2>

          <p>
            Completa los datos correspondientes al empleado.
          </p>
        </div>

        <div className="form-grid">

          {/* NOMBRE */}
          <div className="form-campo">

            <label htmlFor="nombre_completo">
              Nombre completo
            </label>

            <input
              id="nombre_completo"
              name="nombre_completo"
              type="text"
              value={formulario.nombre_completo}
              onChange={manejarCambio}
              placeholder="Ingrese el nombre completo"
              required
            />
            {errores.nombre_completo && <span className="err">{errores.nombre_completo}</span>}

          </div>

          {/* CARGO */}
          <div className="form-campo">

            <label htmlFor="cargo">
              Cargo
            </label>

            <input
              id="cargo"
              name="cargo"
              type="text"
              value={formulario.cargo}
              onChange={manejarCambio}
              placeholder="Ingrese el cargo"
              required
            />
            {errores.cargo && <span className="err">{errores.cargo}</span>}

          </div>

          {/* DOCUMENTO */}
          <div className="form-campo">

            <label htmlFor="numero_documento">
              Número de documento
            </label>

            <input
              id="numero_documento"
              name="numero_documento"
              type="text"
              value={formulario.numero_documento}
              onChange={manejarCambio}
              placeholder="Ingrese el número de documento"
            />
            {errores.numero_documento && <span className="err">{errores.numero_documento}</span>}

          </div>

          {/* TELÉFONO */}
          <div className="form-campo">

            <label htmlFor="telefono">
              Teléfono
            </label>

            <input
              id="telefono"
              name="telefono"
              type="text"
              value={formulario.telefono}
              onChange={manejarCambio}
              placeholder="Ingrese el teléfono"
            />
            {errores.telefono && <span className="err">{errores.telefono}</span>}

          </div>

          {modoEdicion && (
            <div className="form-campo">
              <label htmlFor="estado">Estado</label>
              <select id="estado" name="estado" value={formulario.estado} onChange={manejarCambio}>
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
            </div>
          )}



        </div>

      </section>

      {/* ACCIONES */}
      <div className="form-acciones-empleado">

        <button
          type="button"
          className="btn-cancelar-empleado"
          onClick={() => onCancel?.()}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn-guardar-empleado"
        >
          {modoEdicion
            ? "Guardar cambios"
            : "Registrar empleado"}
        </button>

      </div>

    </form>
  );
}