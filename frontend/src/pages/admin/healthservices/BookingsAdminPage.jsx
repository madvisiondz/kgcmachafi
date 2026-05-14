import React, { useCallback, useEffect, useState } from 'react';
import { adminFetch, extractItemsList } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';

export default function BookingsAdminPage() {
  const { csrfToken } = useHealthAdminAuth();
  const toast = useHealthAdminToast();
  const [status, setStatus] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await adminFetch(`/admin/consultation-bookings.php${q}`);
    if (!res.ok) {
      toast.error(res.errorMessage || 'Load failed');
      setItems([]);
    } else setItems(extractItemsList(res.data));
    setLoading(false);
  }, [status, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const setBookingStatus = async (id, next) => {
    if (!csrfToken) return;
    const res = await adminFetch(`/admin/consultation-bookings.php?id=${id}`, {
      method: 'PATCH',
      body: { status: next },
      csrfToken,
    });
    if (!res.ok) toast.error(res.errorMessage || 'Update failed');
    else {
      toast.success('Status updated.');
      await load();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-black text-slate-900">Consultation bookings</h1>
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="cancelled">cancelled</option>
          <option value="done">done</option>
        </select>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-start px-3 py-2 font-bold">ID</th>
              <th className="text-start px-3 py-2 font-bold">Doctor</th>
              <th className="text-start px-3 py-2 font-bold">Status</th>
              <th className="text-start px-3 py-2 font-bold">Created</th>
              <th className="text-end px-3 py-2 font-bold">Set status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  Loading…
                </td>
              </tr>
            ) : (
              items.map((b) => (
                <tr key={b.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-mono text-xs">{b.id}</td>
                  <td className="px-3 py-2">{b.doctor_name || b.doctor_id}</td>
                  <td className="px-3 py-2 font-bold">{b.status}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">{b.created_at}</td>
                  <td className="px-3 py-2 text-end">
                    <select
                      className="rounded-lg border px-2 py-1 text-xs"
                      value={b.status}
                      onChange={(e) => void setBookingStatus(b.id, e.target.value)}
                    >
                      {['pending', 'confirmed', 'cancelled', 'done'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
