import React, { useCallback, useEffect, useState } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import { adminFetch, extractItemsList } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';
import AdminPagination from '../../../components/admin/healthservices/AdminPagination';
import AdminSearchBar from '../../../components/admin/healthservices/AdminSearchBar';
import * as ui from '../../../components/admin/healthservices/adminUiClasses';

export default function IntentsAdminPage() {
  const { t } = useI18n();
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
        <h1 className={ui.pageTitle}>{t('admin.hsvc.navIntents')}</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <AdminSearchBar value={qInput} onChange={setQInput} placeholder={t('admin.hsvc.uiSearchPlaceholder')} />
          <button
            type="button"
            className={ui.btnSecondary}
            onClick={() => {
              setAppliedQ(qInput);
              setOffset(0);
            }}
          >
            Search
          </button>
        </div>
      </div>
      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead className={ui.tableHead}>
            <tr>
              <th className={ui.tableTh}>ID</th>
              <th className={ui.tableTh}>Donor</th>
              <th className={ui.tableTh}>Campaign</th>
              <th className={ui.tableTh}>Amount</th>
              <th className={ui.tableTh}>Status</th>
              <th className={ui.tableTh}>Admin</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className={ui.loadingState}>
                  {t('admin.hsvc.uiLoading')}
                </td>
              </tr>
            ) : (
              items.map((r) => (
                <tr key={r.id} className={ui.tableRow}>
                  <td className={`${ui.tableTd} font-mono text-xs text-slate-300`}>{r.id}</td>
                  <td className={ui.tableTd}>
                    <div className="font-semibold text-white">{r.donor_name || '—'}</div>
                    <div className={ui.mutedXs}>{r.donor_email || ''}</div>
                  </td>
                  <td className={ui.tableTd}>{r.campaign_id}</td>
                  <td className={ui.tableTd}>
                    {r.amount} {r.currency}
                  </td>
                  <td className={ui.tableTd}>
                    <select
                      className={`${ui.select} !py-1 !text-xs max-w-[140px]`}
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
                  <td className={`${ui.tableTd} max-w-xs`}>
                    <textarea
                      rows={2}
                      className={`${ui.textarea} !min-h-0 !text-xs`}
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
        <div className={ui.paginationBar}>
          <AdminPagination page={page} pageSize={limit} total={total} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

