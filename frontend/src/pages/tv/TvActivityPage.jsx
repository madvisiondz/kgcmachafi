import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { useTvEdition } from '../../tv/useTvEdition';
import { tvWireActivity, pick } from '../../data/tvMock';
import { tvEditionPath } from '../../routes/paths';

export default function TvActivityPage() {
  const edition = useTvEdition();
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-10 md:py-14 max-w-4xl">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t('tvApp.navActivity')}
          </span>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            {t('tvApp.activityTitle')}
          </h1>
          <p className="mt-3 text-[15px] md:text-base text-slate-600 leading-relaxed max-w-2xl">
            {t('tvApp.activitySub')}
          </p>
        </div>
        <Link
          to={tvEditionPath(edition, '/desk')}
          className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
        >
          {t('tvApp.navDesk')}
          <span aria-hidden="true" className="rtl:rotate-180">→</span>
        </Link>
      </header>

      <ul className="mt-10 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]">
        {tvWireActivity.map((line) => {
          const label = pick(line.label, edition);
          const body = pick(line.body, edition);
          return (
            <li
              key={line.id}
              className={`relative border-b border-slate-100 last:border-0 px-5 py-4 transition-colors hover:bg-slate-50/70 ${
                line.urgent ? 'bg-red-50/40' : ''
              }`}
            >
              {line.urgent ? (
                <span
                  className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-red-500"
                  aria-hidden="true"
                />
              ) : null}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-5">
                <div className="flex items-baseline gap-3 sm:w-36 shrink-0">
                  <time className="font-mono text-[12px] text-slate-500 tabular-nums">
                    {line.time}
                  </time>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      line.urgent ? 'text-red-700' : 'text-slate-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                <p className="mt-2 sm:mt-0 text-[14px] md:text-[15px] font-medium text-slate-900 leading-snug">
                  {body}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs text-slate-500 leading-relaxed">
        {t('tvApp.footerNote')}
      </p>
    </div>
  );
}
