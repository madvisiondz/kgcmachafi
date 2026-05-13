import React from 'react'
import { useI18n } from '../i18n/I18nProvider'

export default function ListFetchErrorBanner({ message, onRetry }) {
  const { t, dir } = useI18n()
  return (
    <div
      className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-950 shadow-sm"
      dir={dir}
      role="alert"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-extrabold">{t('common.listErrorTitle')}</div>
          <div className="text-xs mt-1 text-rose-900/90 leading-relaxed">
            {message || t('common.listErrorDesc')}
          </div>
        </div>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-xl bg-rose-700 px-4 py-2 text-xs font-black text-white hover:bg-rose-800 transition-colors shrink-0"
          >
            {t('common.listRetry')}
          </button>
        ) : null}
      </div>
    </div>
  )
}
