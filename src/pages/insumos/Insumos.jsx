import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonAnular from "../../components/BotonAnular.jsx";
import { formatearFecha, textoCompra, textoVenta } from "../../data/insumosVinculos.js";
import { conEstado } from "../../utils/listados.js";
import Permiso from "../../components/Permiso.jsx";
import Tabla, { BotonIcono, Doble } from "../../components/Tabla.jsx";
import { useAlmacen } from "../../utils/almacen.js";
import { CLAVES, INSUMOS_ORO_SEMILLA, INSUMOS_POLI_SEMILLA } from "../../data/semillas.js";

const formatearUnidad = (unidad) => ({
  g: "Gramos (g)",
  kg: "Kilogramos (kg)",
  oz: "Onzas (oz)",
  lb: "Libras (lb)",
}[unidad] || unidad);

export default function Insumos() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("ORO");
  const [busqueda, setBusqueda] = useState("");

  const [insumosOro, setInsumosOro] = useAlmacen(CLAVES.insumosOro, INSUMOS_ORO_SEMILLA);
  const [insumosPolimetalicos, setInsumosPolimetalicos] = useAlmacen(CLAVES.insumosPoli, INSUMOS_POLI_SEMILLA);

  const listaActual = tipo === "ORO" ? insumosOro : insumosPolimetalicos;

  const anularInsumo = (id, motivo) => {
    const marcar = (a) => a.map((i) => (i.id_insumo === id ? conEstado(i, "ANULADO", motivo) : i));
    if (tipo === "ORO") setInsumosOro(marcar);
    else setInsumosPolimetalicos(marcar);
  };

  const insumosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return listaActual.filter((insumo) => {
      const coincideBusqueda = tipo === "ORO"
        ? insumo.nombre.toLowerCase().includes(texto)
        : insumo.nombre.toLowerCase().includes(texto) ||
          insumo.mina.toLowerCase().includes(texto) ||
          insumo.acopio.toLowerCase().includes(texto);

      return coincideBusqueda;
    });
  }, [tipo, busqueda, listaActual]);

  const totalInsumos = listaActual.length;

  const cambiarTipo = (nuevoTipo) => {
    setTipo(nuevoTipo);
    setBusqueda("");
  };

  const pag = usePaginacion(insumosFiltrados);

  return (
    <div className="insumos-page">
      <div className="insumos-header">
        <div>
          <h1>Insumos</h1>
        </div>

        {tipo === "POLIMETALICO" && (
          <Permiso accion="crear"><button
            className="btn-registrar-insumo"
            onClick={() => navigate("/insumos/registrar")}
          >
            + Registrar insumo polimetálico
          </button></Permiso>
        )}
      </div>

      <div className="insumos-filtros">
        <div className="campo-busqueda-insumo">
          <span>⌕</span>
          <input
            type="text"
            placeholder={tipo === "ORO" ? "Buscar por nombre" : "Buscar por nombre, mina o acopio"}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

      </div>

      {tipo === "ORO" && (
        <p className="nota-insumo-automatico">
          El inventario de oro aumenta con las compras y disminuye con las ventas, por eso no se registra manualmente.
        </p>
      )}

      <div className="insumos-tabs" role="tablist" aria-label="Tipo de insumo">
        <button
          type="button"
          className={`insumo-tab ${tipo === "ORO" ? "active" : ""}`}
          onClick={() => cambiarTipo("ORO")}
          role="tab"
          aria-selected={tipo === "ORO"}
        >
          Insumos de oro
        </button>
        <button
          type="button"
          className={`insumo-tab ${tipo === "POLIMETALICO" ? "active" : ""}`}
          onClick={() => cambiarTipo("POLIMETALICO")}
          role="tab"
          aria-selected={tipo === "POLIMETALICO"}
        >
          Insumos polimetálicos
        </button>
      </div>

      <Permiso dato="estadisticas"><div className="insumos-resumen">
        <div className="resumen-insumo-item">
          <span>Total insumos</span>
          <strong>{totalInsumos}</strong>
        </div>
      </div></Permiso>

      <div className="insumos-lista">

        <BarraListado pag={pag} archivo="insumos" />

        <Tabla
          filas={pag.items}
          clave={(i) => i.id_insumo}
          claseFila={(i) => (i.estado === "ANULADO" ? "fila-anulada" : "")}
          vacio={
            <div className="sin-insumos">
              <h3>No se encontraron insumos</h3>
              <p>Intenta cambiar los filtros de búsqueda.</p>
            </div>
          }
          columnas={[
            {
              titulo: "Insumo",
              render: (i) => (
                <Doble principal={i.nombre} secundario={tipo === "ORO" ? "Oro" : "Material polimetálico"} />
              ),
            },
            {
              titulo: "Cantidad",
              dato: "cantidades",
              sinSalto: true,
              render: (i) => `${i.cantidad} ${formatearUnidad(i.unidad_medida)}`,
            },
            ...(tipo === "POLIMETALICO"
              ? [
                  { titulo: "Mina de origen", render: (i) => i.mina },
                  { titulo: "Acopio", render: (i) => i.acopio },
                ]
              : []),
            { titulo: "Fecha de ingreso", sinSalto: true, render: (i) => formatearFecha(i.fecha_ingreso) },
            { titulo: "Compra asociada", sinSalto: true, render: (i) => textoCompra(i.compra_asociada) },
            { titulo: "Venta asociada", sinSalto: true, render: (i) => textoVenta(i.venta_asociada) },
            {
              titulo: "Estado",
              render: (i) =>
                i.estado === "ANULADO" ? <span className="estado-insumo-unificado inactivo">ANULADO</span> : "Vigente",
            },
          ]}
          acciones={(i) => (
            <>
              <BotonIcono
                icono="ver"
                titulo="Consultar"
                onClick={() =>
                  navigate(
                    tipo === "ORO"
                      ? `/insumos-oro/consultar/${i.id_insumo}`
                      : `/insumos-polimetalicos/consultar/${i.id_insumo}`
                  )
                }
              />
              <BotonAnular
                icono
                entidad="insumo"
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
