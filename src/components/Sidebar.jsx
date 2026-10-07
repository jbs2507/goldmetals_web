import logoDark from "../assets/logo-dark.png";
import logoGold from "../assets/logo-gold.png";

import { Link, useLocation } from "react-router-dom";
import { menu } from "../data.js";
import { moduloDeRuta, puede } from "../permisos.js";

export default function Sidebar() {
  const location = useLocation();

  const destino = (item) => item.path || "/dashboard";

  const estaActivo = (item) => {
    const path = destino(item);
    if (item.label === "Dashboard") return location.pathname === "/dashboard" || location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <aside className="side">
      <img className="lgl" src={logoDark} alt="Gold Metals App" />
      <img className="lgd" src={logoGold} alt="Gold Metals App" />

      {menu
        .map((g) => ({
          ...g,
          // Solo se muestran los módulos que el rol puede ver.
          items: g.items.filter((i) => {
            const { modulo } = moduloDeRuta(i.path || "/dashboard");
            // El Dashboard siempre aparece en el menú (sin permiso solo muestra la bienvenida).
            return !modulo || modulo === "dashboard" || puede(modulo, "ver");
          }),
        }))
        .filter((g) => g.items.length > 0)
        .map((g) => (
        <div key={g.seccion} style={{ display: "contents" }}>
          <small>{g.seccion}</small>
          {g.items.map((i) => (
            <Link
              to={destino(i)}
              key={i.label}
              className={`nv${estaActivo(i) ? " on" : ""}`}
            >
              {i.icon} {i.label}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
}
