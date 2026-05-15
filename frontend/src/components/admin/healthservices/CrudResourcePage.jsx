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

/** @typedef {{ key: string, label: string, type?: string, required?: boolean, helper?: string, options?: { value: string, label: string }[], jsonTarget?: string }} FieldSpec */

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
    toast.success('Deleted.');
    await load();
  };

  const renderFieldInput = (f) => {
    const val = form[f.key];
    if (f.type === 'textarea' || f.type === 'json') {
      return (
        <textarea
          className="w-full min-h-[100px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          value={String(val ?? '')}
          onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
        />
      );
    }
    if (f.type === 'checkbox') {
      return (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-emerald-600"
          checked={Boolean(val)}
          onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.checked }))}
        />
      );
    }
    if (f.type === 'number') {
      return (
        <input
          type="number"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          value={val === '' ? '' : val}
          onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
        />
      );
    }
    if (f.type === 'date') {
      return (
        <input
          type="date"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          value={String(val ?? '').slice(0, 10)}
          onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
        />
      );
    }
    if (f.type === 'select' && f.options) {
      return (
        <select
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        value={String(val ?? '')}
        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">{title}</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <AdminSearchBar value={search} onChange={setSearch} placeholder="Search…" />
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-emerald-700"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="text-start font-bold px-4 py-3 whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
                <th className="text-end font-bold px-4 py-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-slate-500">
                    No rows yet. Use “Add” to create the first entry.
                  </td>
                </tr>
              ) : (
                pageItems.map((row) => {
                  const r = /** @type {Record<string, unknown>} */ (row);
                  return (
                    <tr key={String(r[idKey])} className="border-t border-slate-100 hover:bg-slate-50/80">
                      {columns.map((c) => (
                        <td key={c.key} className="px-4 py-2 align-top max-w-[220px] truncate" title={String(r[c.key] ?? '')}>
                          {String(r[c.key] ?? '')}
                        </td>
                      ))}
                      <td className="px-4 py-2 text-end whitespace-nowrap space-x-2">
                        <button type="button" className="text-emerald-700 font-bold hover:underline" onClick={() => openEdit(row)}>
                          Edit
                        </button>
                        {canDelete ? (
                          <button type="button" className="text-red-600 font-bold hover:underline" onClick={() => setDeleteTarget(row)}>
                            Delete
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
        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/60">
          <AdminPagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      </div>

      {modalOpen ? (
        <AdminModal
          title={editing ? `Edit` : `Add — ${title}`}
          onClose={closeModal}
          footer={
            <>
              <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void save()}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            {fields.map((f) => (
              <AdminField key={f.key} label={f.label} required={f.required} helper={f.helper} error={formErrors[f.key]}>
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
