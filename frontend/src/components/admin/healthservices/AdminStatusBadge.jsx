import React from 'react';

const styles = {
  success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-100 text-amber-900 border-amber-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  info: 'bg-sky-100 text-sky-800 border-sky-200',
};

export default function AdminStatusBadge({ children, variant = 'neutral' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${styles[variant] || styles.neutral}`}>{children}</span>
  );
}
