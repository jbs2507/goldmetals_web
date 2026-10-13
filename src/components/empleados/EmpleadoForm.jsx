import { useEffect, useState } from "react";
import { filtrarSoloDigitos, filtrarSoloLetras, hoyISO, validarFormulario, validarNumeroDocumento } from "../../utils/validaciones.js";
import { buscarDocumentoRepetido } from "../../utils/duplicados.js";
import { CLAVES, EMPLEADOS_SEMILLA } from "../../data/semillas.js";
import { TIPOS_DOCUMENTO, tipoDocumentoSoloDigitos } from "../clientes/tiposDocumento.js";

const DATOS_EMPLEADO_VACIOS = {
  nombre_completo: "",
  tipo_documento: "CC",
  numero_documento: "",
  telefono: "",
  cargo: "",
  direccion: "",
  correo: "",
  estado: "ACTIVO",
};

const REGLAS_EMPLEADO = {
  nombre_completo: { requerido: true, soloLetras: true, longitudMin: 3 },
  tipo_documento: { requerido: true },
  numero_documento: { requerido: true },
  fecha_ingreso: { requerido: true, tipo: "date" },
  telefono: { soloDigitos: true, telefono: true },
  cargo: { requerido: true },
  correo: { tipo: "email" },
};

export default function EmpleadoForm({
  datosIniciales = DATOS_EMPLEADO_VACIOS,
  onSubmit,
  onCancel,
  modoEdicion = false,
}) {
  const [formulario, setFormulario] = useState(() => ({
    nombre_completo: datosIniciales?.nombre_completo || "",
    tipo_documento: datosIniciales?.tipo_documento || "CC",
    numero_documento: datosIniciales?.numero_documento || "",
    telefono: datosIniciales?.telefono || "",
    cargo: datosIniciales?.cargo || "",
    direccion: datosIniciales?.direccion || "",
    correo: datosIniciales?.correo || "",
    fecha_ingreso: datosIniciales?.fecha_ingreso || "",
    fecha_finalizacion: datosIniciales?.fecha_finalizacion || "",
    estado: datosIniciales?.estado || "ACTIVO",
  }));

  // Si datosIniciales llega o cambia después del montaje (por ejemplo,
  // cuando el empleado a editar se carga de forma asíncrona), se
  // sincroniza el formulario para no dejar los campos en blanco.
  useEffect(() => {
    if (!datosIniciales) return;
    setFormulario({
      nombre_completo: datosIniciales.nombre_completo || "",
      tipo_documento: datosIniciales.tipo_documento || "CC",
      numero_documento: datosIniciales.numero_documento || "",
      telefono: datosIniciales.telefono || "",
      cargo: datosIniciales.cargo || "",
      direccion: datosIniciales.direccion || "",
      correo: datosIniciales.correo || "",
      fecha_ingreso: datosIniciales.fecha_ingreso || "",
      fecha_finalizacion: datosIniciales.fecha_finalizacion || "",
      estado: datosIniciales.estado || "ACTIVO",
    });
  }, [datosIniciales]);

  const [errores, setErrores] = useState({});

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    const limpio =
      name === "nombre_completo"
        ? filtrarSoloLetras(value)
        : name === "telefono"
        ? filtrarSoloDigitos(value)
        : name === "numero_documento"
        ? (tipoDocumentoSoloDigitos(formulario.tipo_documento) ? filtrarSoloDigitos(value) : value)
        : value;

    setFormulario((prev) => ({
      ...prev,
      [name]: limpio,
    }));
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    // La fecha de ingreso no puede ser anterior a hoy; al editar solo se revisa si se cambió.
    const nuevosErrores = validarFormulario(formulario, {
      ...REGLAS_EMPLEADO,
      fecha_ingreso: { ...REGLAS_EMPLEADO.fecha_ingreso, valorOriginal: modoEdicion ? datosIniciales?.fecha_ingreso : undefined },
    });

    // Formato del número y que no exista ya otro empleado con el mismo documento.
    if (!nuevosErrores.numero_documento) {
      const errFormato = validarNumeroDocumento(formulario.tipo_documento, formulario.numero_documento);
      if (errFormato) nuevosErrores.numero_documento = errFormato;
      else if (
        buscarDocumentoRepetido({
          clave: CLAVES.empleados,
          semilla: EMPLEADOS_SEMILLA,
          campoDocumento: "numero_documento",
          campoId: "id_empleado",
          idActual: datosIniciales?.id_empleado,
          numero: formulario.numero_documento,
          tipoDocumento: formulario.tipo_documento,
        })
      ) {
        nuevosErrores.numero_documento = "Ya existe un empleado con este número de documento";
      }
    }

    if (
      formulario.fecha_finalizacion &&
      formulario.fecha_ingreso &&
      formulario.fecha_finalizacion < formulario.fecha_ingreso
    ) {
      nuevosErrores.fecha_finalizacion =
        "La fecha de finalización no puede ser anterior a la de ingreso";
    }
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

          {/* TIPO DE DOCUMENTO */}
          <div className="form-campo">

            <label htmlFor="tipo_documento">
              Tipo de documento
            </label>

            <select
              id="tipo_documento"
              name="tipo_documento"
              value={formulario.tipo_documento}
              onChange={(e) => {
                const tipo = e.target.value;
                setFormulario((prev) => ({
                  ...prev,
                  tipo_documento: tipo,
                  numero_documento: tipoDocumentoSoloDigitos(tipo)
                    ? filtrarSoloDigitos(prev.numero_documento)
                    : prev.numero_documento,
                }));
              }}
            >
              {TIPOS_DOCUMENTO.map((t) => (
                <option key={t.valor} value={t.valor}>
                  {t.etiqueta}
                </option>
              ))}
            </select>
            {errores.tipo_documento && <span className="err">{errores.tipo_documento}</span>}

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

          {/* CORREO */}
          <div className="form-campo">

            <label htmlFor="correo">
              Correo electrónico
            </label>

            <input
              id="correo"
              name="correo"
              type="email"
              value={formulario.correo}
              onChange={manejarCambio}
              placeholder="Ingrese el correo electrónico"
            />
            {errores.correo && <span className="err">{errores.correo}</span>}

          </div>

          {/* DIRECCIÓN */}
          <div className="form-campo">

            <label htmlFor="direccion">
              Dirección
            </label>

            <input
              id="direccion"
              name="direccion"
              type="text"
              value={formulario.direccion}
              onChange={manejarCambio}
              placeholder="Ingrese la dirección"
            />

          </div>

          {/* FECHA DE INGRESO */}
          <div className="form-campo">

            <label htmlFor="fecha_ingreso">
              Fecha de ingreso
            </label>

            <input
              id="fecha_ingreso"
              name="fecha_ingreso"
              type="date"
              min={modoEdicion ? undefined : hoyISO()}
              value={formulario.fecha_ingreso}
              onChange={manejarCambio}
              required
            />
            {errores.fecha_ingreso && <span className="err">{errores.fecha_ingreso}</span>}

          </div>

          {/* FECHA DE FINALIZACIÓN (solo al editar) */}
          {modoEdicion && (
            <div className="form-campo">

              <label htmlFor="fecha_finalizacion">
                Fecha de finalización (si ya no trabaja aquí)
              </label>

              <input
                id="fecha_finalizacion"
                name="fecha_finalizacion"
                type="date"
                min={formulario.fecha_ingreso || undefined}
                value={formulario.fecha_finalizacion}
                onChange={manejarCambio}
              />
              {errores.fecha_finalizacion && <span className="err">{errores.fecha_finalizacion}</span>}

            </div>
          )}

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