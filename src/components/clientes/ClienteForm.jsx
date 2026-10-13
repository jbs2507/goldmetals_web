import { useEffect, useState } from "react";
import { filtrarSoloDigitos, filtrarSoloLetras, validarFormulario, validarNumeroDocumento } from "../../utils/validaciones.js";
import { buscarDocumentoRepetido } from "../../utils/duplicados.js";
import { CLAVES, CLIENTES_SEMILLA } from "../../data/semillas.js";
import DocumentoAdjunto from "../DocumentoAdjunto.jsx";
import { cargarPaises } from "../../utils/paises.js";
import { TIPOS_DOCUMENTO, tiposDocumentoPorPersona, tipoDocumentoPorDefecto, tipoDocumentoSoloDigitos } from "./tiposDocumento.js";

const reglasCliente = (tipoDocumento, esJuridica) => ({
  tipo_cliente: { requerido: true },
  nombre: { requerido: true, soloLetras: true, longitudMin: 3 },
  tipo_documento: { requerido: true },
  identificacion_tributaria: {
    requerido: true,
    soloDigitos: tipoDocumentoSoloDigitos(tipoDocumento),
  },
  // El país se elige de la lista (algunos llevan guion o apóstrofo), no se escribe.
  pais: { requerido: true },
  telefono: { requerido: true, soloDigitos: true, telefono: true },
  correo: { requerido: true, tipo: "email" },
  ...(esJuridica
    ? {
        representante_nombre: { requerido: true, soloLetras: true },
        representante_correo: { requerido: true, tipo: "email" },
      }
    : {}),
});

// Letras, números y guion (pasaportes y documentos extranjeros).
const filtrarAlfanumerico = (valor) => valor.replace(/[^A-Za-z0-9-]/g, "");

export default function ClienteForm({ cliente, onGuardar, onCancelar, soloEstado = false }) {
  // En edición solo se puede cambiar el estado; el resto de datos queda bloqueado.
  const bloqueado = soloEstado;

  const [formulario, setFormulario] = useState({
    tipo_cliente: "",
    nombre: "",
    tipo_documento: "",
    identificacion_tributaria: "",
    representante_nombre: "",
    representante_correo: "",
    pais: "",
    telefono: "",
    correo: "",
    estado: "ACTIVO",
    camaraComercio: null,
    contrato: null,
  });

  const [errores, setErrores] = useState({});
  // Lista de países que llega de la API (no se agregan a mano).
  const [paises, setPaises] = useState([]);
  const [cargandoPaises, setCargandoPaises] = useState(true);

  useEffect(() => {
    if (cliente) {
      setFormulario({
        tipo_cliente: cliente.tipo_cliente || "",
        nombre: cliente.nombre || "",
        tipo_documento: cliente.tipo_documento || tipoDocumentoPorDefecto(cliente.tipo_cliente),
        identificacion_tributaria: cliente.identificacion_tributaria || "",
        representante_nombre: cliente.representante_nombre || "",
        representante_correo: cliente.representante_correo || "",
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
    let activo = true;
    cargarPaises().then((lista) => {
      if (!activo) return;
      setPaises(lista);
      setCargandoPaises(false);
    });
    return () => {
      activo = false;
    };
  }, []);

  // Si el cliente ya tenía un país guardado que no viene en la lista, se conserva.
  const opcionesPais =
    formulario.pais && !paises.includes(formulario.pais) ? [formulario.pais, ...paises] : paises;

  const opcionesDocumento = [...tiposDocumentoPorPersona(formulario.tipo_cliente)];
  if (formulario.tipo_documento && !opcionesDocumento.some((t) => t.valor === formulario.tipo_documento)) {
    const actual = TIPOS_DOCUMENTO.find((t) => t.valor === formulario.tipo_documento);
    if (actual) opcionesDocumento.push(actual);
  }
  const esNatural = formulario.tipo_cliente === "NATURAL";

  const handleChange = (e) => {
    const { name, value } = e.target;
    const limpio =
      name === "nombre" || name === "representante_nombre"
        ? filtrarSoloLetras(value)
        : name === "telefono"
        ? filtrarSoloDigitos(value)
        : name === "identificacion_tributaria"
        ? (tipoDocumentoSoloDigitos(formulario.tipo_documento) ? filtrarSoloDigitos(value) : filtrarAlfanumerico(value))
        : value;

    // Al elegir o cambiar el tipo de persona se propone su documento habitual
    // y se limpia el número, porque cada tipo de persona tiene sus propios documentos.
    if (name === "tipo_cliente") {
      setFormulario((actual) => ({
        ...actual,
        tipo_cliente: value,
        tipo_documento: tipoDocumentoPorDefecto(value),
        identificacion_tributaria: "",
        // El representante legal solo aplica a personas jurídicas.
        representante_nombre: value === "JURIDICA" ? actual.representante_nombre : "",
        representante_correo: value === "JURIDICA" ? actual.representante_correo : "",
      }));
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Solo estado: no se revalidan los datos bloqueados.
    if (soloEstado) {
      onGuardar({ estado: formulario.estado });
      return;
    }

    const nuevosErrores = validarFormulario(formulario, reglasCliente(formulario.tipo_documento, formulario.tipo_cliente === "JURIDICA"));

    // Formato del número y que no exista ya otro cliente con el mismo documento.
    if (!nuevosErrores.identificacion_tributaria) {
      const errFormato = validarNumeroDocumento(formulario.tipo_documento, formulario.identificacion_tributaria);
      if (errFormato) nuevosErrores.identificacion_tributaria = errFormato;
      else if (
        buscarDocumentoRepetido({
          clave: CLAVES.clientes,
          semilla: CLIENTES_SEMILLA,
          campoDocumento: "identificacion_tributaria",
          campoId: "id_cliente",
          idActual: cliente?.id_cliente,
          numero: formulario.identificacion_tributaria,
          tipoDocumento: formulario.tipo_documento,
        })
      ) {
        nuevosErrores.identificacion_tributaria = "Ya existe un cliente con este número de documento";
      }
    }

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
        <div className="form-seccion-titulo">
          <h2>Información del cliente</h2>
          <p>
            {bloqueado
              ? "Datos registrados del cliente. Solo se puede cambiar el estado."
              : "Datos registrados del cliente."}
          </p>
        </div>

        <div className="form-grid">
          <div className="form-campo">
            <label>Tipo de cliente *</label>
            <select name="tipo_cliente" value={formulario.tipo_cliente} onChange={handleChange} disabled={bloqueado}>
              <option value="">Seleccionar tipo de persona</option>
              <option value="JURIDICA">Persona jurídica</option>
              <option value="NATURAL">Persona natural</option>
            </select>
            {errores.tipo_cliente && <span className="err">{errores.tipo_cliente}</span>}
          </div>

          {/* Primero solo el tipo de persona; al elegirlo aparecen el resto de datos */}
          {formulario.tipo_cliente && (
            <>

          <div className="form-campo">
            <label>{esNatural ? "Nombre *" : "Razón social *"}</label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              placeholder={esNatural ? "Ingrese el nombre" : "Ingrese la razón social"}
              disabled={bloqueado}
            />
            {errores.nombre && <span className="err">{errores.nombre}</span>}
          </div>

          <div className="form-campo">
            <label>Tipo de documento</label>
            <select name="tipo_documento" value={formulario.tipo_documento} onChange={handleChange} required disabled={bloqueado}>
              {opcionesDocumento.map((t) => (
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

          {formulario.tipo_cliente === "JURIDICA" && (
            <>
              <div className="form-campo">
                <label>Nombre del representante legal *</label>
                <input
                  type="text"
                  name="representante_nombre"
                  value={formulario.representante_nombre}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del representante legal"
                  disabled={bloqueado}
                />
                {errores.representante_nombre && <span className="err">{errores.representante_nombre}</span>}
              </div>

              <div className="form-campo">
                <label>Correo del representante legal *</label>
                <input
                  type="email"
                  name="representante_correo"
                  value={formulario.representante_correo}
                  onChange={handleChange}
                  placeholder="Ingrese el correo del representante legal"
                  disabled={bloqueado}
                />
                {errores.representante_correo && <span className="err">{errores.representante_correo}</span>}
              </div>
            </>
          )}

          <div className="form-campo">
            <label>País</label>
            <select name="pais" value={formulario.pais} onChange={handleChange} required disabled={bloqueado || cargandoPaises}>
              <option value="">{cargandoPaises ? "Cargando países..." : "Seleccione el país"}</option>
              {opcionesPais.map((pais) => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
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
            <label>{formulario.tipo_cliente === "JURIDICA" ? "Correo electrónico de la empresa *" : "Correo electrónico *"}</label>
            <input
              type="email"
              name="correo"
              value={formulario.correo}
              onChange={handleChange}
              placeholder={formulario.tipo_cliente === "JURIDICA" ? "Ingrese el correo electrónico de la empresa" : "Ingrese el correo electrónico"}
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
            </>
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
    </form>
  );
}
