import './ConfirmModal.css'

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirmar', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-icon-wrapper">
          <span className="modal-icon">⚠️</span>
        </div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-text">{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-modal-cancel">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-modal-confirm">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}