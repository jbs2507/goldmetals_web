import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { autenticar, iniciarSesion } from "../auth.js";
import AuthLayout from "../components/AuthLayout.jsx";

const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const registrado = location.state?.registrado;

  const [correo, setCorreo] = useState(location.state?.correo || "");
  const [clave, setClave] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [verClave, setVerClave] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  function validar() {
    const e = {};

    if (!correo.trim()) {
      e.correo = "Ingresa tu correo";
    } else if (!RE_CORREO.test(correo)) {
      e.correo = "El correo no es válido";
    }

    if (!clave) {
      e.clave = "Ingresa tu contraseña";
    }

    setErrores(e);

    return Object.keys(e).length === 0;
  }

  async function enviar(ev) {
    ev.preventDefault();

    if (!validar()) return;

    setCargando(true);

    // TODO backend: await api.post("/auth/login", { correo, clave, recordarme })
    const r = autenticar(correo, clave);

    if (!r.ok) {
      setErrores(r.campo ? { [r.campo]: r.error } : { general: r.error });
      setCargando(false);
      return;
    }

    iniciarSesion(r.usuario, recordarme);
    setCargando(false);

    // Entrar al Dashboard
    navigate("/dashboard", { replace: true });
  }

  return (
    <AuthLayout
      titulo="Inicia sesión"
      subtitulo="Ingresa tus credenciales para entrar al panel"
      pie={
        <>
          ¿No tienes cuenta?{" "}
          <Link to="/registrarse">
            Regístrate
          </Link>
        </>
      }
    >
      {registrado && (
        <div className="ok-msg">
          ¡Cuenta creada! Ahora inicia sesión con tu correo y contraseña.
        </div>
      )}

      <form
        className="af"
        onSubmit={enviar}
        noValidate
      >
        {/* =========================================
            CORREO ELECTRÓNICO
        ========================================= */}
        <div
          className={`fi${
            errores.correo ? " has-error" : ""
          }`}
        >
          <label>Correo electrónico</label>

          <input
            type="email"
            placeholder="tucorreo@gmail.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            autoComplete="email"
          />

          {errores.correo && (
            <span className="err">
              {errores.correo}
            </span>
          )}
        </div>

        {/* =========================================
            CONTRASEÑA
        ========================================= */}
        <div
          className={`fi${
            errores.clave ? " has-error" : ""
          }`}
        >
          <label>Contraseña</label>

          <div className="fi-pass">
            <input
              type={verClave ? "text" : "password"}
              placeholder="••••••••"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() => setVerClave(!verClave)}
              aria-label={
                verClave
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {verClave ? (
                /* OJO ABIERTO */
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                /* OJO CERRADO */
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M3 3l18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="M10.6 5.1A9.9 9.9 0 0 1 12 5c6.5 0 10 7 10 7a18.4 18.4 0 0 1-3.1 3.9M6.2 6.2C3.6 8 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4-.8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </button>
          </div>

          {errores.clave && (
            <span className="err">
              {errores.clave}
            </span>
          )}
        </div>

        {/* =========================================
            RECORDARME / OLVIDÉ MI CONTRASEÑA
        ========================================= */}
        <div className="af-row">
          <label className="remember">
            <input
              type="checkbox"
              checked={recordarme}
              onChange={(e) =>
                setRecordarme(e.target.checked)
              }
            />

            Recordarme
          </label>

          <Link
            to="/olvide-clave"
            className="forgot"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* =========================================
            ERROR GENERAL
        ========================================= */}
        {errores.general && (
          <span className="err">
            {errores.general}
          </span>
        )}

        {/* =========================================
            BOTÓN INICIAR SESIÓN
        ========================================= */}
        <button
          className="btn"
          type="submit"
          disabled={cargando}
        >
          {cargando
            ? "Ingresando..."
            : "Iniciar sesión"}
        </button>
      </form>
    </AuthLayout>
  );
}