import React from 'react';

export default function AdminPagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
      <span>
        Page {page} / {totalPages} ({total} total)
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-slate-200 px-3 py-1 font-semibold disabled:opacity-40 hover:bg-slate-50"
        >
          ←
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-slate-200 px-3 py-1 font-semibold disabled:opacity-40 hover:bg-slate-50"
        >
          →
        </button>
      </div>
    </div>
  );
}
