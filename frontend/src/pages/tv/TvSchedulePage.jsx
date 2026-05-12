import { useI18n } from '../../i18n/I18nProvider';
import { useTvEdition } from '../../tv/useTvEdition';
import { tvScheduleDay, pick } from '../../data/tvMock';

export default function TvSchedulePage() {
  const edition = useTvEdition();
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-slate-900">{t('tvApp.scheduleHeadline')}</h1>
      <p className="mt-2 text-slate-600 max-w-2xl mb-8">{t('tvApp.scheduleSub')}</p>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white text-left">
            <tr>
              <th className="px-4 py-3 font-black uppercase text-xs tracking-wider">{t('tvApp.scheduleTableTime')}</th>
              <th className="px-4 py-3 font-black uppercase text-xs tracking-wider">{t('tvApp.scheduleTableProgram')}</th>
              <th className="px-4 py-3 font-black uppercase text-xs tracking-wider w-28">{t('tvApp.scheduleTableType')}</th>
            </tr>
          </thead>
          <tbody>
            {tvScheduleDay.map((slot) => (
              <tr key={slot.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                  {slot.start} – {slot.end}
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">{pick(slot.title, edition)}</td>
                <td className="px-4 py-3">
                  {slot.isLive ? (
                    <span className="rounded-full bg-red-600 text-white text-[10px] font-black px-2 py-0.5 uppercase">
                      {t('tvApp.scheduleLiveBadge')}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 uppercase">
                      {t('tvApp.scheduleReplayBadge')}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
