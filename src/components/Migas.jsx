import { Link, useLocation } from "react-router-dom";
import Icono from "./Iconos.jsx";

// Nombre legible de cada módulo (primer tramo de la ruta).
// Los de insumos cuelgan de "Insumos" para que la ruta se entienda sola.
const MODULOS = {
  roles: [["Roles", "/roles"]],
  usuarios: [["Usuarios", "/usuarios"]],
  compras: [["Compras", "/compras"]],
  proveedores: [["Proveedores", "/proveedores"]],
  produccion: [["Producción", "/produccion"]],
  empleados: [["Empleados", "/empleados"]],
  ventas: [["Ventas", "/ventas"]],
  clientes: [["Clientes", "/clientes"]],
  pedidos: [["Pedidos", "/pedidos"]],
  insumos: [["Insumos", "/insumos"]],
  "insumos-oro": [["Insumos", "/insumos"], ["Oro", "/insumos-oro"]],
  "insumos-polimetalicos": [["Insumos", "/insumos"], ["Polimetálicos", "/insumos-polimetalicos"]],
};

const ACCIONES = {
  registrar: "Registrar",
  consultar: "Consultar",
  editar: "Editar",
};

/** Devuelve los tramos [{ texto, to }] de la ruta, o null si no aplica (Dashboard, etc.). */
export function tramosDeRuta(pathname) {
  const [modulo, accion] = pathname.split("/").filter(Boolean);
  const base = MODULOS[modulo];
  if (!base) return null;

  const tramos = base.map(([texto, to]) => ({ texto, to }));
  if (accion && ACCIONES[accion]) tramos.push({ texto: ACCIONES[accion], to: null });
  return tramos;
}

/** Título de la pestaña del navegador según la pantalla. */
export function tituloDeRuta(pathname) {
  if (pathname === "/dashboard") return "Dashboard · GoldMetals App";
  const tramos = tramosDeRuta(pathname);
  if (!tramos) return "GoldMetals App";
  return `${tramos.map((t) => t.texto).reverse().join(" · ")} · GoldMetals App`;
}

/** Indica dónde está el usuario y permite volver a un nivel anterior. */
export default function Migas() {
  const { pathname } = useLocation();
  const tramos = tramosDeRuta(pathname);
  if (!tramos) return null;

  return (
    <nav className="ux-crumbs" aria-label="Ruta de navegación">
      <Link to="/dashboard" className="ux-crumb-home" aria-label="Ir al Dashboard">
        <Icono nombre="inicio" size={14} />
      </Link>

      {tramos.map((t, i) => {
        const ultimo = i === tramos.length - 1;
        // El tramo actual (o un tramo cuyo destino es esta misma pantalla) no es un enlace.
        const esActual = ultimo || t.to === pathname;
        return (
          <span key={`${t.texto}-${i}`} className="ux-crumb-item">
            <Icono nombre="flecha" size={12} className="ux-crumb-sep" />
            {esActual || !t.to ? (
              <span aria-current={ultimo ? "page" : undefined} className="ux-crumb-actual">
                {t.texto}
              </span>
            ) : (
              <Link to={t.to}>{t.texto}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
