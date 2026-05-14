import React from 'react';
import AdminModal from './AdminModal';

export default function AdminConfirmDialog({ open, title, description, confirmLabel, cancelLabel, danger, onConfirm, onClose, busy }) {
  if (!open) return null;
  return (
    <AdminModal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={busy}
            className={`rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-50 ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{description}</p>
    </AdminModal>
  );
}
