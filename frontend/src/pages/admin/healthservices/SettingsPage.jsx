import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import { adminFetch } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';

export default function SettingsPage() {
  const { t } = useI18n();
  const { csrfToken } = useHealthAdminAuth();
  const toast = useHealthAdminToast();
  const [jsonText, setJsonText] = useState('{}');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwBusy, setPwBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await adminFetch('/admin/site-settings.php');
      if (!res.ok) {
        toast.error(res.errorMessage || 'Load failed');
        setLoading(false);
        return;
      }
      const d = res.data && typeof res.data === 'object' ? res.data : {};
      const settings = d.settings && typeof d.settings === 'object' ? d.settings : {};
      setJsonText(JSON.stringify(settings, null, 2));
      setLoading(false);
    })();
  }, [toast]);

  const saveSettings = async () => {
    if (!csrfToken) return;
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      toast.error('Invalid JSON');
      return;
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      toast.error('Root JSON must be an object');
      return;
    }
    setSaving(true);
    const res = await adminFetch('/admin/site-settings.php', {
      method: 'PUT',
      body: { settings: parsed },
      csrfToken,
    });
    setSaving(false);
    if (!res.ok) {
      toast.error(res.errorMessage || 'Save failed');
      return;
    }
    toast.success('Saved.');
  };

  const savePassword = async () => {
    if (!csrfToken) return;
    setPwBusy(true);
    const res = await adminFetch('/admin/profile-password.php', {
      method: 'POST',
      body: {
        current_password: pw.current,
        new_password: pw.next,
        confirm_password: pw.confirm,
      },
      csrfToken,
    });
    setPwBusy(false);
    if (!res.ok) {
      toast.error(res.errorMessage || 'Password update failed');
      return;
    }
    toast.success('Password updated.');
    setPw({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-black text-slate-900">{t('admin.hsvc.navSettings')}</h1>
      <p className="text-sm text-slate-600">{t('admin.hsvc.settingsIntro')}</p>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <h2 className="text-lg font-bold">{t('admin.hsvc.siteSettingsTitle')}</h2>
        <p className="text-xs text-slate-500">{t('admin.hsvc.siteSettingsHelp')}</p>
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <textarea
            className="w-full min-h-[240px] font-mono text-xs rounded-xl border border-slate-200 p-3"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
        )}
        <button
          type="button"
          disabled={saving || loading}
          onClick={() => void saveSettings()}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? '…' : t('admin.hsvc.saveSettings')}
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <h2 className="text-lg font-bold">{t('admin.hsvc.securityTitle')}</h2>
        <label className="block text-sm">
          <span className="font-semibold">{t('admin.hsvc.currentPassword')}</span>
          <input type="password" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">{t('admin.hsvc.newPassword')}</span>
          <input type="password" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">{t('admin.hsvc.confirmPassword')}</span>
          <input type="password" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
        </label>
        <button
          type="button"
          disabled={pwBusy}
          onClick={() => void savePassword()}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {pwBusy ? '…' : t('admin.hsvc.updatePassword')}
        </button>
      </section>
    </div>
  );
}
