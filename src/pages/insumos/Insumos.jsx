import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonEliminar from "../../components/BotonEliminar";

const insumosOroIniciales = [
  { id_insumo: 1, tipo_insumo: "ORO", nombre: "Oro", cantidad: 500, unidad_medida: "g", estado: "ACTIVO" },
  { id_insumo: 2, tipo_insumo: "ORO", nombre: "Oro en polvo", cantidad: 250, unidad_medida: "g", estado: "ACTIVO" },
  { id_insumo: 3, tipo_insumo: "ORO", nombre: "Oro en lingote", cantidad: 2, unidad_medida: "kg", estado: "INACTIVO" },
];

const insumosPolimetalicosIniciales = [
  { id_insumo: 1, tipo_insumo: "POLIMETALICO", nombre: "Arena polimetálica", cantidad: 500, unidad_medida: "kg", estado: "ACTIVO", mina: "Mina Chocó", acopio: "Acopio principal" },
  { id_insumo: 2, tipo_insumo: "POLIMETALICO", nombre: "Arena polimetálica fina", cantidad: 250, unidad_medida: "kg", estado: "ACTIVO", mina: "Mina Bolívar", acopio: "Acopio Bolívar" },
  { id_insumo: 3, tipo_insumo: "POLIMETALICO", nombre: "Material polimetálico de acopio", cantidad: 100, unidad_medida: "kg", estado: "INACTIVO", mina: "Mina Chocó", acopio: "Acopio Chocó" },
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
  const [estado, setEstado] = useState("TODOS");

  const [insumosOro, setInsumosOro] = useState(insumosOroIniciales);
  const [insumosPolimetalicos, setInsumosPolimetalicos] = useState(insumosPolimetalicosIniciales);

  const listaActual = tipo === "ORO" ? insumosOro : insumosPolimetalicos;

  const eliminarInsumo = (id) => {
    const quitar = (actuales) => actuales.filter((i) => i.id_insumo !== id);
    if (tipo === "ORO") setInsumosOro(quitar);
    else setInsumosPolimetalicos(quitar);
  };

  const insumosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return listaActual.filter((insumo) => {
      const coincideBusqueda = tipo === "ORO"
        ? insumo.nombre.toLowerCase().includes(texto)
        : insumo.nombre.toLowerCase().includes(texto) ||
          insumo.mina.toLowerCase().includes(texto) ||
          insumo.acopio.toLowerCase().includes(texto);

      const coincideEstado = estado === "TODOS" || insumo.estado === estado;
      return coincideBusqueda && coincideEstado;
    });
  }, [tipo, busqueda, estado, listaActual]);

  const totalInsumos = listaActual.length;
  const insumosActivos = listaActual.filter((i) => i.estado === "ACTIVO").length;
  const insumosInactivos = listaActual.filter((i) => i.estado === "INACTIVO").length;

  const cambiarTipo = (nuevoTipo) => {
    setTipo(nuevoTipo);
    setBusqueda("");
    setEstado("TODOS");
  };

  return (
    <div className="insumos-page">
      <div className="insumos-header">
        <div>
          <h1>Insumos</h1>
          <p>Gestión de insumos registrados</p>
        </div>

        <button
          className="btn-registrar-insumo"
          onClick={() => navigate("/insumos/registrar")}
        >
          + Registrar insumo
        </button>
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

        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="TODOS">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>
      </div>

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

      <div className="insumos-resumen">
        <div className="resumen-insumo-item">
          <span>Total insumos</span>
          <strong>{totalInsumos}</strong>
        </div>
        <div className="resumen-insumo-item">
          <span>Activos</span>
          <strong>{insumosActivos}</strong>
        </div>
        <div className="resumen-insumo-item">
          <span>Inactivos</span>
          <strong>{insumosInactivos}</strong>
        </div>
      </div>

      <div className="insumos-lista">
        {insumosFiltrados.length === 0 ? (
          <div className="sin-insumos">
            <h3>No se encontraron insumos</h3>
            <p>Intenta cambiar los filtros de búsqueda.</p>
          </div>
        ) : (
          insumosFiltrados.map((insumo) => (
            <div className={`insumo-unificado-card ${tipo === "POLIMETALICO" ? "polimetalico" : ""}`} key={insumo.id_insumo}>
              <div className="insumo-unificado-card-header">
                <div>
                  <span>Insumo</span>
                  <h2>{insumo.nombre}</h2>
                </div>
                <span className={`estado-insumo-unificado ${insumo.estado === "ACTIVO" ? "activo" : "inactivo"}`}>
                  {insumo.estado}
                </span>
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
                <div className="dato-insumo-unificado">
                  <span>Cantidad</span>
                  <strong>{insumo.cantidad}</strong>
                </div>
                <div className="dato-insumo-unificado">
                  <span>Unidad de medida</span>
                  <strong>{formatearUnidad(insumo.unidad_medida)}</strong>
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
                <button
                  type="button"
                  className="btn-editar-insumo-unificado"
                  onClick={() => navigate(tipo === "ORO" ? `/insumos-oro/editar/${insumo.id_insumo}` : `/insumos-polimetalicos/editar/${insumo.id_insumo}`)}
                >
                  Editar
                </button>

                <BotonEliminar
                  entidad="insumo"
                  nombre={insumo.nombre}
                  onConfirmar={() => eliminarInsumo(insumo.id_insumo)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
