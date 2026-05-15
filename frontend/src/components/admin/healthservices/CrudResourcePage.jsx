import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { adminFetch, extractItemsList } from '../../../services/admin/healthAdminApi';
import { useI18n } from '../../../i18n/I18nProvider';
import { useHealthAdminAuth } from '../../../pages/admin/healthservices/HealthAdminAuthContext';
import { useHealthAdminToast } from '../../../pages/admin/healthservices/HealthAdminToastContext';
import AdminModal from './AdminModal';
import AdminConfirmDialog from './AdminConfirmDialog';
import AdminSearchBar from './AdminSearchBar';
import AdminPagination from './AdminPagination';
import AdminField from './AdminField';
import AdminUploadField from './AdminUploadField';
import AdminStatusBadge from './AdminStatusBadge';
import * as ui from './adminUiClasses';

/** @typedef {{ key: string, label: string, labelKey?: string, type?: string, required?: boolean, helper?: string, helperKey?: string, options?: { value: string, label: string }[], jsonTarget?: string, uploadCategory?: string, uploadKind?: 'image' | 'pdf' }} FieldSpec */

function emptyForm(fields) {
  const o = {};
  for (const f of fields) {
    if (f.type === 'checkbox') o[f.key] = false;
    else o[f.key] = '';
  }
  return o;
}

function rowToForm(row, fields) {
  const o = { ...emptyForm(fields) };
  for (const f of fields) {
    if (!(f.key in row)) continue;
    const v = row[f.key];
    if (f.type === 'checkbox') o[f.key] = Boolean(Number(v));
    else if ((f.type === 'textarea' || f.type === 'text') && Array.isArray(v)) {
      o[f.key] = v.join('\n');
    } else if (f.type === 'json') {
      if (v && (typeof v === 'object' || Array.isArray(v))) o[f.key] = JSON.stringify(v, null, 2);
      else o[f.key] = typeof v === 'string' ? v : '';
    } else if (v === null || v === undefined) o[f.key] = '';
    else o[f.key] = String(v);
  }
  return o;
}

/**
 * @param {Record<string, unknown>} form
 * @param {FieldSpec[]} fields
 * @param {(form: Record<string, unknown>) => Record<string, unknown>} [buildSaveBody]
 */
function buildBody(form, fields, buildSaveBody) {
  if (buildSaveBody) return buildSaveBody(form);
  const body = {};
  for (const f of fields) {
    const raw = form[f.key];
    if (f.type === 'checkbox') {
      body[f.key] = Boolean(raw);
      continue;
    }
    if (f.type === 'number') {
      body[f.key] = raw === '' ? 0 : Number(raw);
      continue;
    }
    if (f.type === 'json') {
      const target = f.jsonTarget || 'payload';
      try {
        const parsed = raw === '' ? {} : JSON.parse(String(raw));
        body[target] = parsed;
      } catch {
        throw new Error(`Invalid JSON for ${f.label}`);
      }
      continue;
    }
    body[f.key] = raw === '' ? '' : String(raw);
  }
  return body;
}

/**
 * @param {{
 *   title: string,
 *   titleKey?: string,
 *   apiPath: string,
 *   idKey?: string,
 *   columns: { key: string, label: string }[],
 *   fields: FieldSpec[],
 *   mutator?: 'rest' | 'postPut' | 'postUpsert',
 *   canDelete?: boolean,
 *   searchKeys?: string[],
 *   buildSaveBody?: (form: Record<string, unknown>) => Record<string, unknown>,
 *   pageSize?: number,
 * }} props
 */
export default function CrudResourcePage({
  title,
  titleKey,
  apiPath,
  idKey = 'id',
  columns,
  fields,
  mutator = 'rest',
  canDelete = true,
  searchKeys,
  buildSaveBody,
  pageSize = 15,
}) {
  const { t } = useI18n();
  const displayTitle = titleKey ? t(titleKey) : title;
  const { csrfToken, refreshSession } = useHealthAdminAuth();
  const toast = useHealthAdminToast();
  const [items, setItems] = useState(/** @type {unknown[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(/** @type {Record<string, unknown> | null} */ (null));
  const [form, setForm] = useState(() => emptyForm(fields));
  const [formErrors, setFormErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(/** @type {unknown} */ (null));
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch(apiPath, { csrfToken: null });
    if (res.response.status === 401) {
      await refreshSession();
      toast.error(t('admin.hsvc.sessionExpired'));
      setItems([]);
      setLoading(false);
      return;
    }
    if (!res.ok) {
      toast.error(res.errorMessage || t('admin.hsvc.uiLoadError'));
      setItems([]);
      setLoading(false);
      return;
    }
    setItems(extractItemsList(res.data));
    setLoading(false);
  }, [apiPath, refreshSession, toast, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const keys = searchKeys && searchKeys.length ? searchKeys : columns.map((c) => c.key);
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((row) => {
      if (!row || typeof row !== 'object') return false;
      const r = /** @type {Record<string, unknown>} */ (row);
      return keys.some((k) => String(r[k] ?? '').toLowerCase().includes(q));
    });
  }, [items, search, searchKeys, columns]);

  const total = filtered.length;
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(fields));
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm(rowToForm(/** @type {Record<string, unknown>} */ (row), fields));
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const validate = () => {
    const err = {};
    for (const f of fields) {
      if (!f.required) continue;
      const v = form[f.key];
      if (f.type === 'checkbox') continue;
      if (v === '' || v === null || v === undefined) err[f.key] = t('admin.hsvc.fieldRequired');
    }
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const save = async () => {
    if (!csrfToken) {
      toast.error(t('admin.hsvc.uiMissingCsrf'));
      return;
    }
    if (!validate()) return;
    let body;
    try {
      body = buildBody(form, fields, buildSaveBody);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Validation error');
      return;
    }
    setSaving(true);
    const isNew = !editing || !editing[idKey];
    let path = apiPath;
    let method = 'POST';
    if (mutator === 'rest') {
      if (!isNew) {
        method = 'PUT';
        const id = encodeURIComponent(String(editing[idKey]));
        path = `${apiPath}?id=${id}`;
      }
    } else if (mutator === 'postPut') {
      if (!isNew) {
        const id = encodeURIComponent(String(editing[idKey]));
        path = `${apiPath}?id=${id}`;
        body = { _method: 'PUT', ...body };
      }
      method = 'POST';
    } else if (mutator === 'postUpsert') {
      method = 'POST';
      path = apiPath;
    }
    const res = await adminFetch(path, { method, body, csrfToken });
    setSaving(false);
    if (res.response.status === 401 || res.response.status === 419) {
      toast.error(t('admin.hsvc.uiSessionGuard'));
      await refreshSession();
      return;
    }
    if (!res.ok) {
      toast.error(res.errorMessage || t('admin.hsvc.uiSaveFailed'));
      return;
    }
    toast.success(isNew ? t('admin.hsvc.uiAdded') : t('admin.hsvc.uiSaved'));
    setModalOpen(false);
    await load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !csrfToken) return;
    const id = deleteTarget[idKey];
    setDeleting(true);
    const path = `${apiPath}?id=${encodeURIComponent(String(id))}`;
    const res = await adminFetch(path, { method: 'DELETE', csrfToken });
    setDeleting(false);
    setDeleteTarget(null);
    if (!res.ok) {
      toast.error(res.errorMessage || t('admin.hsvc.uiDeleteFailed'));
      return;
    }
    toast.success(t('admin.hsvc.uiDeleted'));
    await load();
  };

  const fieldLabel = (f) => (f.labelKey ? t(f.labelKey) : f.label);
  const fieldHelper = (f) => (f.helperKey ? t(f.helperKey) : f.helper);

  const renderFieldInput = (f) => {
    const val = form[f.key];
    if (f.type === 'upload' || f.type === 'uploadPdf') {
      return (
        <AdminUploadField
          value={String(val ?? '')}
          onChange={(url) => setForm((p) => ({ ...p, [f.key]: url }))}
          csrfToken={csrfToken}
          category={f.uploadCategory || 'general'}
          kind={f.type === 'uploadPdf' || f.uploadKind === 'pdf' ? 'pdf' : 'image'}
        />
      );
    }
    if (f.type === 'textarea' || f.type === 'json') {
      return (
        <textarea
          className={ui.textarea}
          value={String(val ?? '')}
          onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
        />
      );
    }
    if (f.type === 'checkbox') {
      return (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-emerald-500/40 bg-slate-900 text-emerald-500"
          checked={Boolean(val)}
          onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.checked }))}
        />
      );
    }
    if (f.type === 'number') {
      return (
        <input
          type="number"
          className={ui.input}
          value={val === '' ? '' : val}
          onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
        />
      );
    }
    if (f.type === 'date') {
      return (
        <input
          type="date"
          className={ui.input}
          value={String(val ?? '').slice(0, 10)}
          onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
        />
      );
    }
    if (f.type === 'select' && f.options) {
      return (
        <select
          className={ui.select}
          value={String(val ?? '')}
          onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
        >
          <option value="">—</option>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type="text"
        className={ui.input}
        value={String(val ?? '')}
        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
      />
    );
  };

  const cellValue = (r, c) => {
    const v = r[c.key];
    if (c.key === 'is_active' || c.key === 'is_archived' || c.key === 'is_read') {
      const on = Boolean(Number(v));
      return (
        <AdminStatusBadge variant={on ? 'success' : 'neutral'}>
          {on ? t('admin.hsvc.statusActive') : t('admin.hsvc.statusInactive')}
        </AdminStatusBadge>
      );
    }
    return String(v ?? '');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={ui.pageTitle}>{displayTitle}</h1>
          <p className={ui.pageSub}>{t('admin.hsvc.crudIntro')}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <AdminSearchBar value={search} onChange={setSearch} placeholder={t('admin.hsvc.uiSearchPlaceholder')} />
          <button type="button" onClick={openCreate} className={ui.btnPrimary}>
            + {t('admin.hsvc.uiAdd')}
          </button>
        </div>
      </div>

      <div className={ui.tableWrap}>
        <div className="overflow-x-auto hsvc-table-scroll hidden md:block">
          <table className="min-w-full text-sm">
            <thead className={ui.tableHead}>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={ui.tableTh}>
                    {c.label}
                  </th>
                ))}
                <th className={`${ui.tableTh} text-end`}>{t('admin.hsvc.uiActions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className={ui.loadingState}>
                    {t('admin.hsvc.uiLoading')}
                  </td>
                </tr>
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className={ui.emptyState}>
                    {t('admin.hsvc.uiEmptyRows')}
                  </td>
                </tr>
              ) : (
                pageItems.map((row) => {
                  const r = /** @type {Record<string, unknown>} */ (row);
                  return (
                    <tr key={String(r[idKey])} className={ui.tableRow}>
                      {columns.map((c) => (
                        <td key={c.key} className={`${ui.tableTd} max-w-[220px] truncate`} title={String(r[c.key] ?? '')}>
                          {cellValue(r, c)}
                        </td>
                      ))}
                      <td className={`${ui.tableTd} text-end whitespace-nowrap`}>
                        <button type="button" className="text-emerald-400 font-bold hover:text-emerald-300 me-3" onClick={() => openEdit(row)}>
                          {t('admin.hsvc.uiEdit')}
                        </button>
                        {canDelete ? (
                          <button type="button" className="text-red-400 font-bold hover:text-red-300" onClick={() => setDeleteTarget(row)}>
                            {t('admin.hsvc.uiDelete')}
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className={ui.paginationBar}>
          <AdminPagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>

        <div className="md:hidden space-y-3 p-3">
          {loading ? <p className={ui.loadingState}>{t('admin.hsvc.uiLoading')}</p> : null}
          {!loading && pageItems.length === 0 ? <p className={ui.emptyState}>{t('admin.hsvc.uiEmptyRows')}</p> : null}
          {!loading
            ? pageItems.map((row) => {
                const r = /** @type {Record<string, unknown>} */ (row);
                return (
                  <div key={String(r[idKey])} className={`${ui.glassCard} p-4 space-y-2`}>
                    {columns.slice(0, 4).map((c) => (
                      <p key={c.key} className="text-sm">
                        <span className="text-slate-400">{c.label}: </span>
                        <span className="text-slate-100">{cellValue(r, c)}</span>
                      </p>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <button type="button" className={ui.btnGhost} onClick={() => openEdit(row)}>
                        {t('admin.hsvc.uiEdit')}
                      </button>
                      {canDelete ? (
                        <button type="button" className={ui.btnDanger} onClick={() => setDeleteTarget(row)}>
                          {t('admin.hsvc.uiDelete')}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>

      {modalOpen ? (
        <AdminModal
          title={editing ? t('admin.hsvc.uiModalEdit') : `${t('admin.hsvc.uiModalAdd')} — ${displayTitle}`}
          onClose={closeModal}
          footer={
            <>
              <button type="button" className={ui.btnGhost} onClick={closeModal}>
                {t('admin.hsvc.uiCancel')}
              </button>
              <button type="button" disabled={saving} onClick={() => void save()} className={ui.btnPrimary}>
                {saving ? t('admin.hsvc.uiSaving') : t('admin.hsvc.uiSave')}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            {fields.map((f) => (
              <AdminField key={f.key} label={fieldLabel(f)} required={f.required} helper={fieldHelper(f)} error={formErrors[f.key]}>
                {renderFieldInput(f)}
              </AdminField>
            ))}
          </div>
        </AdminModal>
      ) : null}

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title={t('admin.hsvc.uiDeleteTitle')}
        description={t('admin.hsvc.uiDeleteDesc')}
        confirmLabel={t('admin.hsvc.uiDeleteConfirm')}
        cancelLabel={t('admin.hsvc.uiCancel')}
        danger
        busy={deleting}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
