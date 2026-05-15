import React from 'react';
import * as ui from './adminUiClasses';

export default function AdminField({ label, required, helper, error, children }) {
  return (
    <label className="block space-y-1.5">
      <span className={ui.fieldLabel}>
        {label}
        {required ? <span className="text-red-400 ms-0.5">*</span> : null}
      </span>
      {children}
      {helper ? <p className={ui.fieldHelper}>{helper}</p> : null}
      {error ? <p className={ui.fieldError}>{error}</p> : null}
    </label>
  );
}
