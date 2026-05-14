import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { SERVICES_BASE, tvEditionPath } from '../routes/paths';

const STORAGE_SHELL = 'kgc_shell_choice';

/** Default TV edition from last remembered visit — never skips `/`; root always shows the gateway. */
function readInitialTvEdition() {
  try {
    const saved = window.localStorage.getItem(STORAGE_SHELL);
    if (saved === 'tv_ar') return 'ar';
    if (saved === 'tv_fr') return 'fr';
    if (saved === 'tv_en') return 'en';
  } catch {
    // ignore
  }
  return 'ar';
}

/* ─────────────────────────────────────────────────────────────
 * Small inline icons (kept here to avoid extra deps)
 * ─────────────────────────────────────────────────────────── */

function IconArrow({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconHeart({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBroadcast({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7.5 7.5a6.5 6.5 0 0 0 0 9M16.5 7.5a6.5 6.5 0 0 1 0 9M4.5 4.5a10 10 0 0 0 0 15M19.5 4.5a10 10 0 0 1 0 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCheck({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GatewayPage() {
  const { t, dir } = useI18n();
  const [remember, setRemember] = useState(false);
  const [tvEdition, setTvEdition] = useState(readInitialTvEdition);

  const persistShell = (shell) => {
    if (!remember) return;
    try {
      window.localStorage.setItem(STORAGE_SHELL, shell);
    } catch {
      // ignore
    }
  };

  const editions = [
    { code: 'ar', labelKey: 'gateway.editions.ar' },
    { code: 'fr', labelKey: 'gateway.editions.fr' },
    { code: 'en', labelKey: 'gateway.editions.en' },
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#05070d] text-white antialiased flex flex-col"
      dir={dir}
    >
      {/* ─── Ambient background ── intentionally minimal: 2 soft orbs, faint grid, vignette ── */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 60% at 15% 0%, rgba(16, 185, 129, 0.18), transparent 55%),' +
              'radial-gradient(ellipse 70% 70% at 100% 100%, rgba(56, 189, 248, 0.10), transparent 55%),' +
              'linear-gradient(180deg, #05070d 0%, #070b16 60%, #03060d 100%)',
          }}
        />
        <div className="absolute -left-[10%] top-[10%] h-[55vmin] w-[55vmin] rounded-full bg-emerald-500/15 blur-[110px] motion-safe:animate-kgc-gateway-orb-a" />
        <div className="absolute -right-[5%] bottom-[5%] h-[45vmin] w-[45vmin] rounded-full bg-sky-500/10 blur-[100px] motion-safe:animate-kgc-gateway-orb-b" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at 50% 35%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 35%, black 30%, transparent 75%)',
          }}
        />
        <div className="kgc-gateway-grain absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(5_7_13)_85%)]" />
      </div>

      {/* ─── Top-right utility ── language sneak-peek + brand mark ─────────────────── */}
      <header className="relative z-10 px-6 md:px-10 pt-7">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5 group" aria-label="Machafi">
            <img src="/machafi-logo.svg" alt="" className="h-7 brightness-0 invert opacity-90 transition-opacity group-hover:opacity-100" />
            <span className="text-[13px] font-semibold tracking-wide text-white/85">Machafi</span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            {t('gateway.subtitle')}
          </span>
        </div>
      </header>

      {/* ─── Main content ─────────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 md:py-16 lg:py-20">
        <div className="w-full max-w-6xl">
          {/* Hero */}
          <section className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur">
              {t('gateway.servicesTitle')} · {t('gateway.tvTitle')}
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-[3.5rem] font-semibold leading-[1.05] tracking-tight">
              {t('gateway.title')}
            </h1>
            <p className="mt-5 text-base md:text-lg leading-relaxed text-white/65 max-w-xl mx-auto">
              {t('gateway.subtitle')}
            </p>
          </section>

          {/* Choice grid */}
          <section className="mt-12 md:mt-16 grid gap-5 md:gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {/* Services card */}
            <Link
              to={SERVICES_BASE}
              onClick={() => persistShell('services')}
              className="group relative flex flex-col rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7 md:p-8 text-start backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
                  <IconHeart className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300/90">
                  {t('gateway.servicesTitle')}
                </span>
              </div>

              <h2 className="mt-6 text-xl md:text-2xl font-semibold tracking-tight text-white">
                {t('gateway.servicesCta')}
              </h2>
              <p className="mt-2.5 text-sm md:text-[15px] leading-relaxed text-white/65">
                {t('gateway.servicesBody')}
              </p>

              <span className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-all group-hover:bg-emerald-50 group-hover:text-emerald-900">
                {t('gateway.servicesCta')}
                <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180" />
              </span>
            </Link>

            {/* TV card */}
            <div className="group relative flex flex-col rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7 md:p-8 text-start backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out hover:border-white/[0.14] hover:bg-white/[0.05]">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-200 ring-1 ring-inset ring-amber-300/20">
                  <IconBroadcast className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/90">
                  {t('gateway.tvTitle')}
                </span>
              </div>

              <h2 className="mt-6 text-xl md:text-2xl font-semibold tracking-tight text-white">
                {t('gateway.tvCta')}
              </h2>
              <p className="mt-2.5 text-sm md:text-[15px] leading-relaxed text-white/65">
                {t('gateway.tvBody')}
              </p>

              {/* Segmented edition picker */}
              <div className="mt-7" role="radiogroup" aria-label={t('gateway.editionLabel')}>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55 mb-2.5">
                  {t('gateway.editionLabel')}
                </span>
                <div className="inline-flex w-full rounded-xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur">
                  {editions.map((ed) => {
                    const active = tvEdition === ed.code;
                    return (
                      <button
                        key={ed.code}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setTvEdition(ed.code)}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                          active
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        {t(ed.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Link
                to={tvEditionPath(tvEdition, '/')}
                onClick={() => persistShell(`tv_${tvEdition}`)}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_6px_24px_-8px_rgba(251,191,36,0.55)] transition-all hover:bg-amber-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
              >
                {t('gateway.tvCta')}
                <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180" />
              </Link>
            </div>
          </section>

          {/* Remember preference — subtle, grouped, accessible */}
          <div className="mt-10 md:mt-12 flex justify-center">
            <label className="inline-flex items-center gap-3 cursor-pointer select-none rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75 backdrop-blur transition-colors hover:bg-white/[0.06] hover:text-white">
              <span
                className={`relative inline-flex h-4 w-4 items-center justify-center rounded-md border transition-colors ${
                  remember ? 'bg-emerald-400 border-emerald-400 text-slate-900' : 'border-white/30'
                }`}
                aria-hidden="true"
              >
                {remember ? <IconCheck className="h-3 w-3" /> : null}
              </span>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="sr-only"
              />
              {t('gateway.rememberLabel')}
            </label>
          </div>
        </div>
      </main>

      {/* Footer note (visually quiet) */}
      <footer className="relative z-10 px-6 pb-6 pt-2 text-center text-[11px] text-white/40">
        © {new Date().getFullYear()} Machafi
      </footer>
    </div>
  );
}
