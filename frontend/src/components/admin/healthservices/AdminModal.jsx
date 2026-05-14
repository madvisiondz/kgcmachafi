import React from 'react';

export default function AdminModal({ title, children, onClose, footer }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto p-4 flex-1">{children}</div>
        {footer ? <div className="border-t border-slate-100 px-4 py-3 flex flex-wrap gap-2 justify-end">{footer}</div> : null}
      </div>
    </div>
  );
}
