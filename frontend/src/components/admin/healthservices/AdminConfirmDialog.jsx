import React from 'react';
import AdminModal from './AdminModal';
import * as ui from './adminUiClasses';

export default function AdminConfirmDialog({ open, title, description, confirmLabel, cancelLabel, danger, onConfirm, onClose, busy }) {
  if (!open) return null;
  return (
    <AdminModal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={ui.btnGhost} onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={busy}
            className={danger ? ui.btnDanger : ui.btnPrimary}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{description}</p>
    </AdminModal>
  );
}
