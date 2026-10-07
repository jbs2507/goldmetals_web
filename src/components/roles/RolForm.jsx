import { useState } from "react";
import { filtrarSoloLetras, validarCampo } from "../../utils/validaciones.js";
import {
  ACCIONES,
  MODULOS,
  accionesDeModulo,
  DATOS_SENSIBLES,
  clavePermiso,
  claveDato,
} from "../../permisos.js";

// Quitar "Ver" de un módulo quita también el resto de privilegios de ese módulo;
// marcar cualquier privilegio activa "Ver" (no se puede editar lo que no se puede ver).
function alternar(permisos, modulo, accion) {
  const clave = clavePermiso(modulo, accion);
  const tiene = permisos.includes(clave);
  if (accion === "ver" && tiene) {
    return permisos.filter((p) => !p.startsWith(`${modulo}.`));
  }
  if (tiene) return permisos.filter((p) => p !== clave);
  const nuevos = [clave];
  if (accion !== "ver") nuevos.push(clavePermiso(modulo, "ver"));
  return [...new Set([...permisos, ...nuevos])];
}

export default function RolForm({
  modo = "registrar",
  datosIniciales = {},
  onGuardar,
  onCancelar,
  soloLectura = false,
  error: errorExterno = "",
}) {
  // Rol de sistema (Administrador): acceso total, solo se consulta.
  const bloqueado = soloLectura || Boolean(datosIniciales.sistema);

  const [nombre, setNombre] = useState(datosIniciales.nombre || "");
  const [descripcion, setDescripcion] = useState(datosIniciales.descripcion || "");
  const [permisos, setPermisos] = useState(datosIniciales.permisos || []);
  const [error, setError] = useState("");

  const tiene = (clave) => permisos.includes(clave);

  const alternarPermiso = (modulo, accion) => {
    if (bloqueado) return;
    setPermisos((actuales) => alternar(actuales, modulo, accion));
  };

  const alternarDato = (dato) => {
    if (bloqueado) return;
    const clave = claveDato(dato);
    setPermisos((actuales) =>
      actuales.includes(clave) ? actuales.filter((p) => p !== clave) : [...actuales, clave]
    );
  };

  const moduloPorId = (id) => MODULOS.find((m) => m.id === id);

  const moduloCompleto = (modulo) =>
    accionesDeModulo(moduloPorId(modulo)).every((a) => tiene(clavePermiso(modulo, a.id)));

  const alternarModulo = (modulo) => {
    if (bloqueado) return;
    setPermisos((actuales) => {
      const sinModulo = actuales.filter((p) => !p.startsWith(`${modulo}.`));
      return moduloCompleto(modulo)
        ? sinModulo
        : [...sinModulo, ...accionesDeModulo(moduloPorId(modulo)).map((a) => clavePermiso(modulo, a.id))];
    });
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    const msg = validarCampo(nombre, { requerido: true, soloLetras: true });
    if (msg) {
      setError(msg);
      return;
    }
    if (!permisos.some((p) => p.endsWith(".ver") && !p.startsWith("datos."))) {
      setError("Selecciona al menos un módulo que el rol pueda ver");
      return;
    }
    setError("");

    onGuardar({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      permisos,
    });
  };

  const grupos = [...new Set(MODULOS.map((m) => m.grupo))];

  return (
    <form className="rol-form" onSubmit={manejarSubmit}>
      <section className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Información del rol</h2>
          <p>Nombre y descripción del rol</p>
        </div>

        <div className="form-grid">
          <div className="form-campo">
            <label htmlFor="nombre-rol">Nombre del rol</label>
            <input
              id="nombre-rol"
              type="text"
              placeholder="Ej. Auditor"
              value={nombre}
              onChange={(e) => setNombre(filtrarSoloLetras(e.target.value))}
              disabled={bloqueado}
              required
            />
          </div>

          <div className="form-campo">
            <label htmlFor="descripcion-rol">Descripción</label>
            <input
              id="descripcion-rol"
              type="text"
              placeholder="Ej. Consulta documentos del sistema"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={bloqueado}
            />
          </div>
        </div>
      </section>

      {/* PERMISOS: qué puede hacer el rol en cada módulo y qué información sensible puede ver */}
      <section className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Permisos y privilegios por módulo</h2>
          <p>
            Define qué puede hacer el rol en el sistema. Para poder registrar, editar, eliminar o
            descargar en un módulo, primero debe poder verlo. Todos los roles ven la información
            general; los datos de la sección "Información que puede ver" solo los ven los roles que
            los tengan marcados.
          </p>
        </div>

        <div className="permisos-tabla-scroll">
          <table className="permisos-tabla">
            <thead>
              <tr>
                <th>Módulo</th>
                {ACCIONES.map((a) => (
                  <th key={a.id} title={a.ayuda}>{a.etiqueta}</th>
                ))}
                <th>Todo</th>
              </tr>
            </thead>
            <tbody>
              {grupos.map((grupo) => (
                <FilasGrupo
                  key={grupo}
                  grupo={grupo}
                  modulos={MODULOS.filter((m) => m.grupo === grupo)}
                  tiene={tiene}
                  alternarPermiso={alternarPermiso}
                  alternarModulo={alternarModulo}
                  moduloCompleto={moduloCompleto}
                  bloqueado={bloqueado}
                />
              ))}

              {/* INFORMACIÓN SENSIBLE: dentro de la misma tabla */}
              <tr className="permisos-grupo">
                <td colSpan={ACCIONES.length + 2}>Información que puede ver</td>
              </tr>
              {DATOS_SENSIBLES.map((d) => (
                <tr key={d.id}>
                  <td className="permisos-modulo">
                    {d.etiqueta}
                    <small className="permisos-ayuda">{d.ayuda}</small>
                  </td>
                  {ACCIONES.map((a) => (
                    <td key={a.id}>
                      {a.id === "ver" ? (
                        <input
                          type="checkbox"
                          aria-label={`Ver ${d.etiqueta}`}
                          checked={tiene(claveDato(d.id))}
                          onChange={() => alternarDato(d.id)}
                          disabled={bloqueado}
                        />
                      ) : (
                        <span className="permisos-na">—</span>
                      )}
                    </td>
                  ))}
                  <td><span className="permisos-na">—</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(error || errorExterno) && <div className="mensaje-error-rol">{error || errorExterno}</div>}

        {datosIniciales.sistema && (
          <div className="mensaje-info-rol">
            El rol Administrador tiene acceso total al sistema y no se puede modificar.
          </div>
        )}
      </section>

      <div className="form-acciones-rol">
        <button type="button" className="btn-cancelar-rol" onClick={onCancelar}>
          {soloLectura ? "Volver" : "Cancelar"}
        </button>

        {!soloLectura && !datosIniciales.sistema && (
          <button type="submit" className="btn-guardar-rol">
            {modo === "editar" ? "Guardar cambios" : "Registrar rol"}
          </button>
        )}
      </div>
    </form>
  );
}

function FilasGrupo({ grupo, modulos, tiene, alternarPermiso, alternarModulo, moduloCompleto, bloqueado }) {
  return (
    <>
      <tr className="permisos-grupo">
        <td colSpan={ACCIONES.length + 2}>{grupo}</td>
      </tr>
      {modulos.map((m) => (
        <tr key={m.id}>
          <td className="permisos-modulo">{m.nombre}</td>
          {ACCIONES.map((a) => (
            <td key={a.id}>
              {accionesDeModulo(m).some((x) => x.id === a.id) ? (
                <input
                  type="checkbox"
                  aria-label={`${a.etiqueta} en ${m.nombre}`}
                  checked={tiene(clavePermiso(m.id, a.id))}
                  onChange={() => alternarPermiso(m.id, a.id)}
                  disabled={bloqueado}
                />
              ) : (
                <span className="permisos-na">—</span>
              )}
            </td>
          ))}
          <td>
            <input
              type="checkbox"
              aria-label={`Todos los privilegios en ${m.nombre}`}
              checked={moduloCompleto(m.id)}
              onChange={() => alternarModulo(m.id)}
              disabled={bloqueado}
            />
          </td>
        </tr>
      ))}
    </>
  );
}
