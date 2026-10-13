import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonAnular from "../../components/BotonAnular.jsx";
import { formatearFecha, textoCompra, textoVenta } from "../../data/insumosVinculos.js";
import { conEstado } from "../../utils/listados.js";
import Permiso from "../../components/Permiso.jsx";
import Tabla, { BotonIcono, Doble } from "../../components/Tabla.jsx";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES, INSUMOS_POLI_SEMILLA } from "../../data/semillas.js";

const formatearUnidad = (unidad) => {
  const unidades = {
    g: "Gramos (g)",
    kg: "Kilogramos (kg)",
    oz: "Onzas (oz)",
    lb: "Libras (lb)",
  };

  return unidades[unidad] || unidad;
};

export default function InsumosPolimetalicos() {
  const navigate = useNavigate();

  const [insumos, setInsumos] = useAlmacen(CLAVES.insumosPoli, INSUMOS_POLI_SEMILLA);

  const [busqueda, setBusqueda] = useState("");

  const anularInsumo = (id, motivo) =>
    setInsumos((a) => a.map((i) => (i.id_insumo === id ? conEstado(i, "ANULADO", motivo) : i)));

  const insumosFiltrados = insumos.filter((insumo) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      insumo.nombre.toLowerCase().includes(texto) ||
      insumo.mina.toLowerCase().includes(texto) ||
      insumo.acopio.toLowerCase().includes(texto);


    return coincideBusqueda;
  });

  const totalInsumos = insumos.length;

  const pag = usePaginacion(insumosFiltrados);

  return (
    <div className="insumos-polimetalicos-page">

      {/* ENCABEZADO */}
      <div className="insumos-polimetalicos-header">
        <div>
          <h1>Insumos de materiales polimetálicos</h1>
        </div>

        <Permiso accion="crear"><button
          className="btn-registrar-insumo-polimetalico"
          onClick={() =>
            navigate("/insumos-polimetalicos/registrar")
          }
        >
          + Registrar insumo
        </button></Permiso>
      </div>

      {/* FILTROS */}
      <div className="insumos-polimetalicos-filtros">

        <div className="campo-busqueda-insumo-polimetalico">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar por nombre, mina o acopio"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
          />
        </div>


      </div>

      {/* RESUMEN */}
      <Permiso dato="estadisticas"><div className="insumos-polimetalicos-resumen">

        <div className="resumen-insumo-polimetalico-item">
          <span>Total insumos</span>
          <strong>{totalInsumos}</strong>
        </div>

      </div></Permiso>

      {/* LISTA */}
      <div className="insumos-polimetalicos-lista">

        <BarraListado pag={pag} archivo="insumos_polimetalicos" />

        <Tabla
          filas={pag.items}
          clave={(i) => i.id_insumo}
          claseFila={(i) => (i.estado === "ANULADO" ? "fila-anulada" : "")}
          vacio={
            <div className="sin-insumos-polimetalicos">
              <h3>No se encontraron insumos</h3>
              <p>Intenta cambiar los filtros de búsqueda.</p>
            </div>
          }
          columnas={[
            { titulo: "Insumo", render: (i) => <Doble principal={i.nombre} secundario="Material polimetálico" /> },
            {
              titulo: "Cantidad",
              dato: "cantidades",
              sinSalto: true,
              render: (i) => `${i.cantidad} ${formatearUnidad(i.unidad_medida)}`,
            },
            { titulo: "Mina de origen", render: (i) => i.mina },
            { titulo: "Acopio", render: (i) => i.acopio },
            { titulo: "Fecha de ingreso", sinSalto: true, render: (i) => formatearFecha(i.fecha_ingreso) },
            { titulo: "Compra asociada", sinSalto: true, render: (i) => textoCompra(i.compra_asociada) },
            { titulo: "Venta asociada", sinSalto: true, render: (i) => textoVenta(i.venta_asociada) },
            {
              titulo: "Estado",
              render: (i) =>
                i.estado === "ANULADO" ? (
                  <span className="estado-insumo-polimetalico estado-insumo-polimetalico-inactivo">ANULADO</span>
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
                onClick={() => navigate(`/insumos-polimetalicos/consultar/${i.id_insumo}`)}
              />
              <BotonAnular
                icono
                entidad="insumo polimetálico"
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
