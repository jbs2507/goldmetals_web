import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonAnular from "../../components/BotonAnular.jsx";
import { formatearFecha, textoCompra, textoVenta } from "../../data/insumosVinculos.js";
import { conEstado } from "../../utils/listados.js";
import Permiso from "../../components/Permiso.jsx";
import Tabla, { BotonIcono, Doble } from "../../components/Tabla.jsx";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES, INSUMOS_ORO_SEMILLA } from "../../data/semillas.js";

const formatearUnidad = (unidad) => {
  const unidades = {
    g: "Gramos (g)",
    kg: "Kilogramos (kg)",
    oz: "Onzas (oz)",
    lb: "Libras (lb)",
  };

  return unidades[unidad] || unidad;
};

export default function InsumosOro() {
  const navigate = useNavigate();

  const [insumos, setInsumos] = useAlmacen(CLAVES.insumosOro, INSUMOS_ORO_SEMILLA);

  const [busqueda, setBusqueda] = useState("");

  const anularInsumo = (id, motivo) =>
    setInsumos((a) => a.map((i) => (i.id_insumo === id ? conEstado(i, "ANULADO", motivo) : i)));

  const insumosFiltrados = insumos.filter((insumo) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      insumo.nombre.toLowerCase().includes(texto);


    return coincideBusqueda;
  });

  const totalInsumos = insumos.length;

  const pag = usePaginacion(insumosFiltrados);

  return (
    <div className="insumos-oro-page">

      {/* ENCABEZADO */}
      <div className="insumos-oro-header">
        <div>
          <h1>Insumos de oro</h1>

          <p className="nota-insumo-automatico">
            El inventario de oro aumenta con las compras y disminuye con las ventas, por eso no se registra manualmente.
          </p>
        </div>

      </div>

      {/* FILTROS */}
      <div className="insumos-oro-filtros">

        <div className="campo-busqueda-insumo-oro">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
          />
        </div>


      </div>

      {/* RESUMEN */}
      <Permiso dato="estadisticas"><div className="insumos-oro-resumen">

        <div className="resumen-insumo-oro-item">
          <span>Total insumos</span>

          <strong>
            {totalInsumos}
          </strong>
        </div>

      </div></Permiso>

      {/* LISTA */}
      <div className="insumos-oro-lista">

        <BarraListado pag={pag} archivo="insumos_oro" />

        <Tabla
          filas={pag.items}
          clave={(i) => i.id_insumo}
          claseFila={(i) => (i.estado === "ANULADO" ? "fila-anulada" : "")}
          vacio={
            <div className="sin-insumos-oro">
              <h3>No se encontraron insumos</h3>
              <p>Intenta cambiar los filtros de búsqueda.</p>
            </div>
          }
          columnas={[
            { titulo: "Insumo", render: (i) => <Doble principal={i.nombre} secundario="Oro" /> },
            {
              titulo: "Cantidad",
              dato: "cantidades",
              sinSalto: true,
              render: (i) => `${i.cantidad} ${formatearUnidad(i.unidad_medida)}`,
            },
            { titulo: "Fecha de ingreso", sinSalto: true, render: (i) => formatearFecha(i.fecha_ingreso) },
            { titulo: "Compra asociada", sinSalto: true, render: (i) => textoCompra(i.compra_asociada) },
            { titulo: "Venta asociada", sinSalto: true, render: (i) => textoVenta(i.venta_asociada) },
            {
              titulo: "Estado",
              render: (i) =>
                i.estado === "ANULADO" ? (
                  <span className="estado-insumo-oro estado-insumo-oro-inactivo">ANULADO</span>
                ) : (
                  "Vigente"
                ),
            },
          ]}
          acciones={(i) => (
            <>
              <BotonIcono
                icono="ver"
                titulo="Consultar"
                onClick={() => navigate(`/insumos-oro/consultar/${i.id_insumo}`)}
              />
              <BotonAnular
                icono
                entidad="insumo de oro"
                nombre={i.nombre}
                deshabilitado={i.estado === "ANULADO"}
                onConfirmar={(m) => anularInsumo(i.id_insumo, m)}
              />
            </>
          )}
        />
      </div>

      <Paginador pag={pag} />
    </div>
  );
}