import { AlertTriangle, X } from "lucide-react";
import "./AlertModal.css";

interface AlertModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

function AlertModal({
  title,
  message,
  onClose,
}: AlertModalProps) {
  return (
    <div
    className="alert-modal-overlay"
    onClick={(e) => {
        e.stopPropagation();
        onClose();
    }}
    >
      <div
        className="alert-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="alert-modal-header">

          <div className="alert-icon">
            <AlertTriangle size={22} />
          </div>

          <button
            className="alert-close-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>

        </div>

        {/* Content */}
        <div className="alert-modal-content">

          <h2>{title}</h2>

          <p>{message}</p>

        </div>

        {/* Button */}
        <button
          className="alert-ok-button"
          onClick={onClose}
        >
          Got it
        </button>

      </div>
    </div>
  );
}

export default AlertModal;