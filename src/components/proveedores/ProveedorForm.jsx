import React, { useState } from "react";
import { filtrarSoloDigitos, filtrarSoloLetras, validarFormulario } from "../../utils/validaciones.js";
import DocumentoAdjunto from "../DocumentoAdjunto.jsx";

const REGLAS_PROVEEDOR = {
  razon_social: { requerido: true, soloLetras: true },
  numero_documento: { requerido: true, soloDigitos: true },
};

const ProveedorForm = ({
  modo = "registrar",
  proveedor = {},
  onSubmit,
  onCancelar,
}) => {
  const esConsulta = modo === "consultar";
  const [razonSocial, setRazonSocial] = useState(proveedor.razon_social || "");
  const [numeroDocumento, setNumeroDocumento] = useState(proveedor.numero_documento || "");
  const [documentos, setDocumentos] = useState({
    camaraComercio: proveedor.camaraComercio || null,
    rut: proveedor.rut || null,
    certificadoRucom: proveedor.certificadoRucom || null,
  });
  const [errores, setErrores] = useState({});

  const manejarArchivo = (e) => {
    const { name, files } = e.target;
    setDocumentos((prev) => ({ ...prev, [name]: files?.[0] || null }));
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario(
      { razon_social: razonSocial, numero_documento: numeroDocumento },
      REGLAS_PROVEEDOR
    );

    if (!esConsulta && modo !== "editar") {
      if (!documentos.camaraComercio) nuevosErrores.camaraComercio = "Adjunte la Cámara de Comercio";
      if (!documentos.rut) nuevosErrores.rut = "Adjunte el RUT";
      if (!documentos.certificadoRucom) nuevosErrores.certificadoRucom = "Adjunte el RUCOM";
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    if (onSubmit) onSubmit(e);
  };

  return (
    <form className="proveedor-form" onSubmit={manejarSubmit}>
      <div className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Información general</h2>
          <p>Datos básicos del proveedor</p>
        </div>

        <div className="form-grid">
          <div className="form-campo">
            <label>Tipo de persona</label>
            <select name="tipo_persona" defaultValue={proveedor.tipo_persona || ""} disabled={esConsulta} required>
              <option value="">Seleccionar tipo de persona</option>
              <option value="NATURAL">Persona natural</option>
              <option value="JURIDICA">Persona jurídica</option>
            </select>
          </div>

          <div className="form-campo">
            <label>Nombre / Razón social</label>
            <input
              type="text"
              name="razon_social"
              value={razonSocial}
              onChange={(e) => setRazonSocial(filtrarSoloLetras(e.target.value))}
              placeholder="Ingrese el nombre o razón social"
              disabled={esConsulta}
              required
            />
            {errores.razon_social && <span className="err">{errores.razon_social}</span>}
          </div>

          <div className="form-campo">
            <label>Número de documento</label>
            <input
              type="text"
              name="numero_documento"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(filtrarSoloDigitos(e.target.value))}
              placeholder="Ingrese el número de documento"
              disabled={esConsulta}
              required
            />
            {errores.numero_documento && <span className="err">{errores.numero_documento}</span>}
          </div>
        </div>
      </div>

      <div className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Información legal</h2>
          <p>Documentación y validación legal del proveedor</p>
        </div>

        <div className="form-grid">
          {modo === "editar" && (
            <div className="form-campo">
              <label>Estado</label>
              <select name="estado" defaultValue={proveedor.estado || "ACTIVO"} required>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Documentos legales</h2>
          <p>Adjunta los documentos correspondientes. El botón abre la biblioteca de archivos.</p>
        </div>

        <div className="documentos-unificados-grid">
          <DocumentoAdjunto
            titulo="Cámara de Comercio"
            name="camaraComercio"
            value={documentos.camaraComercio}
            onChange={manejarArchivo}
            disabled={esConsulta}
            error={errores.camaraComercio}
          />
          <DocumentoAdjunto
            titulo="RUT"
            name="rut"
            value={documentos.rut}
            onChange={manejarArchivo}
            disabled={esConsulta}
            error={errores.rut}
          />
          <DocumentoAdjunto
            titulo="RUCOM"
            name="certificadoRucom"
            value={documentos.certificadoRucom}
            onChange={manejarArchivo}
            disabled={esConsulta}
            error={errores.certificadoRucom}
          />
        </div>
      </div>

      {!esConsulta && (
        <div className="form-acciones-proveedor">
          <button type="button" className="btn-cancelar-proveedor" onClick={() => onCancelar?.()}>
            Cancelar
          </button>
          <button type="submit" className="btn-guardar-proveedor">
            {modo === "editar" ? "Actualizar proveedor" : "Guardar proveedor"}
          </button>
        </div>
      )}
    </form>
  );
};

export default ProveedorForm;
