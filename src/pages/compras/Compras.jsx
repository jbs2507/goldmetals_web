import BotonAnular from "../../components/BotonAnular.jsx";
import { conEstado } from "../../utils/listados.js";
import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompraFiltros from "../../components/compras/CompraFiltros";
import Permiso from "../../components/Permiso.jsx";
import Tabla, { BotonIcono, Doble } from "../../components/Tabla.jsx";
import DocumentosCargados from "../../components/DocumentosCargados.jsx";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES, COMPRAS_SEMILLA } from "../../data/semillas.js";
import { formatearFecha } from "../../data/insumosVinculos.js";
import { formatoValorCompra } from "../../data/compras.js";

const Compras = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");

  // Las compras se leen del almacén: lo que se registra o edita aparece aquí al instante.
  const [compras, setCompras] = useAlmacen(CLAVES.compras, COMPRAS_SEMILLA);

  /*
   * FILTRAR COMPRAS
   */
  const comprasFiltradas = compras.filter((compra) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      compra.proveedor.toLowerCase().includes(texto) ||
      compra.acopio.toLowerCase().includes(texto) ||
      formatearFecha(compra.fechaCompra).toLowerCase().includes(texto) ||
      compra.moneda.toLowerCase().includes(texto);

    const coincideEstado =
      estado === "" || compra.estado === estado;

    return coincideBusqueda && coincideEstado;
  });

  /*
   * CONSULTAR COMPRA
   */
  const consultarCompra = (compra) => {
    navigate(`/compras/consultar/${compra.id}`);
  };

  /*
   * EDITAR COMPRA
   */
  const editarCompra = (compra) => {
    navigate(`/compras/editar/${compra.id}`);
  };

  const anularCompra = (compra, motivo) =>
    setCompras((a) => a.map((x) => (x.id === compra.id ? conEstado(x, "ANULADA", motivo) : x)));

  const pag = usePaginacion(comprasFiltradas);

  return (
    <div className="compras-page">

      {/* ENCABEZADO */}
      <div className="compras-header">
        <div>
          <h1>Compras</h1>
        </div>

        <Permiso accion="crear"><button
          type="button"
          className="btn-registrar-compra"
          onClick={() => navigate("/compras/registrar")}
        >
          + Registrar compra
        </button></Permiso>
      </div>

      {/* FILTROS */}
      <CompraFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        estado={estado}
        setEstado={setEstado}
      />

      {/* RESUMEN */}
      <Permiso dato="estadisticas"><div className="compras-resumen">

        <div className="resumen-item">
          <span>Total de compras</span>

          <strong>
            {compras.length}
          </strong>
        </div>

        <div className="resumen-item">
          <span>Registradas</span>

          <strong>
            {
              compras.filter(
                (compra) =>
                  compra.estado === "REGISTRADA"
              ).length
            }
          </strong>
        </div>

        <div className="resumen-item">
          <span>Aprobadas</span>

          <strong>
            {
              compras.filter(
                (compra) =>
                  compra.estado === "APROBADA"
              ).length
            }
          </strong>
        </div>

      </div></Permiso>

      {/* LISTADO DE COMPRAS */}
      <div className="compras-lista">

        <BarraListado pag={pag} archivo="compras" />

        <Tabla
          filas={pag.items}
          clave={(c) => c.id}
          claseFila={(c) => (c.estado === "ANULADA" ? "fila-anulada" : "")}
          vacio={
            <div className="sin-compras">
              <h3>No se encontraron compras</h3>
              <p>Intenta realizar otra búsqueda.</p>
            </div>
          }
          columnas={[
            { titulo: "N.°", fuerte: true, sinSalto: true, render: (c) => `#${c.id}` },
            { titulo: "Fecha", sinSalto: true, render: (c) => formatearFecha(c.fechaCompra) },
            { titulo: "Proveedor", render: (c) => c.proveedor },
            { titulo: "Acopio", render: (c) => c.acopio },
            {
              titulo: "Valor total",
              dato: "precios",
              alinear: "der",
              sinSalto: true,
              render: (c) => (
                <>
                  {formatoValorCompra(c.valorTotal, c.moneda)}
                  <span className="tabla-moneda">{c.moneda}</span>
                </>
              ),
            },
            {
              titulo: "Estado",
              render: (c) => <span className={`estado estado-${c.estado.toLowerCase()}`}>{c.estado}</span>,
            },
          ]}
          acciones={(c) => (
            <>
              <BotonIcono icono="ver" titulo="Consultar" onClick={() => consultarCompra(c)} />
              <DocumentosCargados
                icono
                titulo={`Documentos de la compra #${c.id}`}
                documentos={[
                  { titulo: "Certificado de origen", valor: c.certificadoOrigen },
                  { titulo: "Resultado de laboratorio", valor: c.resultadoLaboratorio },
                  { titulo: "Factura", valor: c.factura },
                ]}
              />
              <BotonAnular
                icono
                entidad="compra"
                nombre={`la compra #${c.id}`}
                deshabilitado={c.estado === "ANULADA"}
                onConfirmar={(m) => anularCompra(c, m)}
              />
            </>
          )}
        />
      </div>

      <Paginador pag={pag} />
    </div>
  );
};

export default Compras;