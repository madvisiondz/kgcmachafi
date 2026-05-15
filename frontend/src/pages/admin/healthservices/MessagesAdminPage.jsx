import React, { useCallback, useEffect, useState } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import { adminFetch, extractItemsList } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';
import AdminConfirmDialog from '../../../components/admin/healthservices/AdminConfirmDialog';
import * as ui from '../../../components/admin/healthservices/adminUiClasses';

export default function MessagesAdminPage() {
  const { t } = useI18n();
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
      <h1 className={ui.pageTitle}>{t('admin.hsvc.navMessages')}</h1>
      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead className={ui.tableHead}>
            <tr>
              <th className={ui.tableTh}>From</th>
              <th className={ui.tableTh}>Subject</th>
              <th className={ui.tableTh}>Date</th>
              <th className={`${ui.tableTh} text-end`}>{t('admin.hsvc.uiActions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className={ui.loadingState}>
                  {t('admin.hsvc.uiLoading')}
                </td>
              </tr>
            ) : (
              items.map((m) => (
                <tr key={m.id} className={ui.tableRow}>
                  <td className={ui.tableTd}>
                    <div className="font-semibold text-white">{m.name}</div>
                    <div className={ui.mutedXs}>{m.email}</div>
                  </td>
                  <td className={`${ui.tableTd} max-w-xs`}>
                    <div className="font-semibold text-slate-100">{m.subject}</div>
                    <div className={`${ui.mutedXs} line-clamp-2`}>{m.message}</div>
                  </td>
                  <td className={`${ui.tableTd} whitespace-nowrap ${ui.mutedXs}`}>{m.created_at}</td>
                  <td className={`${ui.tableTd} text-end space-x-2 whitespace-nowrap`}>
                    <button type="button" className={ui.linkAction} onClick={() => void patchRead(m, true)}>
                      Read
                    </button>
                    <button type="button" className={ui.link} onClick={() => void patchRead(m, false)}>
                      Unread
                    </button>
                    <button type="button" className={ui.linkDanger} onClick={() => setDel(m)}>
                      {t('admin.hsvc.uiDelete')}
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
        title={t('admin.hsvc.uiDeleteTitle')}
        description={t('admin.hsvc.uiDeleteDesc')}
        confirmLabel={t('admin.hsvc.uiDeleteConfirm')}
        cancelLabel={t('admin.hsvc.uiCancel')}
        danger
        busy={busy}
        onClose={() => !busy && setDel(null)}
        onConfirm={() => void remove()}
      />
    </div>
  );
}
