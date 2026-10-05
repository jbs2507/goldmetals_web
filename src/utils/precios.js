import { useEffect, useState } from "react";

// Mismas fuentes que usa la app móvil:
//  - Oro:   https://api.gold-api.com/price/XAU   (USD por onza troy)
//  - Dólar: https://open.er-api.com/v6/latest/USD
// Se cachea 1 hora en localStorage para no chocar con el límite
// de solicitudes del servicio gratuito. Si la API falla, se usa el
// último valor guardado.

export const GRAMOS_POR_ONZA_TROY = 31.1035;

const PRECIOS_CACHE_KEY = "gm_precios_dia_v1";
const PRECIOS_CACHE_MS = 60 * 60 * 1000; // 1 hora

const leerCache = () => {
  try {
    const raw = localStorage.getItem(PRECIOS_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

async function obtenerPreciosDelDia() {
  const [oroRes, dolarRes] = await Promise.all([
    fetch("https://api.gold-api.com/price/XAU"),
    fetch("https://open.er-api.com/v6/latest/USD"),
  ]);

  if (!oroRes.ok) throw new Error("oro");
  if (!dolarRes.ok) throw new Error("dolar");

  const oroJson = await oroRes.json();
  const dolarJson = await dolarRes.json();

  const oro = Number(oroJson?.price);
  const cop = Number(dolarJson?.rates?.COP);

  if (!Number.isFinite(oro) || !Number.isFinite(cop)) {
    throw new Error("formato");
  }

  return { oro, cop, actualizado: Date.now() };
}

/** Devuelve los precios del día (caché de 1 h). Si falla, usa el último guardado. */
export async function cargarPrecios() {
  const cache = leerCache();
  if (cache && Date.now() - cache.actualizado < PRECIOS_CACHE_MS) return cache;

  try {
    const datos = await obtenerPreciosDelDia();
    try {
      localStorage.setItem(PRECIOS_CACHE_KEY, JSON.stringify(datos));
    } catch {
      /* sin almacenamiento disponible */
    }
    return datos;
  } catch (e) {
    if (cache) return cache;
    throw e;
  }
}

/** Hook: precios del día { oro, cop, actualizado } o null mientras carga / si no hay. */
export function usePreciosDia() {
  const [precios, setPrecios] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;
    cargarPrecios()
      .then((p) => activo && setPrecios(p))
      .catch(() => activo && setError(true));
    return () => {
      activo = false;
    };
  }, []);

  return { precios, error };
}

/** Precio del oro por gramo en la moneda indicada (COP o USD). "" si no hay precio. */
export function precioOroPorGramo(precios, moneda) {
  if (!precios) return "";
  const usdGramo = precios.oro / GRAMOS_POR_ONZA_TROY;
  return moneda === "USD"
    ? Number(usdGramo.toFixed(2))
    : Math.round(usdGramo * precios.cop);
}
