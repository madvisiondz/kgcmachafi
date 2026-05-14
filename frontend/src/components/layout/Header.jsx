import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { SERVICES_BASE, servicesPath, tvEditionPath } from '../../routes/paths';
import NewsTicker from './NewsTicker.jsx';

function Icon({ children, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const Icons = {
  menu: (props) => (
    <Icon {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </Icon>
  ),
  close: (props) => (
    <Icon {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </Icon>
  ),
  globe: (props) => (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20" />
      <path d="M12 2a15.3 15.3 0 0 0 0 20" />
    </Icon>
  ),
  facebook: (props) => (
    <Icon {...props}>
      <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3V3z" />
    </Icon>
  ),
  x: (props) => (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="currentColor"
      className={props?.className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  ),
  instagram: (props) => (
    <Icon {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </Icon>
  ),
  youtube: (props) => (
    <Icon {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <path d="m9.75 15.02 5.27-3.02-5.27-3.02v6.04z" />
    </Icon>
  ),
  portal: (props) => (
    <Icon {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </Icon>
  ),
};

export default function Header() {
  const { language, setLanguage, t, dir } = useI18n();
  const location = useLocation();
  const headerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  // Ensures page content never scrolls "under" the collapsing header.
  // We publish the live header height as a CSS variable used by the app shell spacer.
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--app-header-height', `${Math.max(0, Math.round(h))}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, [dir, language]);

  // Ported from the pre-rebuild monolith header: direction-aware hysteresis + rAF throttle.
  // Thresholds re-read on each frame so resize / `matchMedia` changes (e.g. tablet ↔ desktop) stay aligned.
  useEffect(() => {
    let rafId = 0;
    const compactRef = { current: false };
    let lastY = window.scrollY || 0;

    const thresholds = () => {
      const mobile = window.matchMedia?.('(max-width: 768px)')?.matches ?? false;
      return { ENTER_AT: mobile ? 220 : 140, EXIT_AT: mobile ? 120 : 90 };
    };

    const update = () => {
      rafId = 0;
      const { ENTER_AT, EXIT_AT } = thresholds();
      const y = window.scrollY || 0;
      const delta = y - lastY;
      lastY = y;
      const goingDown = delta > 0.5;
      const goingUp = delta < -0.5;

      let next = compactRef.current;
      if (!compactRef.current && goingDown && y > ENTER_AT) next = true;
      if (compactRef.current && goingUp && y < EXIT_AT) next = false;

      if (next !== compactRef.current) {
        compactRef.current = next;
        setIsCompact(next);
      }
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    const onMqChange = () => {
      lastY = window.scrollY || 0;
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
      update();
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    const mql = window.matchMedia('(max-width: 768px)');
    mql.addEventListener('change', onMqChange);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      mql.removeEventListener('change', onMqChange);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  const tvLiveHref = tvEditionPath(language, '/live');
  const tvScheduleHref = tvEditionPath(language, '/schedule');

  const nav = useMemo(
    () => [
      // Matches legacy order + routes (Machafi Services base path)
      { key: 'nav.home', href: servicesPath('/'), icon: 'home' },
      { key: 'nav.consultations', href: servicesPath('/consultations'), icon: 'consultations' },
      { key: 'nav.hospitals', href: servicesPath('/hospitals'), icon: 'hospitals' },
      { key: 'nav.pharmacies', href: servicesPath('/pharmacies'), icon: 'pharmacies' },
      { key: 'nav.ambulances', href: servicesPath('/ambulances'), icon: 'ambulances' },
      { key: 'nav.accommodation', href: servicesPath('/accommodations'), icon: 'accommodation' },
      { key: 'nav.library', href: servicesPath('/library'), icon: 'library' },
      { key: 'nav.programs', href: servicesPath('/programs'), icon: 'programs' },
      { key: 'nav.services', href: servicesPath('/service'), icon: 'services' },
      { key: 'nav.donations', href: servicesPath('/donations'), icon: 'donations' },
      { key: 'nav.news', href: servicesPath('/news'), icon: 'news' },
    ],
    [],
  );

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 shadow-md flex flex-col min-h-0" dir={dir}>
      <NewsTicker collapsed={isCompact} />

      {/* Utility bar — grid 0fr/1fr collapses to true zero height (legacy pattern) */}
      <div
        className={`relative z-[2] grid min-h-0 transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
          isCompact ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div
          className={`min-h-0 overflow-hidden ${isCompact ? 'pointer-events-none' : ''}`}
          aria-hidden={isCompact}
        >
          <div className={`bg-slate-900 text-white text-xs md:text-sm ${!isCompact ? 'border-b border-slate-800/70' : ''}`}>
        <div className="container mx-auto px-4 py-2 md:py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex gap-2">
              <a href="#" className="hover:text-green-400 transition-colors" aria-label={t('header.social.facebook')}>
                {Icons.facebook({ className: 'w-4 h-4' })}
              </a>
              <a href="#" className="hover:text-green-400 transition-colors" aria-label={t('header.social.x')}>
                {Icons.x({ className: 'w-4 h-4' })}
              </a>
              <a href="#" className="hover:text-green-400 transition-colors" aria-label={t('header.social.instagram')}>
                {Icons.instagram({ className: 'w-4 h-4' })}
              </a>
              <a href="#" className="hover:text-green-400 transition-colors" aria-label={t('header.social.youtube')}>
                {Icons.youtube({ className: 'w-4 h-4' })}
              </a>
            </div>

            <div className="hidden md:block w-px h-4 bg-gray-700" />

            <Link to={`${servicesPath('/about')}#about`} className="hover:text-green-400 transition-colors hidden md:block">
              {t('header.whoWeAre')}
            </Link>
            <Link to={`${servicesPath('/about')}#contact`} className="hover:text-green-400 transition-colors hidden md:block">
              {t('header.contactUs')}
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-gray-200">
              {Icons.globe({ className: 'w-4 h-4' })}
              <span className="font-semibold">{t('header.lang')}</span>
            </div>

            <div className="flex items-center rounded-full bg-white/10 border border-white/10 overflow-hidden">
              {['fr', 'ar', 'en'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`px-3 py-1 text-xs font-bold uppercase transition-colors ${
                    language === code ? 'bg-green-500 text-slate-900' : 'text-white hover:bg-white/10'
                  }`}
                  aria-pressed={language === code}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>

      {/* Middle bar (logos + mobile menu button) */}
      <div className="bg-white border-b relative z-10">
        <div className="container mx-auto px-4">
          <div
            className={`flex flex-col md:flex-row justify-between items-center gap-3 transition-[padding] duration-200 motion-reduce:transition-none ${
              isCompact ? 'py-1.5 md:py-2' : 'py-3 md:py-4'
            }`}
          >
            <div className="flex items-center w-full md:w-auto gap-3 md:gap-4">
              <div
                className={`flex-shrink-0 transition-[width] duration-200 ${
                  isCompact ? 'w-12 md:w-14 lg:w-16' : 'w-24 md:w-32 lg:w-40'
                }`}
              >
                <Link to={servicesPath('/')}>
                  <img
                    src="/machafi-logo.svg"
                    alt={t('header.brandAlt')}
                    className="w-full h-auto object-contain drop-shadow-sm hover:scale-105 transition-transform"
                  />
                </Link>
              </div>

              <div
                className={`flex-shrink-0 hidden md:block transition-[width,opacity] duration-200 ${
                  isCompact ? 'w-0 opacity-0 overflow-hidden' : 'w-[4.5rem] sm:w-20 md:w-24 lg:w-28 opacity-100'
                }`}
              >
                <img
                  src="/branding/kgc.png"
                  alt={t('header.partnerKgcAlt')}
                  width={160}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-full max-h-9 object-contain object-left md:h-9 md:max-h-10 lg:max-h-11 drop-shadow-sm"
                  draggable="false"
                />
              </div>

              <div
                className={`flex-shrink-0 hidden md:block transition-[width,opacity] duration-200 ${
                  isCompact ? 'w-0 opacity-0 overflow-hidden' : 'w-[5rem] sm:w-24 md:w-28 lg:w-32 opacity-100'
                }`}
              >
                <img
                  src="/branding/komas.png"
                  alt={t('header.partnerKomasAlt')}
                  width={180}
                  height={72}
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-full max-h-9 object-contain object-left md:h-9 md:max-h-10 lg:max-h-11 drop-shadow-sm"
                  draggable="false"
                />
              </div>

              <div className="flex-1 lg:hidden" />

              <div className="flex items-center gap-2 lg:hidden">
                {/* Mobile: portal + Machafi TV (live / schedule) — same language edition as header */}
                <Link
                  to="/"
                  className={`rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 shadow-sm grid place-items-center transition-[width,height,padding] duration-200 ${
                    isCompact ? 'h-8 w-8' : 'h-9 w-9'
                  }`}
                  aria-label={t('header.sitePortal')}
                  title={t('header.sitePortal')}
                >
                  {Icons.portal({ className: 'w-[18px] h-[18px]' })}
                </Link>

                <Link
                  to={tvLiveHref}
                  className={`rounded-md border border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm grid place-items-center transition-[width,height,padding] duration-200 ${
                    isCompact ? 'h-8 w-8' : 'h-9 w-9'
                  }`}
                  aria-label={t('common.watchLive')}
                  title={`${t('common.watchLive')} — ${t('header.tvShellHint')}`}
                >
                  <img src="/nav-icons/live-red.png" alt="" aria-hidden="true" className="w-[18px] h-[18px]" draggable="false" />
                </Link>

                <Link
                  to={tvScheduleHref}
                  className={`rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm grid place-items-center transition-[width,height,padding] duration-200 ${
                    isCompact ? 'h-8 w-8' : 'h-9 w-9'
                  }`}
                  aria-label={t('header.tvScheduleBranding')}
                  title={`${t('header.tvScheduleBranding')} — ${t('header.tvShellHint')}`}
                >
                  <img src="/nav-icons/programs-blue.png" alt="" aria-hidden="true" className="w-[18px] h-[18px]" draggable="false" />
                </Link>

                <button
                  type="button"
                  className={`rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm grid place-items-center transition-[width,height] duration-200 motion-reduce:transition-none ${
                    isCompact ? 'h-8 w-8' : 'h-9 w-9'
                  }`}
                  onClick={() => setIsMenuOpen((v) => !v)}
                  aria-label={t('header.menu')}
                  aria-expanded={isMenuOpen}
                  aria-controls="primary-mobile-nav"
                >
                  {isMenuOpen ? Icons.close({ className: 'w-5 h-5' }) : Icons.menu({ className: 'w-5 h-5' })}
                </button>
              </div>
            </div>

            {/* Desktop: portal home + Machafi TV live & schedule (current edition) */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/"
                className={`inline-flex items-center justify-center rounded-md border border-emerald-200 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950 shadow-sm transition-[width,height,padding] duration-200 ${
                  isCompact ? 'h-8 w-8 p-0 min-w-0' : 'gap-2 px-3 h-9'
                }`}
                aria-label={t('header.sitePortal')}
                title={t('header.sitePortal')}
              >
                {Icons.portal({ className: 'w-[18px] h-[18px]' })}
                {!isCompact && <span className="font-bold max-w-[10rem] leading-tight text-center">{t('header.sitePortal')}</span>}
              </Link>

              <Link
                to={tvLiveHref}
                className={`inline-flex items-center justify-center rounded-md border border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm transition-[width,height,padding] duration-200 ${
                  isCompact ? 'h-8 w-8 p-0 min-w-0' : 'gap-2 animate-pulse px-4 h-9'
                }`}
                aria-label={t('common.watchLive')}
                title={`${t('common.watchLive')} — ${t('header.tvShellHint')}`}
              >
                <img src="/nav-icons/live-red.png" alt="" aria-hidden="true" className="w-[18px] h-[18px]" draggable="false" />
                {!isCompact && <span className="font-bold">{t('common.watchLive')}</span>}
              </Link>

              <Link
                to={tvScheduleHref}
                className={`inline-flex items-center justify-center rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm transition-[width,height,padding] duration-200 ${
                  isCompact ? 'h-8 w-8 p-0 min-w-0' : 'gap-2 px-4 h-9'
                }`}
                aria-label={t('header.tvScheduleBranding')}
                title={`${t('header.tvScheduleBranding')} — ${t('header.tvShellHint')}`}
              >
                <img src="/nav-icons/programs-blue.png" alt="" aria-hidden="true" className="w-[18px] h-[18px]" draggable="false" />
                {!isCompact && <span className="font-bold">{t('header.tvScheduleBranding')}</span>}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="hidden lg:block kgc-main-nav-gradient text-white">
        <div className="container mx-auto px-4 relative z-[1]">
          <nav className="flex justify-between items-center py-0">
            <ul className="flex items-center">
              {nav.map((item) => (
                <li key={item.key}>
                  {(() => {
                    const isNews = item.href === servicesPath('/news');
                    const isHomePath =
                      location.pathname === SERVICES_BASE || location.pathname === `${SERVICES_BASE}/`;
                    const selected =
                      item.href === servicesPath('/')
                        ? isHomePath
                        : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);

                    const base =
                      'group relative isolate overflow-hidden whitespace-nowrap flex items-center gap-2 text-sm font-semibold transition-colors';

                    const normal = `${base} py-3 px-4 hover:bg-white/10`;
                    const news = selected
                      ? `${base} mx-1 my-2 px-4 py-2 rounded-full bg-white/12 text-white ring-1 ring-yellow-300/60 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] kgc-glow`
                      : `${base} mx-1 my-2 px-4 py-2 rounded-full bg-white/5 text-white ring-1 ring-white/15 hover:bg-white/10 hover:ring-yellow-200/40`;

                    return (
                      <Link
                        to={item.href}
                        className={isNews ? news : normal}
                        aria-current={selected ? 'page' : undefined}
                      >
                        {isNews ? (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 opacity-70 kgc-nav-shimmer"
                            style={{
                              background:
                                'linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.0) 35%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.0) 65%, transparent 100%)',
                            }}
                          />
                        ) : null}

                        <img
                          src={`/nav-icons/${item.icon}.png`}
                          alt=""
                          aria-hidden="true"
                          className="w-[18px] h-[18px] translate-y-[0.5px] select-none relative z-[1]"
                          draggable="false"
                        />

                        <span className="relative z-[1] inline-flex items-center gap-2">
                          <span className="font-bold">{t(item.key)}</span>
                          {isNews ? (
                            <span className="text-[10px] font-black tracking-wide rounded-full px-2 py-0.5 bg-yellow-300 text-emerald-950 shadow-sm">
                              {t('nav.newsBadge')}
                            </span>
                          ) : null}
                        </span>

                        {!isNews ? (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        ) : null}
                      </Link>
                    );
                  })()}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav
          id="primary-mobile-nav"
          className="lg:hidden bg-white border-b shadow-xl overflow-hidden p-4 space-y-1"
          aria-label={t('header.menu')}
        >
            {nav.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between gap-3 py-3 px-4 rounded-xl transition-colors font-semibold ${
                  item.href === servicesPath('/news')
                    ? 'text-emerald-950 bg-gradient-to-r from-yellow-200 via-white to-emerald-100 ring-1 ring-yellow-300/70 shadow-sm'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <img
                    src={`/nav-icons/${item.icon}.png`}
                    alt=""
                    aria-hidden="true"
                    className="w-[18px] h-[18px] select-none"
                    draggable="false"
                  />
                  <span>{t(item.key)}</span>
                </span>
                {item.href === servicesPath('/news') ? (
                  <span className="text-[10px] font-black tracking-wide rounded-full px-2 py-0.5 bg-emerald-800 text-white">
                    {t('nav.newsBadge')}
                  </span>
                ) : null}
              </Link>
            ))}
        </nav>
      )}
    </header>
  );
}

