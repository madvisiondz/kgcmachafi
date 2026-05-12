import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { useTvEdition } from '../../tv/useTvEdition';
import { tvWireActivity, pick } from '../../data/tvMock';
import { tvEditionPath } from '../../routes/paths';

export default function TvActivityPage() {
  const edition = useTvEdition();
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">{t('tvApp.activityTitle')}</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">{t('tvApp.activitySub')}</p>
        </div>
        <Link to={tvEditionPath(edition, '/desk')} className="text-sm font-bold text-red-800 hover:underline shrink-0">
          {t('tvApp.navDesk')} →
        </Link>
      </div>

      <ul className="mt-10 space-y-0 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
        {tvWireActivity.map((line) => {
          const label = pick(line.label, edition);
          const body = pick(line.body, edition);
          return (
            <li
              key={line.id}
              className={`border-b border-slate-100 last:border-0 px-4 py-4 flex flex-col sm:flex-row sm:gap-6 ${
                line.urgent ? 'bg-red-50/80' : ''
              }`}
            >
              <div className="flex items-baseline gap-3 shrink-0 sm:w-36">
                <time className="font-mono text-xs text-slate-500">{line.time}</time>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider ${
                    line.urgent ? 'text-red-700' : 'text-slate-500'
                  }`}
                >
                  {label}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-snug mt-1 sm:mt-0">{body}</p>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs text-slate-500">{t('tvApp.footerNote')}</p>
    </div>
  );
}
