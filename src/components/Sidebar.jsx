import logoDark from "../assets/logo-dark.png";
import logoGold from "../assets/logo-gold.png";

import { Link, useLocation } from "react-router-dom";
import { menu } from "../data.js";

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

      {menu.map((g) => (
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
