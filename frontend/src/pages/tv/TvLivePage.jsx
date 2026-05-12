import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { useTvEdition } from '../../tv/useTvEdition';
import { tvEditionPath } from '../../routes/paths';
import { tvScheduleDay, pick } from '../../data/tvMock';

export default function TvLivePage() {
  const edition = useTvEdition();
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8 grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">{t('tvApp.liveHeadline')}</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">{t('tvApp.liveSub')}</p>
        </div>
        <div className="aspect-video w-full rounded-xl bg-black flex flex-col items-center justify-center text-white shadow-xl border border-slate-800">
          <span className="text-xs font-black uppercase tracking-widest text-red-400 mb-2">On air</span>
          <p className="text-sm text-slate-400 px-6 text-center max-w-md">{t('tvApp.livePlaceholder')}</p>
          <button
            type="button"
            className="mt-6 rounded-lg bg-red-600 hover:bg-red-500 px-6 py-2 text-sm font-bold"
          >
            {t('live.player.goLive')}
          </button>
        </div>
        <p className="text-xs text-slate-500">{t('live.broadcast.description')}</p>
      </div>

      <aside className="lg:col-span-4 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">{t('tvApp.liveSidebarTitle')}</h2>
          <p className="mt-3 text-sm font-bold text-red-700">{t('live.status.live')}</p>
          <p className="text-sm text-slate-700 mt-1">{pick(tvScheduleDay[1].title, edition)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">{t('tvApp.liveSchedulePeek')}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {tvScheduleDay.slice(0, 4).map((slot) => (
              <li key={slot.id} className="flex justify-between gap-2 border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-mono text-xs">
                  {slot.start}–{slot.end}
                </span>
                <span className="font-semibold text-slate-800 text-right">{pick(slot.title, edition)}</span>
              </li>
            ))}
          </ul>
          <Link to={tvEditionPath(edition, '/schedule')} className="mt-4 inline-block text-xs font-bold text-red-800 hover:underline">
            {t('tvApp.navSchedule')} →
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 text-white p-5">
          <h2 className="text-xs font-black uppercase tracking-widest text-red-400">{t('tvApp.liveToolsTitle')}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>• {t('tvApp.liveToolChromakey')}</li>
            <li>• {t('tvApp.liveToolCue')}</li>
            <li>• {t('tvApp.liveToolRundown')}</li>
            <li>• {t('tvApp.liveToolRights')}</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
