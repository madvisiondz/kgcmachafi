import React, { useCallback, useEffect, useState } from 'react';
import { adminFetch, extractItemsList } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';
import AdminPagination from '../../../components/admin/healthservices/AdminPagination';
import AdminSearchBar from '../../../components/admin/healthservices/AdminSearchBar';

export default function IntentsAdminPage() {
  const { csrfToken } = useHealthAdminAuth();
  const toast = useHealthAdminToast();
  const [qInput, setQInput] = useState('');
  const [appliedQ, setAppliedQ] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 25;
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (appliedQ.trim()) params.set('q', appliedQ.trim());
    const res = await adminFetch(`/admin/donation-intents.php?${params.toString()}`);
    if (!res.ok) {
      toast.error(res.errorMessage || 'Load failed');
      setItems([]);
      setTotal(0);
    } else {
      const d = res.data && typeof res.data === 'object' ? res.data : {};
      setItems(extractItemsList(d));
      const p = d.pagination && typeof d.pagination === 'object' ? d.pagination : {};
      setTotal(Number(p.total ?? 0));
    }
    setLoading(false);
  }, [offset, appliedQ, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = async (row, body) => {
    if (!csrfToken) return;
    const res = await adminFetch(`/admin/donation-intents.php?id=${row.id}`, { method: 'PATCH', body, csrfToken });
    if (!res.ok) toast.error(res.errorMessage || 'Update failed');
    else {
      toast.success('Updated.');
      await load();
    }
  };

  const page = Math.floor(offset / limit) + 1;
  const setPage = (p) => setOffset((p - 1) * limit);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <h1 className="text-2xl font-black text-slate-900">Donation intents</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <AdminSearchBar value={qInput} onChange={setQInput} placeholder="Search name, email, id…" />
          <button
            type="button"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
            onClick={() => {
              setAppliedQ(qInput);
              setOffset(0);
            }}
          >
            Search
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-start px-3 py-2 font-bold">ID</th>
              <th className="text-start px-3 py-2 font-bold">Donor</th>
              <th className="text-start px-3 py-2 font-bold">Campaign</th>
              <th className="text-start px-3 py-2 font-bold">Amount</th>
              <th className="text-start px-3 py-2 font-bold">Status</th>
              <th className="text-start px-3 py-2 font-bold">Admin</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  Loading…
                </td>
              </tr>
            ) : (
              items.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2">
                    <div className="font-semibold">{r.donor_name || '—'}</div>
                    <div className="text-xs text-slate-500">{r.donor_email || ''}</div>
                  </td>
                  <td className="px-3 py-2">{r.campaign_id}</td>
                  <td className="px-3 py-2">
                    {r.amount} {r.currency}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="rounded-lg border px-2 py-1 text-xs max-w-[140px]"
                      value={r.status || 'new'}
                      onChange={(e) => void patch(r, { status: e.target.value })}
                    >
                      {['new', 'contacted', 'completed', 'cancelled'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 max-w-xs">
                    <textarea
                      rows={2}
                      className="w-full rounded-lg border px-2 py-1 text-xs"
                      defaultValue={r.admin_note || ''}
                      onBlur={(e) => {
                        const next = e.target.value.trim();
                        const prev = (r.admin_note || '').trim();
                        if (next === prev) return;
                        void patch(r, { admin_note: next });
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="border-t border-slate-100 px-3 py-2 bg-slate-50">
          <AdminPagination page={page} pageSize={limit} total={total} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
