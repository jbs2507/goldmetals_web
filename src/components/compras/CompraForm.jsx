import React, { useState } from "react";
import { validarFormulario } from "../../utils/validaciones.js";
import DocumentoAdjunto from "../DocumentoAdjunto.jsx";

const REGLAS_COMPRA = {
  fechaCompra: { requerido: true, tipo: "date" },
  idProveedor: { requerido: true },
  idAcopio: { requerido: true },
  peso: { requerido: true, tipo: "number" },
  ley: { requerido: true, tipo: "number" },
  precioUnitario: { requerido: true, tipo: "number" },
  valorRegalias: { tipo: "number" },
};

const CompraForm = ({
  onSubmit,
  onCancel,
  compraInicial = null,
}) => {
  const [formulario, setFormulario] = useState({
    fechaCompra: compraInicial?.fechaCompra || "",
    idProveedor: compraInicial?.idProveedor || "",
    idAcopio: compraInicial?.idAcopio || "",
    moneda: compraInicial?.moneda || "COP",
    tasaCambio: compraInicial?.tasaCambio || "",
    idInsumo: "1",
    peso: compraInicial?.peso || "",
    ley: compraInicial?.ley || "",
    precioUnitario: compraInicial?.precioUnitario || "",
    valorRegalias: compraInicial?.valorRegalias || "",
    estado: compraInicial?.estado || "REGISTRADA",
    certificadoOrigen: compraInicial?.certificadoOrigen || null,
    resultadoLaboratorio: compraInicial?.resultadoLaboratorio || null,
    factura: compraInicial?.factura || null,
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const manejarArchivo = (e) => {
    const { name, files } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: files[0] || null,
    }));
  };

  const calcularTotal = () => {
    const peso = Number(formulario.peso) || 0;
    const precio = Number(formulario.precioUnitario) || 0;
    const regalias = Number(formulario.valorRegalias) || 0;

    return peso * precio + regalias;
  };

  const [errores, setErrores] = useState({});

  const enviarFormulario = (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario(formulario, REGLAS_COMPRA);
    if (!formulario.certificadoOrigen) nuevosErrores.certificadoOrigen = "Campo obligatorio";
    if (!formulario.resultadoLaboratorio) nuevosErrores.resultadoLaboratorio = "Campo obligatorio";
    if (!formulario.factura) nuevosErrores.factura = "Campo obligatorio";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onSubmit({
      ...formulario,
      valorTotal: calcularTotal(),
    });
  };

  return (
    <form
      className="compra-form"
      onSubmit={enviarFormulario}
    >
      {/* INFORMACIÓN GENERAL */}
      <div className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Información de la compra</h2>

          <p>
            Datos generales de la compra
          </p>
        </div>

        <div className="form-grid">

          {/* FECHA */}
          <div className="form-campo">
            <label>
              Fecha de compra
            </label>

            <input
              type="date"
              name="fechaCompra"
              value={formulario.fechaCompra}
              onChange={manejarCambio}
              required
            />
            {errores.fechaCompra && <span className="err">{errores.fechaCompra}</span>}
          </div>

          {/* PROVEEDOR */}
          <div className="form-campo">
            <label>
              Proveedor asociado
            </label>

            <select
              name="idProveedor"
              value={formulario.idProveedor}
              onChange={manejarCambio}
              required
            >
              <option value="">
                Seleccionar proveedor
              </option>

              <option value="1">
                Proveedor asociado 1
              </option>

              <option value="2">
                Proveedor asociado 2
              </option>

              <option value="3">
                Proveedor asociado 3
              </option>
            </select>
            {errores.idProveedor && <span className="err">{errores.idProveedor}</span>}
          </div>

          {/* ACOPIO */}
          <div className="form-campo">
            <label>
              Acopio
            </label>

            <select
              name="idAcopio"
              value={formulario.idAcopio}
              onChange={manejarCambio}
              required
            >
              <option value="">
                Seleccionar acopio
              </option>

              <option value="1">
                Acopio principal
              </option>

              <option value="2">
                Acopio secundario
              </option>
            </select>
            {errores.idAcopio && <span className="err">{errores.idAcopio}</span>}
          </div>

          {/* MONEDA */}
          <div className="form-campo">
            <label>
              Moneda
            </label>

            <select
              name="moneda"
              value={formulario.moneda}
              onChange={manejarCambio}
              required
            >
              <option value="COP">
                COP
              </option>

              <option value="USD">
                USD
              </option>
            </select>
          </div>

          {/* TASA DE CAMBIO */}
          <div className="form-campo">
            <label>
              Tasa de cambio
            </label>

            <input
              type="number"
              name="tasaCambio"
              value={formulario.tasaCambio}
              onChange={manejarCambio}
              placeholder="Ingrese la tasa de cambio"
              min="0"
              step="0.01"
            />
          </div>

          {compraInicial && (
            <div className="form-campo">
              <label>Estado</label>
              <select
                name="estado"
                value={formulario.estado}
                onChange={manejarCambio}
                required
              >
                <option value="REGISTRADA">Registrada</option>
                <option value="APROBADA">Aprobada</option>
                <option value="ANULADA">Anulada</option>
              </select>
            </div>
          )}

        </div>
      </div>

      {/* DETALLE DE LA COMPRA */}
      <div className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Detalle de la compra</h2>

          <p>
            Información del insumo adquirido
          </p>
        </div>

        <div className="form-grid">

          <div className="form-campo">
            <label>Material comprado</label>
            <input type="text" value="Oro" readOnly />
          </div>

          {/* PESO */}
          <div className="form-campo">
            <label>
              Peso
            </label>

            <input
              type="number"
              name="peso"
              value={formulario.peso}
              onChange={manejarCambio}
              placeholder="Ingrese el peso"
              min="0"
              step="0.01"
              required
            />
            {errores.peso && <span className="err">{errores.peso}</span>}

            <small>
              Peso expresado en gramos
            </small>
          </div>

          {/* LEY */}
          <div className="form-campo">
            <label>
              Ley
            </label>

            <input
              type="number"
              name="ley"
              value={formulario.ley}
              onChange={manejarCambio}
              placeholder="Ingrese la ley"
              min="0"
              step="0.01"
              required
            />
            {errores.ley && <span className="err">{errores.ley}</span>}
          </div>

          {/* PRECIO UNITARIO */}
          <div className="form-campo">
            <label>
              Precio unitario
            </label>

            <input
              type="number"
              name="precioUnitario"
              value={formulario.precioUnitario}
              onChange={manejarCambio}
              placeholder="Ingrese el precio unitario"
              min="0"
              step="0.01"
              required
            />
            {errores.precioUnitario && <span className="err">{errores.precioUnitario}</span>}
          </div>

          {/* REGALÍAS */}
          <div className="form-campo">
            <label>
              Valor de regalías
            </label>

            <input
              type="number"
              name="valorRegalias"
              value={formulario.valorRegalias}
              onChange={manejarCambio}
              placeholder="Ingrese el valor de regalías"
              min="0"
              step="0.01"
            />
            {errores.valorRegalias && <span className="err">{errores.valorRegalias}</span>}
          </div>

          {/* TOTAL */}
          <div className="form-campo">
            <label>
              Valor total
            </label>

            <div className="valor-total">
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: formulario.moneda,
              }).format(calcularTotal())}
            </div>
          </div>

        </div>
      </div>

      {/* DOCUMENTOS */}
      <div className="form-seccion">
        <div className="form-seccion-titulo">
          <h2>Documentos de la compra</h2>
          <p>Adjunta los documentos requeridos. El botón abre la biblioteca de archivos.</p>
        </div>

        <div className="documentos-unificados-grid">
          <DocumentoAdjunto
            titulo="Certificado de origen"
            name="certificadoOrigen"
            value={formulario.certificadoOrigen}
            onChange={manejarArchivo}
            error={errores.certificadoOrigen}
          />

          <DocumentoAdjunto
            titulo="Resultado de laboratorio"
            name="resultadoLaboratorio"
            value={formulario.resultadoLaboratorio}
            onChange={manejarArchivo}
            error={errores.resultadoLaboratorio}
          />

          <DocumentoAdjunto
            titulo="Factura"
            name="factura"
            value={formulario.factura}
            onChange={manejarArchivo}
            error={errores.factura}
          />
        </div>
      </div>

      {/* BOTONES */}
      <div className="form-acciones">

        <button
          type="button"
          className="btn-cancelar-compra"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn-guardar-compra"
        >
          {compraInicial
            ? "Actualizar compra"
            : "Registrar compra"}
        </button>

      </div>
    </form>
  );
};

export default CompraForm;