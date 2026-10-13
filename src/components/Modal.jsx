import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Ventana emergente reutilizable (para formularios de registro cortos).
 * Se cierra con la X, la tecla Esc o haciendo clic fuera de la ventana.
 */
export default function Modal({ titulo, subtitulo, onCerrar, ancho = 720, children }) {
  useEffect(() => {
    const alPresionar = (e) => {
      if (e.key === "Escape") onCerrar?.();
    };
    document.addEventListener("keydown", alPresionar);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = overflowAnterior;
    };
  }, [onCerrar]);

  return createPortal(
    <div
      className="modal-gm-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCerrar?.();
      }}
    >
      <div
        className="modal-gm"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        style={{ width: `min(${ancho}px, 100%)` }}
      >
        <div className="modal-gm-header">
          <div>
            <h2>{titulo}</h2>
            {subtitulo && <p>{subtitulo}</p>}
          </div>
          <button type="button" className="modal-gm-cerrar" onClick={onCerrar} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="modal-gm-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
