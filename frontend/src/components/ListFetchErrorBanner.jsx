import React from 'react'
import { useI18n } from '../i18n/I18nProvider'

export default function ListFetchErrorBanner({ message, onRetry }) {
  const { t, dir } = useI18n()
  return (
    <div
      className="rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-4 text-rose-950 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]"
      dir={dir}
      role="alert"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-rose-950">{t('common.listErrorTitle')}</div>
          <div className="mt-1 text-xs text-rose-900/85 leading-relaxed">
            {message || t('common.listErrorDesc')}
          </div>
        </div>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-rose-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
          >
            {t('common.listRetry')}
          </button>
        ) : null}
      </div>
    </div>
  )
}
