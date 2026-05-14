import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { adminFetch } from '../../../services/admin/healthAdminApi';

/** @typedef {{ id: number, username: string, full_name?: string, role: string }} AdminUser */

const HealthAdminAuthContext = createContext(null);

export function HealthAdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(/** @type {AdminUser | null} */ (null));
  const [csrfToken, setCsrfToken] = useState(/** @type {string | null} */ (null));
  const [loading, setLoading] = useState(true);
  const [bootError, setBootError] = useState(/** @type {string | null} */ (null));

  const refreshSession = useCallback(async () => {
    setBootError(null);
    const res = await adminFetch('/admin/auth/session.php');
    if (!res.ok) {
      setAdmin(null);
      setCsrfToken(null);
      if (res.response.status === 401 || res.response.status === 403) {
        setLoading(false);
        return;
      }
      setBootError(res.errorMessage || 'Session check failed.');
      setLoading(false);
      return;
    }
    const d = res.data && typeof res.data === 'object' ? res.data : {};
    const auth = Boolean(d.authenticated);
    if (auth && d.admin && typeof d.admin === 'object') {
      setAdmin(/** @type {AdminUser} */ (d.admin));
      setCsrfToken(typeof d.csrf_token === 'string' ? d.csrf_token : null);
    } else {
      setAdmin(null);
      setCsrfToken(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (username, password) => {
    const res = await adminFetch('/admin/auth/login.php', {
      method: 'POST',
      body: { username, password },
    });
    if (!res.ok) {
      return { ok: false, error: res.errorMessage || 'Login failed.' };
    }
    const d = res.data && typeof res.data === 'object' ? res.data : {};
    const nextAdmin = d.admin;
    const token = d.csrf_token;
    if (nextAdmin && typeof nextAdmin === 'object' && typeof token === 'string') {
      setAdmin(/** @type {AdminUser} */ (nextAdmin));
      setCsrfToken(token);
      setLoading(false);
      return { ok: true };
    }
    return { ok: false, error: 'Unexpected login response.' };
  }, []);

  const logout = useCallback(async () => {
    if (!csrfToken) {
      setAdmin(null);
      setCsrfToken(null);
      return;
    }
    await adminFetch('/admin/auth/logout.php', { method: 'POST', body: {}, csrfToken });
    setAdmin(null);
    setCsrfToken(null);
  }, [csrfToken]);

  const value = useMemo(
    () => ({
      admin,
      csrfToken,
      loading,
      bootError,
      isAuthenticated: Boolean(admin),
      refreshSession,
      login,
      logout,
      setCsrfToken,
    }),
    [admin, csrfToken, loading, bootError, refreshSession, login, logout],
  );

  return <HealthAdminAuthContext.Provider value={value}>{children}</HealthAdminAuthContext.Provider>;
}

export function useHealthAdminAuth() {
  const ctx = useContext(HealthAdminAuthContext);
  if (!ctx) throw new Error('useHealthAdminAuth must be used within HealthAdminAuthProvider');
  return ctx;
}
