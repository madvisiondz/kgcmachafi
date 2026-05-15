import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import { adminFetch } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';
import CrudResourcePage from '../../../components/admin/healthservices/CrudResourcePage';
import AdminUploadField from '../../../components/admin/healthservices/AdminUploadField';
import { liveRecordedCrud, liveUpNextCrud } from './healthAdminCrudConfigs';
import * as ui from '../../../components/admin/healthservices/adminUiClasses';

function StreamForm() {
  const { t } = useI18n();
  const { csrfToken } = useHealthAdminAuth();
  const toast = useHealthAdminToast();
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ stream_url: '', poster_url: '', viewer_count_label: '', broadcast_state: 'offline' });

  useEffect(() => {
    (async () => {
      const res = await adminFetch('/admin/live-page.php');
      if (!res.ok) {
        toast.error(res.errorMessage || 'Load failed');
        setLoading(false);
        return;
      }
      const d = res.data && typeof res.data === 'object' ? res.data : {};
      const item = d.item && typeof d.item === 'object' ? d.item : null;
      setRow(item);
      if (item) {
        setForm({
          stream_url: String(item.stream_url || ''),
          poster_url: String(item.poster_url || ''),
          viewer_count_label: String(item.viewer_count_label || ''),
          broadcast_state: String(item.broadcast_state || 'offline'),
        });
      }
      setLoading(false);
    })();
  }, [toast]);

  const save = async () => {
    if (!csrfToken) return;
    setSaving(true);
    const res = await adminFetch('/admin/live-page.php', { method: 'PUT', body: form, csrfToken });
    setSaving(false);
    if (!res.ok) {
      toast.error(res.errorMessage || 'Save failed');
      return;
    }
    toast.success('Saved.');
  };

  if (loading) return <p className={ui.muted}>{t('admin.hsvc.uiLoading')}</p>;

  return (
    <div className={`${ui.section} max-w-xl`}>
      <h2 className={ui.sectionTitle}>{t('admin.hsvc.liveStreamTab')}</h2>
      <label className="block space-y-1">
        <span className={ui.fieldLabel}>Stream URL (HLS or page)</span>
        <input className={ui.input} value={form.stream_url} onChange={(e) => setForm({ ...form, stream_url: e.target.value })} />
      </label>
      <label className="block space-y-1">
        <span className={ui.fieldLabel}>Poster image</span>
        <AdminUploadField
          value={form.poster_url}
          onChange={(url) => setForm({ ...form, poster_url: url })}
          csrfToken={csrfToken}
          category="live"
        />
      </label>
      <label className="block space-y-1">
        <span className={ui.fieldLabel}>Viewer count label</span>
        <input className={ui.input} value={form.viewer_count_label} onChange={(e) => setForm({ ...form, viewer_count_label: e.target.value })} />
      </label>
      <label className="block space-y-1">
        <span className={ui.fieldLabel}>Broadcast state</span>
        <select className={ui.select} value={form.broadcast_state} onChange={(e) => setForm({ ...form, broadcast_state: e.target.value })}>
          <option value="offline">offline</option>
          <option value="live">live</option>
        </select>
      </label>
      <button type="button" disabled={saving} onClick={() => void save()} className={ui.btnPrimary}>
        {saving ? t('admin.hsvc.uiSaving') : t('admin.hsvc.uiSave')}
      </button>
      {!row ? <p className={ui.alertWarn}>No row yet — saving will create id=1.</p> : null}
    </div>
  );
}

export default function LiveAdminPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState('stream');

  const tabs = [
    { id: 'stream', label: t('admin.hsvc.liveStreamTab') },
    { id: 'vod', label: t('admin.hsvc.liveRecordedTab') },
    { id: 'up', label: t('admin.hsvc.liveUpNextTab') },
  ];

  return (
    <div className="space-y-4">
      <h1 className={ui.pageTitle}>{t('admin.hsvc.navLive')}</h1>
      <div className="flex flex-wrap gap-2">
        {tabs.map((x) => (
          <button key={x.id} type="button" onClick={() => setTab(x.id)} className={tab === x.id ? ui.tabActive : ui.tabInactive}>
            {x.label}
          </button>
        ))}
      </div>
      {tab === 'stream' ? <StreamForm /> : null}
      {tab === 'vod' ? <CrudResourcePage {...liveRecordedCrud} /> : null}
      {tab === 'up' ? <CrudResourcePage {...liveUpNextCrud} /> : null}
    </div>
  );
}
