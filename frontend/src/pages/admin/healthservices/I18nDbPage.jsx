import React, { useState } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import { adminFetch } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';
import * as ui from '../../../components/admin/healthservices/adminUiClasses';

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
        <h1 className={ui.pageTitle}>{t('admin.hsvc.i18nPageTitle')}</h1>
        <p className={ui.pageSub}>{t('admin.hsvc.i18nPageHelp')}</p>
      </div>

      {!isAdmin ? <p className={ui.alertWarn}>{t('admin.hsvc.i18nEditorReadOnly')}</p> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block space-y-1">
          <span className={ui.fieldLabel}>{t('admin.hsvc.i18nEntityType')}</span>
          <input className={ui.input} value={entityType} onChange={(e) => setEntityType(e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className={ui.fieldLabel}>{t('admin.hsvc.i18nEntityId')}</span>
          <input className={ui.input} value={entityId} onChange={(e) => setEntityId(e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className={ui.fieldLabel}>{t('admin.hsvc.i18nLang')}</span>
          <input className={ui.input} value={lang} onChange={(e) => setLang(e.target.value)} />
        </label>
      </div>

      <p className={ui.fieldHelper}>{t('admin.hsvc.i18nFieldsHint')}</p>

      <textarea className={ui.textareaMono} value={jsonText} onChange={(e) => setJsonText(e.target.value)} spellCheck={false} />

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={loading} onClick={() => void loadFields()} className={ui.btnSecondary}>
          {loading ? t('admin.hsvc.uiLoading') : t('admin.hsvc.i18nLoad')}
        </button>
        <button type="button" disabled={saving || !isAdmin} onClick={() => void saveFields()} className={ui.btnPrimary}>
          {saving ? t('admin.hsvc.uiSaving') : t('admin.hsvc.i18nSave')}
        </button>
      </div>
    </div>
  );
}
