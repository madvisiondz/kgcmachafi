import React from 'react';
import { useHealthAdminToast } from '../../../pages/admin/healthservices/HealthAdminToastContext';

export default function HealthAdminToastStack() {
  const { toasts } = useHealthAdminToast();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 inset-x-4 z-[200] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-4 sm:w-96 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
            t.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100'
              : t.type === 'error'
                ? 'border-red-500/40 bg-red-950/90 text-red-100'
                : 'border-emerald-500/20 bg-slate-900/90 text-slate-200'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
