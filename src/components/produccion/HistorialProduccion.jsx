import HistorialEstados from "../HistorialEstados.jsx";
import { etiquetaEstadoProduccion } from "../../data/produccionesMock.js";

/** Historial de estados y fechas de una producción. */
export default function HistorialProduccion({ produccion, className }) {
  return (
    <HistorialEstados
      titulo={`Historial de la producción #${produccion.id}`}
      historial={produccion.historial || []}
      etiqueta={etiquetaEstadoProduccion}
      className={className}
    />
  );
}
