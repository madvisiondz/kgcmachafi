import React, { useState } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import { adminFetch } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';

export default function I18nDbPage() {
  const { t } = useI18n();
  const { admin, csrfToken } = useHealthAdminAuth();
  const toast = useHealthAdminToast();
  const [entityType, setEntityType] = useState('news_articles');
  const [entityId, setEntityId] = useState('1');
  const [lang, setLang] = useState('en');
  const [jsonText, setJsonText] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAdmin = admin?.role === 'admin';

  const loadFields = async () => {
    setLoading(true);
    const id = Number.parseInt(entityId, 10);
    const q = new URLSearchParams({
      entity_type: entityType.trim(),
      entity_id: String(Number.isFinite(id) ? id : 0),
      lang: lang.trim(),
    });
    const res = await adminFetch(`/admin/i18n.php?${q.toString()}`);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.errorMessage || t('admin.hsvc.uiLoadError'));
      return;
    }
    const data = res.data && typeof res.data === 'object' ? res.data : {};
    const fields = /** @type {Record<string, string>} */ (data.fields && typeof data.fields === 'object' ? data.fields : {});
    setJsonText(JSON.stringify(fields, null, 2));
    toast.success(t('admin.hsvc.i18nLoaded'));
  };

  const saveFields = async () => {
    if (!csrfToken) {
      toast.error(t('admin.hsvc.uiMissingCsrf'));
      return;
    }
    if (!isAdmin) {
      toast.error(t('admin.hsvc.i18nAdminOnly'));
      return;
    }
    let fields;
    try {
      fields = JSON.parse(jsonText || '{}');
    } catch {
      toast.error(t('admin.hsvc.i18nInvalidJson'));
      return;
    }
    if (typeof fields !== 'object' || fields === null || Array.isArray(fields)) {
      toast.error(t('admin.hsvc.i18nInvalidJson'));
      return;
    }
    const id = Number.parseInt(entityId, 10);
    setSaving(true);
    const res = await adminFetch('/admin/i18n.php', {
      method: 'PUT',
      csrfToken,
      body: {
        entity_type: entityType.trim(),
        entity_id: Number.isFinite(id) ? id : 0,
        lang: lang.trim(),
        fields,
      },
    });
    setSaving(false);
    if (!res.ok) {
      toast.error(res.errorMessage || t('admin.hsvc.uiSaveFailed'));
      return;
    }
    toast.success(t('admin.hsvc.uiSaved'));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900">{t('admin.hsvc.i18nPageTitle')}</h1>
        <p className="mt-1 text-sm text-slate-600">{t('admin.hsvc.i18nPageHelp')}</p>
      </div>

      {!isAdmin ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">{t('admin.hsvc.i18nEditorReadOnly')}</p> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm font-bold text-slate-800">
          {t('admin.hsvc.i18nEntityType')}
          <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={entityType} onChange={(e) => setEntityType(e.target.value)} />
        </label>
        <label className="block text-sm font-bold text-slate-800">
          {t('admin.hsvc.i18nEntityId')}
          <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={entityId} onChange={(e) => setEntityId(e.target.value)} />
        </label>
        <label className="block text-sm font-bold text-slate-800">
          {t('admin.hsvc.i18nLang')}
          <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={lang} onChange={(e) => setLang(e.target.value)} />
        </label>
      </div>

      <p className="text-xs text-slate-500">{t('admin.hsvc.i18nFieldsHint')}</p>

      <textarea
        className="min-h-[220px] w-full rounded-2xl border border-slate-200 bg-white p-3 font-mono text-sm"
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        spellCheck={false}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => void loadFields()}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? t('admin.hsvc.uiLoading') : t('admin.hsvc.i18nLoad')}
        </button>
        <button
          type="button"
          disabled={saving || !isAdmin}
          onClick={() => void saveFields()}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? t('admin.hsvc.uiSaving') : t('admin.hsvc.i18nSave')}
        </button>
      </div>
    </div>
  );
}
