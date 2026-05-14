import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { isTvEdition, tvEditionPath, SERVICES_BASE } from '../routes/paths';
import TvBreakingBar from '../components/tv/TvBreakingBar.jsx';

/**
 * Machafi TV shell — modern minimal-SaaS layout with broadcast accents.
 * Two stacked rows at the top:
 *   1) Slim utility bar (weather, subscribe, edition switch)
 *   2) Masthead (brand + back links + search) over a pill-style primary nav.
 */
export default function TvShellLayout() {
  const { edition } = useParams();
  const { t, setLanguage, language } = useI18n();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (isTvEdition(edition) && edition !== language) {
      setLanguage(edition);
    }
  }, [edition, language, setLanguage]);

  if (!isTvEdition(edition)) {
    return <Navigate to="/tv/ar" replace />;
  }

  const dir = edition === 'ar' ? 'rtl' : 'ltr';
  const weather = t('tvApp.weatherLine').replace('{temp}', '24');

  const navItems = [
    { to: tvEditionPath(edition, '/'), label: t('tvApp.navHome'), end: true },
    { to: tvEditionPath(edition, '/topics/health'), label: t('tvApp.topicHealth') },
    { to: tvEditionPath(edition, '/topics/policy'), label: t('tvApp.topicPolicy') },
    { to: tvEditionPath(edition, '/topics/research'), label: t('tvApp.topicResearch') },
    { to: tvEditionPath(edition, '/topics/community'), label: t('tvApp.topicCommunity') },
    { divider: true },
    { to: tvEditionPath(edition, '/activity'), label: t('tvApp.navActivity') },
    { to: tvEditionPath(edition, '/desk'), label: t('tvApp.navDesk') },
    { to: tvEditionPath(edition, '/live'), label: t('tvApp.navLive') },
    { to: tvEditionPath(edition, '/schedule'), label: t('tvApp.navSchedule') },
  ];

  const navPillCls = ({ isActive }) =>
    `inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
      isActive
        ? 'bg-slate-900 text-white'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-900" dir={dir}>
      <TvBreakingBar edition={edition} />

      {/* ── Utility row ─────────────────────────────────────────────────── */}
      <div className="bg-slate-950 text-slate-300 text-[12px] border-b border-white/5">
        <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
          <div className="flex items-center gap-x-5 gap-y-1 flex-wrap">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              {weather}
            </span>
            <button
              type="button"
              className="font-medium text-white/85 hover:text-white transition-colors"
            >
              {t('tvApp.subscribe')}
            </button>
            <button
              type="button"
              className="font-medium text-white/85 hover:text-white transition-colors"
            >
              {t('tvApp.alerts')}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-slate-500">{t('tvApp.goToEdition')}</span>
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-0.5">
              {['ar', 'fr', 'en'].map((code) => {
                const active = edition === code;
                return (
                  <Link
                    key={code}
                    to={tvEditionPath(code, '/')}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      active
                        ? 'bg-white text-slate-900'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {code}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Masthead ────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200/70 sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="container mx-auto px-4 py-4 md:py-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-red-700 ring-1 ring-inset ring-red-100">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
                Machafi TV
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {t('tvApp.editionPrefix')} {edition.toUpperCase()}
              </span>
            </div>
            <Link
              to={tvEditionPath(edition, '/')}
              className="mt-1 block group focus:outline-none"
            >
              <span className="text-2xl md:text-3xl lg:text-[2rem] font-semibold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                {t('tvApp.homeHeadline')}
              </span>
            </Link>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              to={tvEditionPath(edition, '/search')}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              aria-label={t('tvApp.navSearch')}
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">{t('tvApp.navSearch')}</span>
            </Link>
            <Link
              to={SERVICES_BASE}
              className="hidden md:inline-flex h-9 items-center rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
            >
              {t('tvApp.backToServices')}
            </Link>
            <Link
              to="/"
              className="hidden lg:inline-flex h-9 items-center px-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              {t('tvApp.backToGateway')}
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Menu"
              aria-expanded={mobileNavOpen}
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                {mobileNavOpen ? (
                  <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                ) : (
                  <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Primary nav ─ scrolls horizontally on mobile, pill-style ─ */}
        <nav
          aria-label="Primary"
          className="border-t border-slate-100 bg-white/70 hidden md:block"
        >
          <div className="container mx-auto px-2 md:px-4">
            <div className="flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {navItems.map((item, idx) =>
                item.divider ? (
                  <span
                    key={`div-${idx}`}
                    className="hidden lg:inline-block h-5 w-px bg-slate-200 mx-1.5"
                    aria-hidden="true"
                  />
                ) : (
                  <NavLink key={item.to} to={item.to} end={item.end} className={navPillCls}>
                    {item.label}
                  </NavLink>
                ),
              )}
            </div>
          </div>
        </nav>

        {/* Mobile dropdown nav */}
        {mobileNavOpen ? (
          <nav
            aria-label="Primary mobile"
            className="md:hidden border-t border-slate-100 bg-white"
          >
            <div className="container mx-auto px-3 py-3 flex flex-col gap-1">
              {navItems.filter((i) => !i.divider).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-1">
                <Link
                  to={SERVICES_BASE}
                  onClick={() => setMobileNavOpen(false)}
                  className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  {t('tvApp.backToServices')}
                </Link>
                <Link
                  to="/"
                  onClick={() => setMobileNavOpen(false)}
                  className="block rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  {t('tvApp.backToGateway')}
                </Link>
              </div>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200/70 bg-slate-950 text-slate-400">
        <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-3 text-sm">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
              <span className="text-white font-semibold text-base tracking-tight">Machafi TV</span>
            </div>
            <p className="mt-3 leading-relaxed text-slate-400 max-w-sm">
              {t('tvApp.footerTagline')}
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t('tvApp.footerStandards')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to={tvEditionPath(edition, '/desk')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {t('tvApp.navDesk')}
                </Link>
              </li>
              <li>
                <Link
                  to={tvEditionPath(edition, '/article/editorial-standards-trust')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {t('tvApp.footerStandards')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t('tvApp.footerContact')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to={`${SERVICES_BASE}/about#contact`}
                  className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  {t('header.contactUs')}
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">Services</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 py-5 text-center text-[11px] text-slate-500">
          {t('tvApp.footerNote')}
        </div>
      </footer>
    </div>
  );
}
