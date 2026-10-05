import { useEffect, useState } from "react";
import { filtrarSoloDigitos, filtrarSoloLetras, validarFormulario } from "../../utils/validaciones.js";
import DocumentoAdjunto from "../DocumentoAdjunto.jsx";
import { tiposDocumentoPorPersona, tipoDocumentoPorDefecto, tipoDocumentoSoloDigitos } from "./tiposDocumento.js";

const reglasCliente = (tipoDocumento) => ({
  nombre: { requerido: true, soloLetras: true },
  tipo_documento: { requerido: true },
  identificacion_tributaria: {
    requerido: true,
    soloDigitos: tipoDocumentoSoloDigitos(tipoDocumento),
  },
  pais: { requerido: true, soloLetras: true },
  telefono: { requerido: true, soloDigitos: true },
  correo: { requerido: true, tipo: "email" },
});

// Letras, números y guion (pasaportes y documentos extranjeros).
const filtrarAlfanumerico = (valor) => valor.replace(/[^A-Za-z0-9-]/g, "");

const PAISES_POR_DEFECTO = ["Singapur", "Estados Unidos", "China"];

export default function ClienteForm({ cliente, onGuardar, onCancelar, soloEstado = false }) {
  // En edición solo se puede cambiar el estado; el resto de datos queda bloqueado.
  const bloqueado = soloEstado;

  const [formulario, setFormulario] = useState({
    tipo_cliente: "JURIDICA",
    nombre: "",
    tipo_documento: "NIT",
    identificacion_tributaria: "",
    pais: "",
    telefono: "",
    correo: "",
    estado: "ACTIVO",
    camaraComercio: null,
    contrato: null,
  });

  const [errores, setErrores] = useState({});
  const [paises, setPaises] = useState(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem("goldmetal_paises_destino"));
      return Array.isArray(guardados) && guardados.length ? guardados : PAISES_POR_DEFECTO;
    } catch {
      return PAISES_POR_DEFECTO;
    }
  });
  const [mostrarNuevoPais, setMostrarNuevoPais] = useState(false);
  const [nuevoPais, setNuevoPais] = useState("");

  useEffect(() => {
    if (cliente) {
      setFormulario({
        tipo_cliente: cliente.tipo_cliente || "JURIDICA",
        nombre: cliente.nombre || "",
        tipo_documento: cliente.tipo_documento || tipoDocumentoPorDefecto(cliente.tipo_cliente),
        identificacion_tributaria: cliente.identificacion_tributaria || "",
        pais: cliente.pais || "",
        telefono: cliente.telefono || "",
        correo: cliente.correo || "",
        estado: cliente.estado || "ACTIVO",
        camaraComercio: cliente.camaraComercio || null,
        contrato: cliente.contrato || null,
      });
    }
  }, [cliente]);

  useEffect(() => {
    localStorage.setItem("goldmetal_paises_destino", JSON.stringify(paises));
  }, [paises]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const limpio =
      name === "nombre"
        ? filtrarSoloLetras(value)
        : name === "telefono"
        ? filtrarSoloDigitos(value)
        : name === "identificacion_tributaria"
        ? (tipoDocumentoSoloDigitos(formulario.tipo_documento) ? filtrarSoloDigitos(value) : filtrarAlfanumerico(value))
        : value;

    if (name === "pais" && value === "__agregar_pais__") {
      setMostrarNuevoPais(true);
      return;
    }

    // Al cambiar de persona jurídica a natural (y viceversa) se propone el documento habitual,
    // pero solo si el que estaba seleccionado era el predeterminado del tipo anterior.
    if (name === "tipo_cliente") {
      setFormulario((actual) => {
        const eraPorDefecto = actual.tipo_documento === tipoDocumentoPorDefecto(actual.tipo_cliente);
        const tipoDoc = eraPorDefecto ? tipoDocumentoPorDefecto(value) : actual.tipo_documento;
        return {
          ...actual,
          tipo_cliente: value,
          tipo_documento: tipoDoc,
          identificacion_tributaria: tipoDoc === actual.tipo_documento ? actual.identificacion_tributaria : "",
        };
      });
      return;
    }

    // Al cambiar el tipo de documento se limpia el número para que cumpla el nuevo formato.
    if (name === "tipo_documento") {
      setFormulario((actual) => ({ ...actual, tipo_documento: value, identificacion_tributaria: "" }));
      return;
    }

    setFormulario((actual) => ({ ...actual, [name]: limpio }));
  };

  const manejarArchivo = (e) => {
    const { name, files } = e.target;
    setFormulario((actual) => ({ ...actual, [name]: files?.[0] || null }));
  };

  const agregarPais = () => {
    const pais = nuevoPais.trim().replace(/\s+/g, " ");
    if (!pais) return;

    const existente = paises.find(
      (item) => item.toLowerCase() === pais.toLowerCase()
    );

    if (existente) {
      setFormulario((prev) => ({ ...prev, pais: existente }));
    } else {
      setPaises((prev) => [...prev, pais]);
      setFormulario((prev) => ({ ...prev, pais }));
    }

    setNuevoPais("");
    setMostrarNuevoPais(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Solo estado: no se revalidan los datos bloqueados.
    if (soloEstado) {
      onGuardar({ estado: formulario.estado });
      return;
    }

    const nuevosErrores = validarFormulario(formulario, reglasCliente(formulario.tipo_documento));

    // En registro se solicitan los dos documentos legales del cliente.
    if (!cliente && !formulario.camaraComercio) {
      nuevosErrores.camaraComercio = "Adjunte la Cámara de Comercio";
    }
    if (!cliente && !formulario.contrato) {
      nuevosErrores.contrato = "Adjunte el contrato";
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onGuardar({ ...formulario });
  };

  return (
    <form className="cliente-form" onSubmit={handleSubmit}>
      <section className="form-seccion">
        <h2 className="form-seccion-titulo">Información del cliente</h2>

        <div className="form-grid">
          <div className="form-campo">
            <label>Tipo de cliente *</label>
            <select name="tipo_cliente" value={formulario.tipo_cliente} onChange={handleChange} disabled={bloqueado}>
              <option value="JURIDICA">Persona jurídica</option>
              <option value="NATURAL">Persona natural</option>
            </select>
          </div>

          <div className="form-campo">
            <label>Nombre / Razón social *</label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre o razón social"
              disabled={bloqueado}
            />
            {errores.nombre && <span className="err">{errores.nombre}</span>}
          </div>

          <div className="form-campo">
            <label>Tipo de documento *</label>
            <select name="tipo_documento" value={formulario.tipo_documento} onChange={handleChange} required disabled={bloqueado}>
              {tiposDocumentoPorPersona().map((t) => (
                <option key={t.valor} value={t.valor}>{t.etiqueta}</option>
              ))}
            </select>
            {errores.tipo_documento && <span className="err">{errores.tipo_documento}</span>}
          </div>

          <div className="form-campo">
            <label>{formulario.tipo_documento === "NIT" ? "Número de NIT *" : "Número de documento *"}</label>
            <input
              type="text"
              name="identificacion_tributaria"
              value={formulario.identificacion_tributaria}
              onChange={handleChange}
              placeholder={formulario.tipo_documento === "NIT" ? "Ej. 900123456-1" : "Ingrese el número de documento"}
              disabled={bloqueado}
            />
            {errores.identificacion_tributaria && <span className="err">{errores.identificacion_tributaria}</span>}
          </div>

          <div className="form-campo">
            <label>País</label>
            <select name="pais" value={formulario.pais} onChange={handleChange} required disabled={bloqueado}>
              <option value="">Seleccione el país</option>
              {paises.map((pais) => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
              <option value="__agregar_pais__">+ Agregar país</option>
            </select>
            {errores.pais && <span className="err">{errores.pais}</span>}
          </div>

          <div className="form-campo">
            <label>Número de teléfono *</label>
            <input
              type="text"
              name="telefono"
              value={formulario.telefono}
              onChange={handleChange}
              placeholder="Ingrese el número de teléfono"
              disabled={bloqueado}
            />
            {errores.telefono && <span className="err">{errores.telefono}</span>}
          </div>

          <div className="form-campo">
            <label>Correo electrónico *</label>
            <input
              type="email"
              name="correo"
              value={formulario.correo}
              onChange={handleChange}
              placeholder="Ingrese el correo electrónico"
              disabled={bloqueado}
            />
            {errores.correo && <span className="err">{errores.correo}</span>}
          </div>

          {cliente && (
            <div className="form-campo">
              <label>Estado</label>
              <select name="estado" value={formulario.estado} onChange={handleChange}>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>
          )}
        </div>
      </section>

      {/* DOCUMENTOS LEGALES: mismo selector que Compras, Proveedores y Ventas */}
      <section className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Documentos legales del cliente</h2>
          <p>
            {bloqueado
              ? "Documentos cargados del cliente. Puedes verlos o descargarlos."
              : "Adjunta los documentos legales correspondientes. Al pulsar el botón se abre la biblioteca de archivos."}
          </p>
        </div>

        <div className="documentos-unificados-grid">
          <DocumentoAdjunto
            titulo="Cámara de Comercio"
            name="camaraComercio"
            value={formulario.camaraComercio}
            onChange={manejarArchivo}
            disabled={bloqueado}
            error={errores.camaraComercio}
          />
          <DocumentoAdjunto
            titulo="Contrato"
            name="contrato"
            value={formulario.contrato}
            onChange={manejarArchivo}
            disabled={bloqueado}
            error={errores.contrato}
          />
        </div>
      </section>

      <div className="form-acciones-cliente">
        <button type="button" className="btn-cancelar-cliente" onClick={() => onCancelar?.()}>
          Cancelar
        </button>
        <button type="submit" className="btn-guardar-cliente">
          {soloEstado ? "Guardar estado" : cliente ? "Actualizar cliente" : "Registrar cliente"}
        </button>
      </div>

      {mostrarNuevoPais && (
        <div className="venta-modal-backdrop" role="presentation" onMouseDown={() => setMostrarNuevoPais(false)}>
          <div className="venta-modal" role="dialog" aria-modal="true" aria-labelledby="modal-pais-cliente" onMouseDown={(e) => e.stopPropagation()}>
            <div className="venta-modal-header">
              <div>
                <h3 id="modal-pais-cliente">Agregar país</h3>
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
              <button type="button" className="btn-cancelar-cliente" onClick={() => setMostrarNuevoPais(false)}>Cancelar</button>
              <button type="button" className="btn-guardar-cliente" onClick={agregarPais}>Agregar país</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
