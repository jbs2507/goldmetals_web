import { usePaginacion, BarraListado, Paginador } from "../../components/Listado.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonAnular from "../../components/BotonAnular.jsx";
import { formatearFecha, textoCompra, textoVenta } from "../../data/insumosVinculos.js";
import { conEstado } from "../../utils/listados.js";
import Permiso from "../../components/Permiso.jsx";

const insumosOroIniciales = [
  {
    id_insumo: 1,
    tipo_insumo: "ORO",
    nombre: "Oro",
    cantidad: 500,
    unidad_medida: "g",
    fecha_ingreso: "2026-09-23",
    compra_asociada: "001",
    venta_asociada: null,
  },
  {
    id_insumo: 2,
    tipo_insumo: "ORO",
    nombre: "Oro en polvo",
    cantidad: 250,
    unidad_medida: "g",
    fecha_ingreso: "2026-09-22",
    compra_asociada: "002",
    venta_asociada: null,
  },
  {
    id_insumo: 3,
    tipo_insumo: "ORO",
    nombre: "Oro en lingote",
    cantidad: 2,
    unidad_medida: "kg",
    fecha_ingreso: "2026-09-20",
    compra_asociada: "001",
    venta_asociada: 1,
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

export default function InsumosOro() {
  const navigate = useNavigate();

  const [insumos, setInsumos] = useState(
    insumosOroIniciales
  );

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

          <p>
            Gestión de insumos de oro registrados
          </p>

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

        {insumosFiltrados.length === 0 ? (

          <div className="sin-insumos-oro">

            <h3>
              No se encontraron insumos
            </h3>

            <p>
              Intenta cambiar los filtros de búsqueda.
            </p>

          </div>

        ) : (

          pag.items.map((insumo) => (

            <div
              className="insumo-oro-card"
              key={insumo.id_insumo}
            >

              {/* CABECERA */}
              <div className="insumo-oro-card-header">

                <div>

                  <span className="insumo-oro-label">
                    Insumo
                  </span>

                  <h2>
                    {insumo.nombre}
                  </h2>

                </div>

                {insumo.estado === "ANULADO" && (
                  <span className="estado-insumo-oro estado-insumo-oro-inactivo">
                    ANULADO
                  </span>
                )}

              </div>

              {/* INFORMACIÓN */}
              <div className="insumo-oro-card-body">

                <div className="dato-insumo-oro">
                  <span>Tipo de insumo</span>

                  <strong>
                    Oro
                  </strong>
                </div>

                <div className="dato-insumo-oro">
                  <span>Nombre</span>

                  <strong>
                    {insumo.nombre}
                  </strong>
                </div>

                <Permiso dato="cantidades"><div className="dato-insumo-oro">
                  <span>Cantidad</span>

                  <strong>
                    {insumo.cantidad}
                  </strong>
                </div></Permiso>

                <div className="dato-insumo-oro">
                  <span>Unidad de medida</span>

                  <strong>
                    {formatearUnidad(
                      insumo.unidad_medida
                    )}
                  </strong>
                </div>

                <div className="dato-insumo-oro">
                  <span>Fecha de ingreso</span>
                  <strong>{formatearFecha(insumo.fecha_ingreso)}</strong>
                </div>

                <div className="dato-insumo-oro">
                  <span>Compra asociada</span>
                  <strong>{textoCompra(insumo.compra_asociada)}</strong>
                </div>

                <div className="dato-insumo-oro">
                  <span>Venta asociada</span>
                  <strong>{textoVenta(insumo.venta_asociada)}</strong>
                </div>

              </div>

              {/* ACCIONES */}
              <div className="insumo-oro-card-actions">

                <button
                  className="btn-consultar-insumo-oro"
                  onClick={() =>
                    navigate(
                      `/insumos-oro/consultar/${insumo.id_insumo}`
                    )
                  }
                >
                  Consultar
                </button>

                <BotonAnular entidad="insumo de oro" nombre={insumo.nombre} deshabilitado={insumo.estado === "ANULADO"} onConfirmar={(m) => anularInsumo(insumo.id_insumo, m)} />

              </div>

            </div>

          ))

        )}

      </div>


      <Paginador pag={pag} />
    </div>
  );
}