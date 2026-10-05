// Utilidades compartidas para listados: descarga a Excel y formato numérico.

const hoyISO = () => new Date().toISOString().slice(0, 10);

const humanizar = (k) =>
  k.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

const celda = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean") return v ? "Sí" : "No";
  const t = String(v).replace(/"/g, '""');
  return /[;"\n\r]/.test(t) ? `"${t}"` : t;
};

/** Descarga los registros como CSV (separador ";") que Excel abre directamente. */
export function descargarExcel(filas, archivo = "listado", columnasDef = null) {
  if (!filas || filas.length === 0) return;
  let lineas;
  if (columnasDef && columnasDef.length) {
    // Columnas definidas por el módulo: [{ titulo, valor: (fila) => ... }]
    lineas = [
      columnasDef.map((c) => celda(c.titulo)).join(";"),
      ...filas.map((f) => columnasDef.map((c) => celda(c.valor(f))).join(";")),
    ];
  } else {
    const columnas = [];
    filas.forEach((f) =>
      Object.keys(f).forEach((k) => {
        const v = f[k];
        const simple = v === null || typeof v !== "object";
        if (simple && !columnas.includes(k)) columnas.push(k);
      })
    );
    lineas = [
      columnas.map((c) => celda(humanizar(c))).join(";"),
      ...filas.map((f) => columnas.map((c) => celda(f[c])).join(";")),
    ];
  }
  const blob = new Blob(["\uFEFF" + lineas.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${archivo}_${hoyISO()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** 1234567.5 -> "1.234.567,50" (miles con punto, decimales con coma). */
export function formatoNumero(n, decimales = 2) {
  const num = Number(n);
  if (Number.isNaN(num)) return "";
  return num.toLocaleString("es-CO", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

/** Marca un registro con nuevo estado, fecha y deja rastro en el historial. */
export function conEstado(registro, estado, motivo = "") {
  const fecha = hoyISO();
  return {
    ...registro,
    estado,
    fecha_estado: fecha,
    ...(motivo ? { motivo_anulacion: motivo } : {}),
    historial: [...(registro.historial || []), { estado, fecha, motivo }],
  };
}
