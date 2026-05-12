import { useEffect } from 'react';
import { Link, NavLink, Navigate, Outlet, useParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { isTvEdition, tvEditionPath, SERVICES_BASE } from '../routes/paths';
import TvBreakingBar from '../components/tv/TvBreakingBar.jsx';

/**
 * Machafi TV shell — broadcast-style masthead, wire bar, and edition-prefixed routes.
 */
export default function TvShellLayout() {
  const { edition } = useParams();
  const { t, setLanguage, language } = useI18n();

  useEffect(() => {
    if (isTvEdition(edition) && edition !== language) {
      setLanguage(edition);
    }
  }, [edition, language, setLanguage]);

  if (!isTvEdition(edition)) {
    return <Navigate to="/tv/ar" replace />;
  }

  const navCls = ({ isActive }) =>
    `px-2.5 py-2 rounded-md text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${
      isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
    }`;

  const weather = t('tvApp.weatherLine').replace('{temp}', '24');

  return (
    <div className="min-h-screen flex flex-col bg-slate-100" dir={edition === 'ar' ? 'rtl' : 'ltr'}>
      <TvBreakingBar edition={edition} />

      {/* Utility strip */}
      <div className="bg-slate-950 text-slate-300 text-xs border-b border-slate-800">
        <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-slate-500 hidden sm:inline">{weather}</span>
            <button type="button" className="font-semibold text-white hover:text-red-300">
              {t('tvApp.subscribe')}
            </button>
            <button type="button" className="font-semibold text-white hover:text-red-300">
              {t('tvApp.alerts')}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">{t('tvApp.goToEdition')}</span>
            {['ar', 'fr', 'en'].map((code) => (
              <Link
                key={code}
                to={tvEditionPath(code, '/')}
                className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${
                  edition === code ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {code}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Masthead */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.35em] text-red-700">Machafi TV</div>
            <Link to={tvEditionPath(edition, '/')} className="mt-1 block">
              <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{t('tvApp.homeHeadline')}</span>
            </Link>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t('tvApp.editionPrefix')} {edition.toUpperCase()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link to={`${SERVICES_BASE}`} className="font-bold text-emerald-800 hover:underline">
              {t('tvApp.backToServices')}
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="/" className="text-slate-600 hover:text-emerald-700">
              {t('tvApp.backToGateway')}
            </Link>
            <span className="text-slate-300">|</span>
            <Link to={tvEditionPath(edition, '/search')} className="font-bold text-slate-800 hover:text-red-700">
              {t('tvApp.navSearch')}
            </Link>
          </div>
        </div>

        {/* Primary nav — industry-style rail */}
        <div className="border-t border-slate-100 bg-slate-50/90">
          <div className="container mx-auto px-2 md:px-4 overflow-x-auto">
            <nav className="flex items-center gap-1 py-2 min-w-max">
              <NavLink to={tvEditionPath(edition, '/')} end className={navCls}>
                {t('tvApp.navHome')}
              </NavLink>
              <NavLink to={tvEditionPath(edition, '/topics/health')} className={navCls}>
                {t('tvApp.topicHealth')}
              </NavLink>
              <NavLink to={tvEditionPath(edition, '/topics/policy')} className={navCls}>
                {t('tvApp.topicPolicy')}
              </NavLink>
              <NavLink to={tvEditionPath(edition, '/topics/research')} className={navCls}>
                {t('tvApp.topicResearch')}
              </NavLink>
              <NavLink to={tvEditionPath(edition, '/topics/community')} className={navCls}>
                {t('tvApp.topicCommunity')}
              </NavLink>
              <span className="w-px h-6 bg-slate-300 mx-1 hidden sm:block" aria-hidden="true" />
              <NavLink to={tvEditionPath(edition, '/activity')} className={navCls}>
                {t('tvApp.navActivity')}
              </NavLink>
              <NavLink to={tvEditionPath(edition, '/desk')} className={navCls}>
                {t('tvApp.navDesk')}
              </NavLink>
              <NavLink to={tvEditionPath(edition, '/live')} className={navCls}>
                {t('tvApp.navLive')}
              </NavLink>
              <NavLink to={tvEditionPath(edition, '/schedule')} className={navCls}>
                {t('tvApp.navSchedule')}
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
          <div>
            <div className="text-white font-black text-lg mb-2">Machafi TV</div>
            <p>{t('tvApp.footerTagline')}</p>
          </div>
          <div>
            <div className="text-white font-bold mb-2">{t('tvApp.footerStandards')}</div>
            <Link to={tvEditionPath(edition, '/desk')} className="block hover:text-white">
              {t('tvApp.navDesk')}
            </Link>
            <Link to={tvEditionPath(edition, '/article/editorial-standards-trust')} className="block mt-1 hover:text-white">
              {t('tvApp.footerStandards')}
            </Link>
          </div>
          <div>
            <div className="text-white font-bold mb-2">{t('tvApp.footerContact')}</div>
            <Link to={`${SERVICES_BASE}/about#contact`} className="hover:text-white">
              {t('header.contactUs')} → Machafi Services
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-800 py-4 text-center text-xs">{t('tvApp.footerNote')}</div>
      </footer>
    </div>
  );
}
