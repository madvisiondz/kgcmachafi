import React, { useCallback, useEffect, useState } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import { adminFetch, extractItemsList } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';
import * as ui from '../../../components/admin/healthservices/adminUiClasses';

export default function BookingsAdminPage() {
  const { t } = useI18n();
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
        <h1 className={ui.pageTitle}>{t('admin.hsvc.navBookings')}</h1>
        <select className={`${ui.select} max-w-xs`} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="cancelled">cancelled</option>
          <option value="done">done</option>
        </select>
      </div>
      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead className={ui.tableHead}>
            <tr>
              <th className={ui.tableTh}>ID</th>
              <th className={ui.tableTh}>Doctor</th>
              <th className={ui.tableTh}>Status</th>
              <th className={ui.tableTh}>Created</th>
              <th className={`${ui.tableTh} text-end`}>Set status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className={ui.loadingState}>
                  {t('admin.hsvc.uiLoading')}
                </td>
              </tr>
            ) : (
              items.map((b) => (
                <tr key={b.id} className={ui.tableRow}>
                  <td className={`${ui.tableTd} font-mono text-xs text-slate-300`}>{b.id}</td>
                  <td className={ui.tableTd}>{b.doctor_name || b.doctor_id}</td>
                  <td className={`${ui.tableTd} font-bold text-emerald-200`}>{b.status}</td>
                  <td className={`${ui.tableTd} ${ui.mutedXs}`}>{b.created_at}</td>
                  <td className={`${ui.tableTd} text-end`}>
                    <select
                      className={`${ui.select} !py-1 !text-xs max-w-[140px]`}
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
