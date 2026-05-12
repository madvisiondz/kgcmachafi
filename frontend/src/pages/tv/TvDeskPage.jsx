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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">{t('tvApp.deskTitle')}</h1>
        <p className="mt-2 text-slate-600">{t('tvApp.deskSub')}</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.titleKey} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wide text-red-800">{t(c.titleKey)}</h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">{t(c.bodyKey)}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-4 text-sm font-bold">
        <Link to={tvEditionPath(edition, '/activity')} className="text-red-800 hover:underline">
          {t('tvApp.navActivity')} →
        </Link>
        <Link to={tvEditionPath(edition, '/search')} className="text-red-800 hover:underline">
          {t('tvApp.navSearch')} →
        </Link>
        <Link to={`${SERVICES_BASE}/news`} className="text-emerald-800 hover:underline">
          {t('nav.news')} (Services) →
        </Link>
        <Link to="/machafitv/admin" className="text-slate-600 hover:underline">
          {t('tvApp.homeAdminLink')} →
        </Link>
      </div>
    </div>
  );
}
