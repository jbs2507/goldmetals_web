import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompraCard from "../../components/compras/CompraCard";
import CompraFiltros from "../../components/compras/CompraFiltros";

const Compras = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");

  /*
   * DATOS DE PRUEBA
   * -----------------------------------------
   * Estos datos representan únicamente COMPRAS.
   * Más adelante serán reemplazados por la
   * información proveniente de la base de datos.
   */
  const compras = [
    {
      id: "001",
      proveedor: "Proveedor asociado 1",
      acopio: "Acopio principal",
      fecha: "23/09/2026",
      moneda: "COP",
      valorTotal: "$5.000.000",
      estado: "REGISTRADA",
    },
    {
      id: "002",
      proveedor: "Proveedor asociado 2",
      acopio: "Acopio principal",
      fecha: "22/09/2026",
      moneda: "COP",
      valorTotal: "$8.500.000",
      estado: "APROBADA",
    },
    {
      id: "003",
      proveedor: "Proveedor asociado 3",
      acopio: "Acopio secundario",
      fecha: "20/09/2026",
      moneda: "USD",
      valorTotal: "$3.200",
      estado: "CANCELADA",
    },
  ];

  /*
   * FILTRAR COMPRAS
   */
  const comprasFiltradas = compras.filter((compra) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      compra.proveedor.toLowerCase().includes(texto) ||
      compra.acopio.toLowerCase().includes(texto) ||
      compra.fecha.toLowerCase().includes(texto) ||
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

  return (
    <div className="compras-page">

      {/* ENCABEZADO */}
      <div className="compras-header">
        <div>
          <h1>Compras</h1>

          <p>
            Registro y gestión de compras
          </p>
        </div>

        <button
          type="button"
          className="btn-registrar-compra"
          onClick={() => navigate("/compras/registrar")}
        >
          + Registrar compra
        </button>
      </div>

      {/* FILTROS */}
      <CompraFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        estado={estado}
        setEstado={setEstado}
      />

      {/* RESUMEN */}
      <div className="compras-resumen">

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

      </div>

      {/* LISTADO DE COMPRAS */}
      <div className="compras-lista">

        {comprasFiltradas.length > 0 ? (
          comprasFiltradas.map((compra) => (
            <CompraCard
              key={compra.id}
              compra={compra}
              onConsultar={consultarCompra}
              onEditar={editarCompra}
            />
          ))
        ) : (
          <div className="sin-compras">
            <h3>
              No se encontraron compras
            </h3>

            <p>
              Intenta realizar otra búsqueda.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Compras;