import { useEffect, useState } from "react";
import { filtrarSoloDigitos, filtrarSoloLetras, validarFormulario } from "../../utils/validaciones.js";
import DocumentoAdjunto from "../DocumentoAdjunto.jsx";

const REGLAS_CLIENTE = {
  nombre: { requerido: true, soloLetras: true },
  identificacion_tributaria: { requerido: true, soloDigitos: true },
  pais: { requerido: true, soloLetras: true },
};

const PAISES_POR_DEFECTO = ["Singapur", "Estados Unidos", "China"];

export default function ClienteForm({ cliente, onGuardar, onCancelar }) {
  const [formulario, setFormulario] = useState({
    tipo_cliente: "JURIDICA",
    nombre: "",
    identificacion_tributaria: "",
    pais: "",
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
        identificacion_tributaria: cliente.identificacion_tributaria || "",
        pais: cliente.pais || "",
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
        : name === "identificacion_tributaria"
        ? filtrarSoloDigitos(value)
        : value;

    if (name === "pais" && value === "__agregar_pais__") {
      setMostrarNuevoPais(true);
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

    const nuevosErrores = validarFormulario(formulario, REGLAS_CLIENTE);

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
            <select name="tipo_cliente" value={formulario.tipo_cliente} onChange={handleChange}>
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
            />
            {errores.nombre && <span className="err">{errores.nombre}</span>}
          </div>

          <div className="form-campo">
            <label>Identificación tributaria *</label>
            <input
              type="text"
              name="identificacion_tributaria"
              value={formulario.identificacion_tributaria}
              onChange={handleChange}
              placeholder="Ingrese la identificación tributaria"
            />
            {errores.identificacion_tributaria && <span className="err">{errores.identificacion_tributaria}</span>}
          </div>

          <div className="form-campo">
            <label>País *</label>
            <select name="pais" value={formulario.pais} onChange={handleChange} required>
              <option value="">Seleccione el país</option>
              {paises.map((pais) => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
              <option value="__agregar_pais__">+ Agregar país</option>
            </select>
            {errores.pais && <span className="err">{errores.pais}</span>}
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
          <p>Adjunta los documentos legales correspondientes. Al pulsar el botón se abre la biblioteca de archivos.</p>
        </div>

        <div className="documentos-unificados-grid">
          <DocumentoAdjunto
            titulo="Cámara de Comercio"
            name="camaraComercio"
            value={formulario.camaraComercio}
            onChange={manejarArchivo}
            error={errores.camaraComercio}
          />
          <DocumentoAdjunto
            titulo="Contrato"
            name="contrato"
            value={formulario.contrato}
            onChange={manejarArchivo}
            error={errores.contrato}
          />
        </div>
      </section>

      <div className="form-acciones-cliente">
        <button type="button" className="btn-cancelar-cliente" onClick={() => onCancelar?.()}>
          Cancelar
        </button>
        <button type="submit" className="btn-guardar-cliente">
          {cliente ? "Actualizar cliente" : "Registrar cliente"}
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
