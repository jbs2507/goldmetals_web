import BotonAnular from "../../components/BotonAnular.jsx";
import { conEstado } from "../../utils/listados.js";
import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProduccionCard from "../../components/produccion/ProduccionCard";
import ProduccionFiltros from "../../components/produccion/ProduccionFiltros";
import { produccionesMock, esOro, formatoMonto } from "../../data/produccionesMock.js";
import Permiso from "../../components/Permiso.jsx";

const Produccion = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [material, setMaterial] = useState("TODOS");
  const [estado, setEstado] = useState("TODOS");

  const [producciones, setProducciones] = useState(produccionesMock);

  const anularProduccion = (produccion, motivo) =>
    setProducciones((a) => a.map((p) => (p.id === produccion.id ? conEstado(p, "ANULADA", motivo) : p)));

  const produccionesFiltradas = producciones.filter((produccion) => {
    const texto = busqueda.toLowerCase();

    const esOro = produccion.insumo.toLowerCase() === "oro";
    const coincideMaterial =
      material === "TODOS" || (material === "ORO" ? esOro : !esOro);
    const anulada = produccion.estado === "ANULADA";
    const coincideEstado =
      estado === "TODOS" || (estado === "ANULADA" ? anulada : !anulada);

    return (
      coincideMaterial &&
      coincideEstado &&
      (
      produccion.insumo.toLowerCase().includes(texto) ||
      produccion.cliente.toLowerCase().includes(texto) ||
      produccion.pedido.toLowerCase().includes(texto) ||
      produccion.mina.toLowerCase().includes(texto) ||
      produccion.fecha.toLowerCase().includes(texto)
      )
    );
  });

  const consultarProduccion = (produccion) => {
    navigate(`/produccion/consultar/${produccion.id}`);
  };

  const editarProduccion = (produccion) => {
    navigate(`/produccion/editar/${produccion.id}`);
  };

  const sumar = (lista) =>
    lista.reduce((acc, p) => acc + (parseFloat(String(p.cantidad).replace(",", ".")) || 0), 0);
  const vigentes = produccionesFiltradas.filter((p) => p.estado !== "ANULADA");
  // Resumen general (no depende de los filtros): solo producciones vigentes.
  const vigentesTotales = producciones.filter((p) => p.estado !== "ANULADA");
  const cantidadOro = vigentesTotales.filter(esOro).length;
  const cantidadArenas = vigentesTotales.filter((p) => !esOro(p)).length;
  const montoTotal = vigentesTotales.reduce((acc, p) => acc + (Number(p.monto) || 0), 0);
  const totalOro = sumar(vigentes.filter((p) => p.insumo.toLowerCase() === "oro"));
  const totalPoli = sumar(vigentes.filter((p) => p.insumo.toLowerCase() !== "oro"));
  const fmt = (n) => n.toLocaleString("es-CO", { maximumFractionDigits: 2 });

  const pag = usePaginacion(produccionesFiltradas);

  return (
    <div className="produccion-page">
      <div className="produccion-header">
        <div>
          <h1>Producción</h1>
          <p>
            Gestión de producción. Las producciones se crean automáticamente
            cuando se genera un pedido.
          </p>
        </div>
      </div>

      <ProduccionFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        material={material}
        setMaterial={setMaterial}
        estado={estado}
        setEstado={setEstado}
      />

      <Permiso dato="estadisticas"><div className="produccion-resumen">
        <div className="resumen-produccion-item">
          <span>Total de producciones</span>
          <strong>{producciones.length}</strong>
        </div>
        <div className="resumen-produccion-item">
          <span>Producciones de oro</span>
          <strong>{cantidadOro}</strong>
        </div>
        <div className="resumen-produccion-item">
          <span>Producciones de arenas</span>
          <strong>{cantidadArenas}</strong>
        </div>
        <div className="resumen-produccion-item">
          <span>Monto total de producciones</span>
          <strong>{formatoMonto(montoTotal)}</strong>
        </div>
        <div className="resumen-produccion-item">
          <span>Total oro en producción</span>
          <strong>{fmt(totalOro)} g</strong>
        </div>
        <div className="resumen-produccion-item">
          <span>Total polimetálico en producción</span>
          <strong>{fmt(totalPoli)} kg</strong>
        </div>
      </div></Permiso>

      <div className="producciones-lista">
        <BarraListado pag={pag} archivo="produccion" />
        {produccionesFiltradas.length > 0 ? (
          pag.items.map((produccion) => (
            <ProduccionCard
              key={produccion.id}
              produccion={produccion}
              onConsultar={consultarProduccion}
              onEditar={editarProduccion}
              onAnular={anularProduccion}
            />
          ))
        ) : (
          <div className="sin-producciones">
            <h3>No se encontraron producciones</h3>
            <p>Intenta realizar otra búsqueda.</p>
          </div>
        )}
      </div>

      <Paginador pag={pag} />
    </div>
  );
};

export default Produccion;