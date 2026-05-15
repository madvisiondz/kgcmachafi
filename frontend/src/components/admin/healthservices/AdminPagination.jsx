import React from 'react';
import * as ui from './adminUiClasses';

export default function AdminPagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-300">
      <span>
        {page} / {totalPages} ({total})
      </span>
      <div className="flex gap-2">
        <button type="button" disabled={!canPrev} onClick={() => onPageChange(page - 1)} className={`${ui.btnGhost} !py-1.5 !px-3 disabled:opacity-40`}>
          ←
        </button>
        <button type="button" disabled={!canNext} onClick={() => onPageChange(page + 1)} className={`${ui.btnGhost} !py-1.5 !px-3 disabled:opacity-40`}>
          →
        </button>
      </div>
    </div>
  );
}
