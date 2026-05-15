import React, { useCallback, useEffect, useState } from 'react';
import { adminFetch, extractItemsList } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';
import AdminModal from '../../../components/admin/healthservices/AdminModal';
import AdminConfirmDialog from '../../../components/admin/healthservices/AdminConfirmDialog';
import * as ui from '../../../components/admin/healthservices/adminUiClasses';

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
        <h1 className={ui.pageTitle}>Donation campaigns</h1>
        <button type="button" onClick={openNew} className={ui.btnPrimary}>
          + Add
        </button>
      </div>
      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead className={ui.tableHead}>
            <tr>
              <th className={ui.tableTh}>ID</th>
              <th className={ui.tableTh}>Title (AR)</th>
              <th className={ui.tableTh}>Goal €</th>
              <th className={`${ui.tableTh} text-end`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className={ui.loadingState}>
                  Loading…
                </td>
              </tr>
            ) : (
              items.map((row) => {
                const tj = parseJsonObj(row.title_json);
                return (
                  <tr key={row.id} className={ui.tableRow}>
                    <td className={`${ui.tableTd} font-mono text-xs text-slate-300`}>{row.id}</td>
                    <td className={ui.tableTd}>{tj.ar || '—'}</td>
                    <td className={ui.tableTd}>{row.goal_eur}</td>
                    <td className={`${ui.tableTd} text-end space-x-2`}>
                      <button type="button" className={ui.linkAction} onClick={() => openEdit(row)}>
                        Edit
                      </button>
                      <button type="button" className={ui.linkDanger} onClick={() => setDel(row)}>
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
              <button type="button" className={ui.btnGhost} onClick={() => setModal(false)}>
                Cancel
              </button>
              <button type="button" disabled={busy} className={ui.btnPrimary} onClick={() => void save()}>
                {busy ? '…' : 'Save'}
              </button>
            </>
          }
        >
          <div className="space-y-3 text-sm max-h-[70vh] overflow-y-auto">
            <label className="block space-y-1">
              <span className={ui.fieldLabel}>Campaign id *</span>
              <input className={ui.input} value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
            </label>
            <p className={ui.fieldHelper}>Titles and descriptions for Arabic, French, and English.</p>
            {['t_ar', 't_fr', 't_en'].map((k, i) => (
              <label key={k} className="block space-y-1">
                <span className={ui.fieldLabel}>Title {['AR', 'FR', 'EN'][i]}</span>
                <input className={ui.input} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              </label>
            ))}
            {['d_ar', 'd_fr', 'd_en'].map((k, i) => (
              <label key={k} className="block space-y-1">
                <span className={ui.fieldLabel}>Description {['AR', 'FR', 'EN'][i]}</span>
                <textarea className={ui.textarea} rows={2} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              </label>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <label className="block space-y-1">
                <span className={ui.fieldLabel}>Raised €</span>
                <input className={ui.input} value={form.raised_eur} onChange={(e) => setForm({ ...form, raised_eur: e.target.value })} />
              </label>
              <label className="block space-y-1">
                <span className={ui.fieldLabel}>Goal €</span>
                <input className={ui.input} value={form.goal_eur} onChange={(e) => setForm({ ...form, goal_eur: e.target.value })} />
              </label>
              <label className="block space-y-1">
                <span className={ui.fieldLabel}>Donors count</span>
                <input className={ui.input} value={form.donors} onChange={(e) => setForm({ ...form, donors: e.target.value })} />
              </label>
              <label className="block space-y-1">
                <span className={ui.fieldLabel}>Theme</span>
                <input className={ui.input} value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} />
              </label>
              <label className="block space-y-1">
                <span className={ui.fieldLabel}>Sort</span>
                <input className={ui.input} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
              </label>
              <label className="flex items-center gap-2 mt-6 text-slate-100">
                <input type="checkbox" className="h-4 w-4 rounded border-emerald-500/40 bg-slate-900 text-emerald-500" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                <span className={ui.fieldLabel}>Active</span>
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
