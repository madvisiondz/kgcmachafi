import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { useTvEdition } from '../../tv/useTvEdition';
import { tvEditionPath } from '../../routes/paths';
import { tvScheduleDay, pick } from '../../data/tvMock';

export default function TvLivePage() {
  const edition = useTvEdition();
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-10 md:py-14 grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-6">
        <header>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-700 ring-1 ring-inset ring-red-100">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
            {t('live.status.live')}
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            {t('tvApp.liveHeadline')}
          </h1>
          <p className="mt-3 text-[15px] md:text-base text-slate-600 max-w-2xl leading-relaxed">
            {t('tvApp.liveSub')}
          </p>
        </header>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-slate-900/10 shadow-[0_40px_80px_-32px_rgba(0,0,0,0.55)]">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 30% 30%, rgba(239,68,68,0.18), transparent 60%),' +
                'radial-gradient(ellipse 60% 50% at 80% 80%, rgba(56,189,248,0.10), transparent 60%)',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] ring-1 ring-inset ring-white/15">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              On air
            </span>
            <p className="mt-5 text-sm md:text-[15px] text-slate-300 max-w-md leading-relaxed">
              {t('tvApp.livePlaceholder')}
            </p>
            <button
              type="button"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold shadow-[0_8px_24px_-8px_rgba(239,68,68,0.6)] transition-all hover:bg-red-500 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M6 4.5v11l9-5.5z" />
              </svg>
              {t('live.player.goLive')}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">{t('live.broadcast.description')}</p>
      </div>

      <aside className="lg:col-span-4 space-y-5">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 md:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t('tvApp.liveSidebarTitle')}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
            <p className="text-sm font-semibold text-red-700 uppercase tracking-wider">
              {t('live.status.live')}
            </p>
          </div>
          <p className="mt-2 text-[15px] font-medium text-slate-900 leading-snug">
            {pick(tvScheduleDay[1].title, edition)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 md:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t('tvApp.liveSchedulePeek')}
          </h2>
          <ul className="mt-4 space-y-3">
            {tvScheduleDay.slice(0, 4).map((slot) => (
              <li
                key={slot.id}
                className="flex items-baseline justify-between gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <span className="text-[11px] text-slate-500 font-mono tabular-nums shrink-0">
                  {slot.start}–{slot.end}
                </span>
                <span className="text-[13px] font-medium text-slate-800 text-end">
                  {pick(slot.title, edition)}
                </span>
              </li>
            ))}
          </ul>
          <Link
            to={tvEditionPath(edition, '/schedule')}
            className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            {t('tvApp.navSchedule')}
            <span aria-hidden="true" className="rtl:rotate-180">→</span>
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-slate-950 text-white p-5 md:p-6 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)]">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                'radial-gradient(circle at 20% 0%, rgba(239,68,68,0.18), transparent 50%)',
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
              {t('tvApp.liveToolsTitle')}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              {[
                t('tvApp.liveToolChromakey'),
                t('tvApp.liveToolCue'),
                t('tvApp.liveToolRundown'),
                t('tvApp.liveToolRights'),
              ].map((label) => (
                <li key={label} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-red-400 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
