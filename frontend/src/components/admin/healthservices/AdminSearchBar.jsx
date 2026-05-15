import React from 'react';
import * as ui from './adminUiClasses';

export default function AdminSearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${ui.input} pe-9`}
      />
      <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-emerald-500/60 text-sm" aria-hidden>
        ⌕
      </span>
    </div>
  );
}
