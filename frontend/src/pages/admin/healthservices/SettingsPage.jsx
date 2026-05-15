import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import { adminFetch } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';
import * as ui from '../../../components/admin/healthservices/adminUiClasses';

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
      <h1 className={ui.pageTitle}>{t('admin.hsvc.navSettings')}</h1>
      <p className={ui.pageSub}>{t('admin.hsvc.settingsIntro')}</p>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>{t('admin.hsvc.siteSettingsTitle')}</h2>
        <p className={ui.fieldHelper}>{t('admin.hsvc.siteSettingsHelp')}</p>
        {loading ? (
          <p className={ui.muted}>{t('admin.hsvc.uiLoading')}</p>
        ) : (
          <textarea className={ui.textareaMono} value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
        )}
        <button type="button" disabled={saving || loading} onClick={() => void saveSettings()} className={ui.btnPrimary}>
          {saving ? t('admin.hsvc.uiSaving') : t('admin.hsvc.saveSettings')}
        </button>
      </section>

      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>{t('admin.hsvc.securityTitle')}</h2>
        <label className="block space-y-1">
          <span className={ui.fieldLabel}>{t('admin.hsvc.currentPassword')}</span>
          <input type="password" className={ui.input} value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
        </label>
        <label className="block space-y-1">
          <span className={ui.fieldLabel}>{t('admin.hsvc.newPassword')}</span>
          <input type="password" className={ui.input} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
        </label>
        <label className="block space-y-1">
          <span className={ui.fieldLabel}>{t('admin.hsvc.confirmPassword')}</span>
          <input type="password" className={ui.input} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
        </label>
        <button type="button" disabled={pwBusy} onClick={() => void savePassword()} className={ui.btnSecondary}>
          {pwBusy ? t('admin.hsvc.uiSaving') : t('admin.hsvc.updatePassword')}
        </button>
      </section>
    </div>
  );
}
