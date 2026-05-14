import React, { useCallback, useEffect, useState } from 'react';
import { adminFetch, extractItemsList } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';
import AdminConfirmDialog from '../../../components/admin/healthservices/AdminConfirmDialog';

export default function MessagesAdminPage() {
  const { csrfToken } = useHealthAdminAuth();
  const toast = useHealthAdminToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch('/admin/contact-messages.php?limit=300');
    if (!res.ok) {
      toast.error(res.errorMessage || 'Load failed');
      setItems([]);
    } else setItems(extractItemsList(res.data));
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const patchRead = async (row, isRead) => {
    if (!csrfToken) return;
    const res = await adminFetch(`/admin/contact-messages.php?id=${row.id}`, {
      method: 'PATCH',
      body: { is_read: isRead },
      csrfToken,
    });
    if (!res.ok) toast.error(res.errorMessage || 'Update failed');
    else {
      toast.success('Updated.');
      await load();
    }
  };

  const remove = async () => {
    if (!del || !csrfToken) return;
    setBusy(true);
    const res = await adminFetch(`/admin/contact-messages.php?id=${del.id}`, { method: 'DELETE', csrfToken });
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
      <h1 className="text-2xl font-black text-slate-900">Contact messages</h1>
      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-start px-3 py-2 font-bold">From</th>
              <th className="text-start px-3 py-2 font-bold">Subject</th>
              <th className="text-start px-3 py-2 font-bold">Date</th>
              <th className="text-end px-3 py-2 font-bold">Actions</th>
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
              items.map((m) => (
                <tr key={m.id} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-2">
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.email}</div>
                  </td>
                  <td className="px-3 py-2 max-w-xs">
                    <div className="font-semibold">{m.subject}</div>
                    <div className="text-xs text-slate-600 line-clamp-2">{m.message}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-500">{m.created_at}</td>
                  <td className="px-3 py-2 text-end space-x-2 whitespace-nowrap">
                    <button type="button" className="text-emerald-700 font-bold" onClick={() => void patchRead(m, true)}>
                      Read
                    </button>
                    <button type="button" className="text-slate-600 font-bold" onClick={() => void patchRead(m, false)}>
                      Unread
                    </button>
                    <button type="button" className="text-red-600 font-bold" onClick={() => setDel(m)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AdminConfirmDialog
        open={Boolean(del)}
        title="Delete message?"
        description="Permanently removes this contact message."
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
