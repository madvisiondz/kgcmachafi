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
              ? 'border-emerald-200 bg-emerald-50/95 text-emerald-900'
              : t.type === 'error'
                ? 'border-red-200 bg-red-50/95 text-red-900'
                : 'border-slate-200 bg-white/95 text-slate-800'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
