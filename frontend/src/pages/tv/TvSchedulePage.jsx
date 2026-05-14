import { useI18n } from '../../i18n/I18nProvider';
import { useTvEdition } from '../../tv/useTvEdition';
import { tvScheduleDay, pick } from '../../data/tvMock';

export default function TvSchedulePage() {
  const edition = useTvEdition();
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <header className="max-w-2xl">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t('tvApp.navSchedule')}
        </span>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
          {t('tvApp.scheduleHeadline')}
        </h1>
        <p className="mt-3 text-[15px] md:text-base text-slate-600 leading-relaxed">
          {t('tvApp.scheduleSub')}
        </p>
      </header>

      {/* Desktop: table */}
      <div className="mt-10 hidden md:block overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200/70">
            <tr>
              <th className="px-5 py-3.5 text-start font-semibold uppercase text-[11px] tracking-[0.14em] w-44">
                {t('tvApp.scheduleTableTime')}
              </th>
              <th className="px-5 py-3.5 text-start font-semibold uppercase text-[11px] tracking-[0.14em]">
                {t('tvApp.scheduleTableProgram')}
              </th>
              <th className="px-5 py-3.5 text-start font-semibold uppercase text-[11px] tracking-[0.14em] w-32">
                {t('tvApp.scheduleTableType')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tvScheduleDay.map((slot) => (
              <tr
                key={slot.id}
                className={`transition-colors hover:bg-slate-50/70 ${slot.isLive ? 'bg-red-50/30' : ''}`}
              >
                <td className="px-5 py-4 font-mono text-[13px] text-slate-600 tabular-nums whitespace-nowrap">
                  {slot.start} – {slot.end}
                </td>
                <td className="px-5 py-4 font-medium text-slate-900">
                  {pick(slot.title, edition)}
                </td>
                <td className="px-5 py-4">
                  {slot.isLive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-red-700 ring-1 ring-inset ring-red-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
                      {t('tvApp.scheduleLiveBadge')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-600">
                      {t('tvApp.scheduleReplayBadge')}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card list */}
      <ul className="mt-8 md:hidden space-y-3">
        {tvScheduleDay.map((slot) => (
          <li
            key={slot.id}
            className={`rounded-xl border bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${
              slot.isLive ? 'border-red-100 bg-red-50/30' : 'border-slate-200/70'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-mono text-slate-500 tabular-nums">
                {slot.start} – {slot.end}
              </span>
              {slot.isLive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-700 ring-1 ring-inset ring-red-100">
                  <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
                  {t('tvApp.scheduleLiveBadge')}
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                  {t('tvApp.scheduleReplayBadge')}
                </span>
              )}
            </div>
            <p className="mt-2 text-[14px] font-medium text-slate-900 leading-snug">
              {pick(slot.title, edition)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
