import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonAnular from "../../components/BotonAnular.jsx";
import { formatearFecha, textoCompra, textoVenta } from "../../data/insumosVinculos.js";
import { conEstado } from "../../utils/listados.js";
import Permiso from "../../components/Permiso.jsx";

const insumosPolimetalicosIniciales = [
  {
    id_insumo: 1,
    tipo_insumo: "POLIMETALICO",
    nombre: "Arena polimetálica",
    cantidad: 500,
    unidad_medida: "kg",
    fecha_ingreso: "2026-09-22",
    compra_asociada: "002",
    venta_asociada: null,
    mina: "Mina Chocó",
    acopio: "Acopio principal",
  },
  {
    id_insumo: 2,
    tipo_insumo: "POLIMETALICO",
    nombre: "Arena polimetálica fina",
    cantidad: 250,
    unidad_medida: "kg",
    fecha_ingreso: "2026-09-23",
    compra_asociada: "001",
    venta_asociada: null,
    mina: "Mina Bolívar",
    acopio: "Acopio Bolívar",
  },
  {
    id_insumo: 3,
    tipo_insumo: "POLIMETALICO",
    nombre: "Material polimetálico de acopio",
    cantidad: 100,
    unidad_medida: "kg",
    fecha_ingreso: "2026-09-20",
    compra_asociada: "001",
    venta_asociada: 2,
    mina: "Mina Chocó",
    acopio: "Acopio Chocó",
  },
];

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

  const [insumos, setInsumos] = useState(
    insumosPolimetalicosIniciales
  );

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

          <p>
            Gestión de insumos de materiales polimetálicos registrados
          </p>
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

        {insumosFiltrados.length === 0 ? (

          <div className="sin-insumos-polimetalicos">
            <h3>No se encontraron insumos</h3>

            <p>
              Intenta cambiar los filtros de búsqueda.
            </p>
          </div>

        ) : (

          pag.items.map((insumo) => (

            <div
              className="insumo-polimetalico-card"
              key={insumo.id_insumo}
            >

              {/* CABECERA DE LA TARJETA */}
              <div className="insumo-polimetalico-card-header">

                <div>
                  <span className="insumo-polimetalico-label">
                    Insumo
                  </span>

                  <h2>
                    {insumo.nombre}
                  </h2>
                </div>

                {insumo.estado === "ANULADO" && (
                  <span className="estado-insumo-polimetalico estado-insumo-polimetalico-inactivo">
                    ANULADO
                  </span>
                )}

              </div>

              {/* INFORMACIÓN */}
              <div className="insumo-polimetalico-card-body">

                <div className="dato-insumo-polimetalico">
                  <span>Tipo de insumo</span>

                  <strong>
                    Material polimetálico
                  </strong>
                </div>

                <div className="dato-insumo-polimetalico">
                  <span>Nombre</span>

                  <strong>
                    {insumo.nombre}
                  </strong>
                </div>

                <Permiso dato="cantidades"><div className="dato-insumo-polimetalico">
                  <span>Cantidad</span>

                  <strong>
                    {insumo.cantidad}{" "}
                    {formatearUnidad(insumo.unidad_medida)}
                  </strong>
                </div></Permiso>

                <div className="dato-insumo-polimetalico">
                  <span>Unidad de medida</span>

                  <strong>
                    {formatearUnidad(
                      insumo.unidad_medida
                    )}
                  </strong>
                </div>

                <div className="dato-insumo-polimetalico">
                  <span>Mina de origen</span>

                  <strong>
                    {insumo.mina}
                  </strong>
                </div>

                <div className="dato-insumo-polimetalico">
                  <span>Acopio</span>

                  <strong>
                    {insumo.acopio}
                  </strong>
                </div>

                <div className="dato-insumo-polimetalico">
                  <span>Fecha de ingreso</span>
                  <strong>{formatearFecha(insumo.fecha_ingreso)}</strong>
                </div>

                <div className="dato-insumo-polimetalico">
                  <span>Compra asociada</span>
                  <strong>{textoCompra(insumo.compra_asociada)}</strong>
                </div>

                <div className="dato-insumo-polimetalico">
                  <span>Venta asociada</span>
                  <strong>{textoVenta(insumo.venta_asociada)}</strong>
                </div>

              </div>

              {/* ACCIONES */}
              <div className="insumo-polimetalico-card-actions">

                <button
                  className="btn-consultar-insumo-polimetalico"
                  onClick={() =>
                    navigate(
                      `/insumos-polimetalicos/consultar/${insumo.id_insumo}`
                    )
                  }
                >
                  Consultar
                </button>

                <BotonAnular entidad="insumo polimetálico" nombre={insumo.nombre} deshabilitado={insumo.estado === "ANULADO"} onConfirmar={(m) => anularInsumo(insumo.id_insumo, m)} />

              </div>

            </div>

          ))

        )}

      </div>


      <Paginador pag={pag} />
    </div>
  );
}
