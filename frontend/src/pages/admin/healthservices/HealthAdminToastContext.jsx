import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

/** @typedef {{ id: string, type: 'success' | 'error' | 'info', message: string }} ToastItem */

export function HealthAdminToastProvider({ children }) {
  const [toasts, setToasts] = useState(/** @type {ToastItem[]} */ ([]));

  const pushToast = useCallback((type, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5200);
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      success: (m) => pushToast('success', m),
      error: (m) => pushToast('error', m),
      info: (m) => pushToast('info', m),
    }),
    [pushToast, toasts],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useHealthAdminToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useHealthAdminToast must be used within HealthAdminToastProvider');
  return ctx;
}
