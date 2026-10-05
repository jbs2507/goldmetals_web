import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonAnular from "../../components/BotonAnular.jsx";
import { formatearFecha, textoCompra, textoVenta } from "../../data/insumosVinculos.js";
import { conEstado } from "../../utils/listados.js";
import Permiso from "../../components/Permiso.jsx";

const insumosOroIniciales = [
  { id_insumo: 1, tipo_insumo: "ORO", nombre: "Oro", cantidad: 500, unidad_medida: "g", fecha_ingreso: "2026-09-23", compra_asociada: "001", venta_asociada: null },
  { id_insumo: 2, tipo_insumo: "ORO", nombre: "Oro en polvo", cantidad: 250, unidad_medida: "g", fecha_ingreso: "2026-09-22", compra_asociada: "002", venta_asociada: null },
  { id_insumo: 3, tipo_insumo: "ORO", nombre: "Oro en lingote", cantidad: 2, unidad_medida: "kg", fecha_ingreso: "2026-09-20", compra_asociada: "001", venta_asociada: 1 },
];

const insumosPolimetalicosIniciales = [
  { id_insumo: 1, tipo_insumo: "POLIMETALICO", nombre: "Arena polimetálica", cantidad: 500, unidad_medida: "kg", fecha_ingreso: "2026-09-22", compra_asociada: "002", venta_asociada: null, mina: "Mina Chocó", acopio: "Acopio principal" },
  { id_insumo: 2, tipo_insumo: "POLIMETALICO", nombre: "Arena polimetálica fina", cantidad: 250, unidad_medida: "kg", fecha_ingreso: "2026-09-23", compra_asociada: "001", venta_asociada: null, mina: "Mina Bolívar", acopio: "Acopio Bolívar" },
  { id_insumo: 3, tipo_insumo: "POLIMETALICO", nombre: "Material polimetálico de acopio", cantidad: 100, unidad_medida: "kg", fecha_ingreso: "2026-09-20", compra_asociada: "001", venta_asociada: 2, mina: "Mina Chocó", acopio: "Acopio Chocó" },
];

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

  const [insumosOro, setInsumosOro] = useState(insumosOroIniciales);
  const [insumosPolimetalicos, setInsumosPolimetalicos] = useState(insumosPolimetalicosIniciales);

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
          <p>Gestión de insumos registrados</p>
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
        {insumosFiltrados.length === 0 ? (
          <div className="sin-insumos">
            <h3>No se encontraron insumos</h3>
            <p>Intenta cambiar los filtros de búsqueda.</p>
          </div>
        ) : (
          pag.items.map((insumo) => (
            <div className={`insumo-unificado-card ${tipo === "POLIMETALICO" ? "polimetalico" : ""}`} key={insumo.id_insumo}>
              <div className="insumo-unificado-card-header">
                <div>
                  <span>Insumo</span>
                  <h2>{insumo.nombre}</h2>
                </div>
                {insumo.estado === "ANULADO" && (
                  <span className="estado-insumo-unificado inactivo">ANULADO</span>
                )}
              </div>

              <div className="insumo-unificado-card-body">
                <div className="dato-insumo-unificado">
                  <span>Tipo de insumo</span>
                  <strong>{tipo === "ORO" ? "Oro" : "Material polimetálico"}</strong>
                </div>
                <div className="dato-insumo-unificado">
                  <span>Nombre</span>
                  <strong>{insumo.nombre}</strong>
                </div>
                <Permiso dato="cantidades"><div className="dato-insumo-unificado">
                  <span>Cantidad</span>
                  <strong>{insumo.cantidad}</strong>
                </div></Permiso>
                <div className="dato-insumo-unificado">
                  <span>Unidad de medida</span>
                  <strong>{formatearUnidad(insumo.unidad_medida)}</strong>
                </div>
                <div className="dato-insumo-unificado">
                  <span>Fecha de ingreso</span>
                  <strong>{formatearFecha(insumo.fecha_ingreso)}</strong>
                </div>
                <div className="dato-insumo-unificado">
                  <span>Compra asociada</span>
                  <strong>{textoCompra(insumo.compra_asociada)}</strong>
                </div>
                <div className="dato-insumo-unificado">
                  <span>Venta asociada</span>
                  <strong>{textoVenta(insumo.venta_asociada)}</strong>
                </div>
                {tipo === "POLIMETALICO" && (
                  <>
                    <div className="dato-insumo-unificado">
                      <span>Mina de origen</span>
                      <strong>{insumo.mina}</strong>
                    </div>
                    <div className="dato-insumo-unificado">
                      <span>Acopio</span>
                      <strong>{insumo.acopio}</strong>
                    </div>
                  </>
                )}
              </div>

              <div className="insumo-unificado-card-actions">
                <button
                  type="button"
                  className="btn-consultar-insumo-unificado"
                  onClick={() => navigate(tipo === "ORO" ? `/insumos-oro/consultar/${insumo.id_insumo}` : `/insumos-polimetalicos/consultar/${insumo.id_insumo}`)}
                >
                  Consultar
                </button>
                <BotonAnular entidad="insumo" nombre={insumo.nombre} deshabilitado={insumo.estado === "ANULADO"} onConfirmar={(m) => anularInsumo(insumo.id_insumo, m)} />
              </div>
            </div>
          ))
        )}
      </div>

      <Paginador pag={pag} />
    </div>
  );
}
