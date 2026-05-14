import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { useTvEdition } from '../../tv/useTvEdition';
import { tvEditionPath, SERVICES_BASE } from '../../routes/paths';

const cards = [
  { titleKey: 'tvApp.deskWireTitle', bodyKey: 'tvApp.deskWireBody' },
  { titleKey: 'tvApp.deskSubmitTitle', bodyKey: 'tvApp.deskSubmitBody' },
  { titleKey: 'tvApp.deskRundownTitle', bodyKey: 'tvApp.deskRundownBody' },
  { titleKey: 'tvApp.deskRightsTitle', bodyKey: 'tvApp.deskRightsBody' },
  { titleKey: 'tvApp.deskPlaybookTitle', bodyKey: 'tvApp.deskPlaybookBody' },
];

export default function TvDeskPage() {
  const edition = useTvEdition();
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <header className="max-w-3xl">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t('tvApp.navDesk')}
        </span>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
          {t('tvApp.deskTitle')}
        </h1>
        <p className="mt-3 text-[15px] md:text-base text-slate-600 leading-relaxed">
          {t('tvApp.deskSub')}
        </p>
      </header>

      <div className="mt-10 md:mt-12 grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, idx) => (
          <article
            key={c.titleKey}
            className="group relative rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_2px_4px_rgba(15,23,42,0.04),0_16px_32px_-12px_rgba(15,23,42,0.12)]"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[12px] font-semibold text-slate-700 tabular-nums">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {t(c.titleKey)}
              </h2>
            </div>
            <p className="mt-4 text-[15px] text-slate-700 leading-relaxed">
              {t(c.bodyKey)}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-12 md:mt-14 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-5 md:p-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Quick links
        </span>
        <Link
          to={tvEditionPath(edition, '/activity')}
          className="font-medium text-slate-700 hover:text-slate-900 transition-colors"
        >
          {t('tvApp.navActivity')} <span aria-hidden="true" className="rtl:rotate-180 inline-block">→</span>
        </Link>
        <Link
          to={tvEditionPath(edition, '/search')}
          className="font-medium text-slate-700 hover:text-slate-900 transition-colors"
        >
          {t('tvApp.navSearch')} <span aria-hidden="true" className="rtl:rotate-180 inline-block">→</span>
        </Link>
        <Link
          to={`${SERVICES_BASE}/news`}
          className="font-medium text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          {t('nav.news')} · Services <span aria-hidden="true" className="rtl:rotate-180 inline-block">→</span>
        </Link>
        <Link
          to="/machafitv/admin"
          className="font-medium text-slate-500 hover:text-slate-900 transition-colors ms-auto"
        >
          {t('tvApp.homeAdminLink')} <span aria-hidden="true" className="rtl:rotate-180 inline-block">→</span>
        </Link>
      </div>
    </div>
  );
}
