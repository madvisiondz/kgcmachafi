import React, { useRef, useState } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import { uploadAdminFile } from '../../../services/admin/healthAdminApi';
import { btnGhost, btnPrimary, fieldHelper, input } from './adminUiClasses';

/**
 * @param {{
 *   value: string,
 *   onChange: (url: string) => void,
 *   csrfToken: string | null,
 *   category: string,
 *   kind?: 'image' | 'pdf',
 *   disabled?: boolean,
 * }} props
 */
export default function AdminUploadField({ value, onChange, csrfToken, category, kind = 'image', disabled }) {
  const { t } = useI18n();
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const accept = kind === 'pdf' ? '.pdf,application/pdf' : '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';
  const helper = kind === 'pdf' ? t('admin.hsvc.uploadPdfHelp') : t('admin.hsvc.uploadImageHelp');

  const pick = () => inputRef.current?.click();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !csrfToken) return;
    setBusy(true);
    setErr('');
    const res = await uploadAdminFile(file, { category, kind, csrfToken });
    setBusy(false);
    if (!res.ok) {
      setErr(res.errorMessage || t('admin.hsvc.uploadFailed'));
      return;
    }
    const d = res.data && typeof res.data === 'object' ? res.data : {};
    const url = typeof d.url === 'string' ? d.url : typeof d.path === 'string' ? d.path : '';
    if (url) onChange(url);
    else setErr(t('admin.hsvc.uploadFailed'));
  };

  const copyUrl = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => void onFile(e)}
        disabled={disabled || busy}
      />
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btnPrimary} disabled={disabled || busy || !csrfToken} onClick={pick}>
          {busy ? t('admin.hsvc.uploading') : kind === 'pdf' ? t('admin.hsvc.uploadPdf') : t('admin.hsvc.uploadImage')}
        </button>
        {value ? (
          <>
            <button type="button" className={btnGhost} onClick={() => void copyUrl()}>
              {t('admin.hsvc.copyUrl')}
            </button>
            <button type="button" className={btnGhost} onClick={() => onChange('')} disabled={disabled || busy}>
              {t('admin.hsvc.removeFile')}
            </button>
          </>
        ) : null}
      </div>
      <input
        type="text"
        className={input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('admin.hsvc.uploadUrlPlaceholder')}
        disabled={disabled || busy}
      />
      <p className={fieldHelper}>{helper}</p>
      {err ? <p className="text-xs text-red-400 font-medium">{err}</p> : null}
      {kind === 'image' && value ? (
        <div className="mt-2 overflow-hidden rounded-xl border border-emerald-500/20 bg-slate-900/50">
          <img src={value} alt="" className="max-h-40 w-full object-contain p-2" loading="lazy" />
        </div>
      ) : null}
      {kind === 'pdf' && value ? (
        <p className="text-xs text-emerald-400/90 truncate" title={value}>
          {value}
        </p>
      ) : null}
    </div>
  );
}
