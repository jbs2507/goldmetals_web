// Datos de contacto de los clientes (ejemplo). Se usan para asociar nombre y número
// de contacto de la entrega a cada venta. Se reemplazarán por la base de datos.
export const clientesContacto = [
  { nombre: "M&M Trading S.A.S.", telefono: "3001112233" },
  { nombre: "Global Metals International", telefono: "3104445566" },
];

export const contactoDeCliente = (nombre) =>
  clientesContacto.find((c) => c.nombre === nombre) || null;
