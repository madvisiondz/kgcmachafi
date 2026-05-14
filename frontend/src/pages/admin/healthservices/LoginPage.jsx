import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useI18n } from '../../../i18n/I18nProvider';
import { servicesPath } from '../../../routes/paths';
import { useHealthAdminAuth } from './HealthAdminAuthContext';

export default function LoginPage() {
  const { t, dir } = useI18n();
  const { isAuthenticated, login } = useHealthAdminAuth();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    const to = typeof location.state?.from === 'string' ? location.state.from : '/healthservices/admin';
    return <Navigate to={to} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const r = await login(username.trim(), password);
    setBusy(false);
    if (!r.ok) setError(r.error || 'Login failed');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-4" dir={dir}>
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-8">
        <h1 className="text-2xl font-black text-slate-900">{t('admin.hsvc.loginTitle')}</h1>
        <p className="mt-2 text-sm text-slate-600">{t('admin.hsvc.loginSub')}</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('admin.hsvc.username')}</label>
            <input
              autoComplete="username"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('admin.hsvc.password')}</label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600 font-semibold">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {busy ? t('admin.hsvc.signingIn') : t('admin.hsvc.signIn')}
          </button>
        </form>
        <Link className="mt-6 block text-center text-sm font-semibold text-emerald-700 hover:underline" to={servicesPath('/')}>
          ← {t('admin.backToSite')}
        </Link>
      </div>
    </div>
  );
}
