import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { iniciarSesion, registrarUsuario } from "../auth.js";

const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RE_TEL = /^[0-9]{7,15}$/;

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    clave: "",
    clave2: "",
    terminos: false,
  });

  const [errores, setErrores] = useState({});
  const [mostrarClave, setMostrarClave] = useState(false);
  const [mostrarClave2, setMostrarClave2] = useState(false);

  const cambiar = (campo) => (e) => {
    const valor =
      campo === "terminos"
        ? e.target.checked
        : e.target.value;

    setForm((f) => ({
      ...f,
      [campo]: valor,
    }));
  };

  function validar() {
    const e = {};

    // Nombre
    if (form.nombre.trim().length < 3) {
      e.nombre = "Escribe tu nombre completo";
    }

    // Correo
    if (!form.correo.trim()) {
      e.correo = "Ingresa tu correo";
    } else if (!RE_CORREO.test(form.correo)) {
      e.correo = "El correo no es válido";
    }

    // Teléfono
    if (
      form.telefono &&
      !RE_TEL.test(form.telefono)
    ) {
      e.telefono =
        "Solo números, entre 7 y 15 dígitos";
    }

    // Contraseña
    if (form.clave.length < 8) {
      e.clave = "Mínimo 8 caracteres";
    }

    // Confirmar contraseña
    if (form.clave2 !== form.clave) {
      e.clave2 =
        "Las contraseñas no coinciden";
    }

    // Términos
    if (!form.terminos) {
      e.terminos =
        "Debes aceptar los términos y condiciones";
    }

    setErrores(e);

    return Object.keys(e).length === 0;
  }

  function enviar(ev) {
    ev.preventDefault();

    if (!validar()) return;

    /*
      Cuando conectemos el backend, aquí irá:

      POST /api/auth/registro
    */

    const r = registrarUsuario({
      nombre_completo: form.nombre.trim(),
      correo: form.correo.trim(),
      telefono: form.telefono.trim(),
      contrasena: form.clave,
      estado: "ACTIVO",
    });

    // Correo repetido: se muestra el error en el campo
    if (!r.ok) {
      setErrores({ correo: r.error });
      return;
    }

    // Al registrarse correctamente, la cuenta queda iniciada
    // y el usuario entra directamente al Dashboard.
    const usuario = {
      nombre_completo: form.nombre.trim(),
      correo: form.correo.trim(),
    };

    iniciarSesion(usuario, true);
    navigate("/dashboard", { replace: true });
  }

  return (
    <AuthLayout
      titulo="Crea tu cuenta"
      subtitulo="Regístrate y lleva el control de toda tu operación."
      pie={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/ingresar">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form
        className="af"
        onSubmit={enviar}
        noValidate
      >
        {/* =========================================
            NOMBRE COMPLETO
        ========================================= */}
        <div className="fi">
          <label>Nombre completo</label>

          <input
            type="text"
            value={form.nombre}
            onChange={cambiar("nombre")}
            placeholder="Ana María Gómez"
          />

          {errores.nombre && (
            <span className="err">
              {errores.nombre}
            </span>
          )}
        </div>

        {/* =========================================
            CORREO
        ========================================= */}
        <div className="fi">
          <label>Correo electrónico</label>

          <input
            type="email"
            value={form.correo}
            onChange={cambiar("correo")}
            placeholder="tucorreo@empresa.com"
          />

          {errores.correo && (
            <span className="err">
              {errores.correo}
            </span>
          )}
        </div>

        {/* =========================================
            TELÉFONO
        ========================================= */}
        <div className="fi">
          <label>Teléfono</label>

          <input
            type="tel"
            value={form.telefono}
            onChange={cambiar("telefono")}
            placeholder="3001234567"
          />

          {errores.telefono && (
            <span className="err">
              {errores.telefono}
            </span>
          )}
        </div>

        {/* =========================================
            CONTRASEÑA
        ========================================= */}
        <div className="fi">
          <label>Contraseña</label>

          <div className="fi-pass">
            <input
              type={
                mostrarClave
                  ? "text"
                  : "password"
              }
              value={form.clave}
              onChange={cambiar("clave")}
              placeholder="Mínimo 8 caracteres"
            />

            <button
              type="button"
              onClick={() =>
                setMostrarClave(!mostrarClave)
              }
              aria-label={
                mostrarClave
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {mostrarClave ? (
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
            CONFIRMAR CONTRASEÑA
        ========================================= */}
        <div className="fi">
          <label>Confirmar contraseña</label>

          <div className="fi-pass">
            <input
              type={
                mostrarClave2
                  ? "text"
                  : "password"
              }
              value={form.clave2}
              onChange={cambiar("clave2")}
              placeholder="Repite la contraseña"
            />

            <button
              type="button"
              onClick={() =>
                setMostrarClave2(!mostrarClave2)
              }
              aria-label={
                mostrarClave2
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {mostrarClave2 ? (
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

          {errores.clave2 && (
            <span className="err">
              {errores.clave2}
            </span>
          )}
        </div>

        {/* =========================================
            TÉRMINOS Y CONDICIONES
        ========================================= */}
        <div className="terms">
          <label className="terms-check">
            <input
              type="checkbox"
              checked={form.terminos}
              onChange={cambiar("terminos")}
            />

            <span>
              Acepto los{" "}
              <span className="terms-link">
                términos y condiciones
              </span>
            </span>
          </label>

          {errores.terminos && (
            <span className="err">
              {errores.terminos}
            </span>
          )}
        </div>

        {/* =========================================
            BOTÓN CREAR CUENTA
        ========================================= */}
        <button
          className="btn"
          type="submit"
        >
          Crear cuenta
        </button>
      </form>
    </AuthLayout>
  );
}