import "./CustomAlert.css";

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
