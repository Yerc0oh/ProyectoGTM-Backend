type ModalData = { id: number; label: string } | null;

type Props = {
  data: ModalData;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmModal({ data, onConfirm, onCancel }: Props) {
  if (!data) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </div>

          <div>
            <h3 className="modal-title" id="modal-title">
              ¿Confirmar eliminación?
            </h3>
            <p className="modal-desc">
              {data.label}
            </p>
            <p className="modal-warning">
              ⚠ Esta acción no se puede revertir.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-outline" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export type { ModalData };
export default ConfirmModal;