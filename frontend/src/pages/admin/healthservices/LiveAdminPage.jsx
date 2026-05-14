import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import { adminFetch } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';
import CrudResourcePage from '../../../components/admin/healthservices/CrudResourcePage';
import { liveRecordedCrud, liveUpNextCrud } from './healthAdminCrudConfigs';

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

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 max-w-xl">
      <h2 className="text-lg font-bold">{t('admin.hsvc.liveStreamTab')}</h2>
      <label className="block text-sm">
        <span className="font-semibold">Stream URL (HLS or page)</span>
        <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.stream_url} onChange={(e) => setForm({ ...form, stream_url: e.target.value })} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Poster image URL</span>
        <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Viewer count label</span>
        <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.viewer_count_label} onChange={(e) => setForm({ ...form, viewer_count_label: e.target.value })} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold">Broadcast state</span>
        <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.broadcast_state} onChange={(e) => setForm({ ...form, broadcast_state: e.target.value })}>
          <option value="offline">offline</option>
          <option value="live">live</option>
        </select>
      </label>
      <button type="button" disabled={saving} onClick={() => void save()} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white">
        {saving ? '…' : 'Save'}
      </button>
      {!row ? <p className="text-xs text-amber-700">No row yet — saving will create id=1.</p> : null}
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
      <h1 className="text-2xl font-black text-slate-900">{t('admin.hsvc.navLive')}</h1>
      <div className="flex flex-wrap gap-2">
        {tabs.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setTab(x.id)}
            className={`rounded-full px-4 py-2 text-xs font-bold ${tab === x.id ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
          >
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
