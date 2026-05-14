import React from 'react';

export default function AdminField({ label, required, helper, error, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-slate-800">
        {label}
        {required ? <span className="text-red-500 ms-0.5">*</span> : null}
      </span>
      {children}
      {helper ? <p className="text-xs text-slate-500 leading-snug">{helper}</p> : null}
      {error ? <p className="text-xs text-red-600 font-medium">{error}</p> : null}
    </label>
  );
}
