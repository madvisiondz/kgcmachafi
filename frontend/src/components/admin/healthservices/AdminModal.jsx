import React, { useEffect, useRef } from 'react';
import * as ui from './adminUiClasses';

export default function AdminModal({ title, children, onClose, footer }) {
  const panelRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  useEffect(() => {
    const prev = document.activeElement;
    panelRef.current?.focus();
    return () => {
      if (prev instanceof HTMLElement) prev.focus();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="hsvc-modal-title">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-t-2xl sm:rounded-2xl ${ui.glassCard} flex flex-col outline-none`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-emerald-500/15 px-4 py-3">
          <h2 id="hsvc-modal-title" className="text-base font-bold text-emerald-50">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-emerald-950/50 hover:text-white" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto p-4 flex-1">{children}</div>
        {footer ? <div className="border-t border-emerald-500/15 px-4 py-3 flex flex-wrap gap-2 justify-end">{footer}</div> : null}
      </div>
    </div>
  );
}
