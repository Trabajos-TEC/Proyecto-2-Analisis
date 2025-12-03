import "./customAlert.css";

/**
 * Nombre: CustomAlert
 * Descripción: Componente React que reemplaza las alertas nativas del navegador
 *              con un diálogo modal estilizado consistente con el diseño dark de la aplicación.
 *              Muestra mensajes con overlay oscuro y animación de entrada.
 * Entradas:
 *   - message: Texto del mensaje a mostrar (soporta saltos de línea)
 *   - onClose: Función callback a ejecutar al cerrar la alerta
 */
export default function CustomAlert({ message, onClose }) {
  return (
    <div className="alert-overlay">
      <div className="alert-box">
        <p>{message}</p>

        <button className="alert-button" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
    
  );
}
