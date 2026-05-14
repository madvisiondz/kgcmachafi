import React, { useCallback, useEffect, useState } from 'react';
import { adminFetch, extractItemsList } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';
import AdminModal from '../../../components/admin/healthservices/AdminModal';
import AdminConfirmDialog from '../../../components/admin/healthservices/AdminConfirmDialog';

function parseJsonObj(v, fallback = {}) {
  if (v && typeof v === 'object' && !Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      const p = JSON.parse(v);
      return typeof p === 'object' && p !== null && !Array.isArray(p) ? p : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export default function DonationCampaignsAdminPage() {
  const { csrfToken } = useHealthAdminAuth();
  const toast = useHealthAdminToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    id: '',
    t_ar: '',
    t_fr: '',
    t_en: '',
    d_ar: '',
    d_fr: '',
    d_en: '',
    raised_eur: '0',
    goal_eur: '1',
    donors: '0',
    theme: 'emerald',
    sort_order: '0',
    is_active: true,
  });
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch('/admin/donation-campaigns.php');
    if (!res.ok) {
      toast.error(res.errorMessage || 'Load failed');
      setItems([]);
    } else {
      setItems(extractItemsList(res.data));
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const openNew = () => {
    setForm({
      id: '',
      t_ar: '',
      t_fr: '',
      t_en: '',
      d_ar: '',
      d_fr: '',
      d_en: '',
      raised_eur: '0',
      goal_eur: '1',
      donors: '0',
      theme: 'emerald',
      sort_order: '0',
      is_active: true,
    });
    setModal(true);
  };

  const openEdit = (row) => {
    const tj = parseJsonObj(row.title_json);
    const dj = parseJsonObj(row.description_json);
    setForm({
      id: String(row.id || ''),
      t_ar: String(tj.ar || ''),
      t_fr: String(tj.fr || ''),
      t_en: String(tj.en || ''),
      d_ar: String(dj.ar || ''),
      d_fr: String(dj.fr || ''),
      d_en: String(dj.en || ''),
      raised_eur: String(row.raised_eur ?? '0'),
      goal_eur: String(row.goal_eur ?? '1'),
      donors: String(row.donors ?? '0'),
      theme: String(row.theme || 'emerald'),
      sort_order: String(row.sort_order ?? '0'),
      is_active: Boolean(Number(row.is_active ?? 1)),
    });
    setModal(true);
  };

  const save = async () => {
    if (!csrfToken || !form.id.trim()) {
      toast.error('Campaign id is required (short code, e.g. cmp-3).');
      return;
    }
    setBusy(true);
    const body = {
      id: form.id.trim(),
      title: { ar: form.t_ar, fr: form.t_fr, en: form.t_en },
      description: { ar: form.d_ar, fr: form.d_fr, en: form.d_en },
      raised_eur: Number(form.raised_eur || 0),
      goal_eur: Number(form.goal_eur || 1),
      donors: Number(form.donors || 0),
      theme: form.theme || 'emerald',
      sort_order: Number(form.sort_order || 0),
      is_active: form.is_active,
    };
    const res = await adminFetch('/admin/donation-campaigns.php', { method: 'POST', body, csrfToken });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.errorMessage || 'Save failed');
      return;
    }
    toast.success('Saved.');
    setModal(false);
    await load();
  };

  const remove = async () => {
    if (!del || !csrfToken) return;
    setBusy(true);
    const res = await adminFetch(`/admin/donation-campaigns.php?id=${encodeURIComponent(String(del.id))}`, { method: 'DELETE', csrfToken });
    setBusy(false);
    setDel(null);
    if (!res.ok) toast.error(res.errorMessage || 'Delete failed');
    else {
      toast.success('Deleted.');
      await load();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-2xl font-black text-slate-900">Donation campaigns</h1>
        <button type="button" onClick={openNew} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white">
          + Add
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-start px-4 py-2 font-bold">ID</th>
              <th className="text-start px-4 py-2 font-bold">Title (AR)</th>
              <th className="text-start px-4 py-2 font-bold">Goal €</th>
              <th className="text-end px-4 py-2 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : (
              items.map((row) => {
                const tj = parseJsonObj(row.title_json);
                return (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-mono text-xs">{row.id}</td>
                    <td className="px-4 py-2">{tj.ar || '—'}</td>
                    <td className="px-4 py-2">{row.goal_eur}</td>
                    <td className="px-4 py-2 text-end space-x-2">
                      <button type="button" className="text-emerald-700 font-bold" onClick={() => openEdit(row)}>
                        Edit
                      </button>
                      <button type="button" className="text-red-600 font-bold" onClick={() => setDel(row)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {modal ? (
        <AdminModal
          title="Campaign"
          onClose={() => !busy && setModal(false)}
          footer={
            <>
              <button type="button" className="rounded-xl border px-4 py-2 text-sm font-semibold" onClick={() => setModal(false)}>
                Cancel
              </button>
              <button type="button" disabled={busy} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white" onClick={() => void save()}>
                {busy ? '…' : 'Save'}
              </button>
            </>
          }
        >
          <div className="space-y-3 text-sm max-h-[70vh] overflow-y-auto">
            <label className="block">
              <span className="font-bold">Campaign id *</span>
              <input className="mt-1 w-full rounded-lg border px-2 py-1" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
            </label>
            <p className="text-xs text-slate-500">Titles and descriptions for Arabic, French, and English.</p>
            {['t_ar', 't_fr', 't_en'].map((k, i) => (
              <label key={k} className="block">
                <span className="font-bold">Title {['AR', 'FR', 'EN'][i]}</span>
                <input className="mt-1 w-full rounded-lg border px-2 py-1" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              </label>
            ))}
            {['d_ar', 'd_fr', 'd_en'].map((k, i) => (
              <label key={k} className="block">
                <span className="font-bold">Description {['AR', 'FR', 'EN'][i]}</span>
                <textarea className="mt-1 w-full rounded-lg border px-2 py-1" rows={2} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              </label>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="font-bold">Raised €</span>
                <input className="mt-1 w-full rounded-lg border px-2 py-1" value={form.raised_eur} onChange={(e) => setForm({ ...form, raised_eur: e.target.value })} />
              </label>
              <label className="block">
                <span className="font-bold">Goal €</span>
                <input className="mt-1 w-full rounded-lg border px-2 py-1" value={form.goal_eur} onChange={(e) => setForm({ ...form, goal_eur: e.target.value })} />
              </label>
              <label className="block">
                <span className="font-bold">Donors count</span>
                <input className="mt-1 w-full rounded-lg border px-2 py-1" value={form.donors} onChange={(e) => setForm({ ...form, donors: e.target.value })} />
              </label>
              <label className="block">
                <span className="font-bold">Theme</span>
                <input className="mt-1 w-full rounded-lg border px-2 py-1" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} />
              </label>
              <label className="block">
                <span className="font-bold">Sort</span>
                <input className="mt-1 w-full rounded-lg border px-2 py-1" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
              </label>
              <label className="flex items-center gap-2 mt-6">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                <span className="font-bold">Active</span>
              </label>
            </div>
          </div>
        </AdminModal>
      ) : null}

      <AdminConfirmDialog
        open={Boolean(del)}
        title="Delete campaign?"
        description="This removes the campaign row permanently."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        busy={busy}
        onClose={() => !busy && setDel(null)}
        onConfirm={() => void remove()}
      />
    </div>
  );
}
