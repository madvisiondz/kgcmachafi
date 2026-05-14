import React from 'react';

export default function AdminSearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pe-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      />
      <span className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">⌕</span>
    </div>
  );
}
