# GoldMetal App — Frontend web (React + Vite)

## Cómo correrlo
```bash
npm install
npm run dev      # abre http://localhost:5173
npm run build    # versión de producción en /dist
```

## Estructura
- `src/data.js` — datos de ejemplo (reemplazar por la API)
- `src/components/` — Sidebar, gráficos (BarChart, Donut) y tarjetas
- `src/pages/Dashboard.jsx` — pantalla principal
- `src/styles.css` — estilos y colores (modo claro/oscuro con variables CSS)
- `src/assets/` — logos (oscuro para modo claro, dorado para modo oscuro)

El modo claro/oscuro se guarda en localStorage.


## Acceso (Login / Registro)
- Al abrir la app se pide iniciar sesión; sin sesión todas las rutas redirigen a `/ingresar`.
- `/registrarse` crea la cuenta (valida nombre, correo, teléfono, contraseña y términos; no permite correos repetidos) y vuelve al Login.
- El Login valida que el correo exista, que el usuario esté activo y que la contraseña coincida.
- "Recordarme" mantiene la sesión al cerrar el navegador; sin marcarlo, se cierra con el navegador.
- Usuario de prueba: `admin@mmmetalsgold.com` / `Admin12345`.
- La lógica temporal (localStorage) está en `src/auth.js`; se reemplaza por el backend cuando esté listo.

## Roles, permisos y privilegios

- **Administrador**: ve y edita todo (rol de sistema, no se puede modificar ni eliminar).
- **Contador** y **Abogado**: solo ven información general y descargan documentos; no ven precios, cantidades ni estadísticas, y no acceden a Roles ni Usuarios.
- Los permisos se administran en el módulo **Roles** (matriz módulo × privilegio + información sensible). La lógica está en `src/permisos.js`.
- Usuarios de prueba (solo prototipo): `admin@mmmetalsgold.com / Admin12345`, `contador@mmmetalsgold.com / Contador12345`, `abogado@mmmetalsgold.com / Abogado12345`.
