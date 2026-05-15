import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useI18n } from '../../../i18n/I18nProvider';
import { servicesPath } from '../../../routes/paths';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import * as ui from '../../../components/admin/healthservices/adminUiClasses';

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
    if (!r.ok) setError(r.error || t('admin.hsvc.loginFailed'));
  };

  return (
    <div className={`${ui.shell} flex min-h-screen flex-col items-center justify-center p-4`} dir={dir}>
      <div className={`w-full max-w-md ${ui.glassCard} p-8`}>
        <h1 className={ui.pageTitle}>{t('admin.hsvc.loginTitle')}</h1>
        <p className={`${ui.pageSub} mt-2`}>{t('admin.hsvc.loginSub')}</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1">
            <span className={ui.fieldLabel}>{t('admin.hsvc.username')}</span>
            <input autoComplete="username" className={ui.input} value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label className="block space-y-1">
            <span className={ui.fieldLabel}>{t('admin.hsvc.password')}</span>
            <input
              type="password"
              autoComplete="current-password"
              className={ui.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <p className="text-sm text-red-400 font-semibold">{error}</p> : null}
          <button type="submit" disabled={busy} className={`${ui.btnPrimary} w-full`}>
            {busy ? t('admin.hsvc.signingIn') : t('admin.hsvc.signIn')}
          </button>
        </form>
        <Link className={`mt-6 block text-center ${ui.link}`} to={servicesPath('/')}>
          ← {t('admin.backToSite')}
        </Link>
      </div>
    </div>
  );
}
