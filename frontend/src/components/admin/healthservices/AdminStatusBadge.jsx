import React from 'react';

const styles = {
  success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
  danger: 'bg-red-500/20 text-red-300 border-red-500/30',
  neutral: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  info: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
};

export default function AdminStatusBadge({ children, variant = 'neutral' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${styles[variant] || styles.neutral}`}>
      {children}
    </span>
  );
}
