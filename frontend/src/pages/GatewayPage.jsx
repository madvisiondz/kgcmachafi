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

/** Decorative SVG curves — health × broadcast motif, no text (purely visual). */
function GatewayArtSvg({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="gw-stroke-a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(52 211 153)" stopOpacity="0.35" />
          <stop offset="50%" stopColor="rgb(251 191 36)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="rgb(45 212 191)" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="gw-stroke-b" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <path
        d="M-80 520 Q280 180 620 380 T1280 300"
        stroke="url(#gw-stroke-a)"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M-40 640 Q360 420 720 520 T1220 440"
        stroke="url(#gw-stroke-b)"
        strokeWidth="0.9"
        opacity="0.7"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M100 720 Q520 280 900 480 T1300 200"
        stroke="url(#gw-stroke-a)"
        strokeWidth="0.75"
        opacity="0.45"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function GatewayPage() {
  const { t } = useI18n();
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

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-16">
      {/* —— Artistic background (stacked layers) —— */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {/* Deep base */}
        <div className="absolute inset-0 bg-[#030712]" />
        {/* Mesh washes */}
        <div
          className="absolute inset-0 opacity-95"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 10% -10%, rgba(16, 185, 129, 0.28), transparent 52%),
              radial-gradient(ellipse 90% 70% at 95% 15%, rgba(245, 158, 11, 0.14), transparent 48%),
              radial-gradient(ellipse 70% 90% at 0% 85%, rgba(45, 212, 191, 0.12), transparent 45%),
              radial-gradient(ellipse 55% 55% at 75% 75%, rgba(99, 102, 241, 0.1), transparent 50%),
              linear-gradient(165deg, rgb(2 6 23) 0%, rgb(6 78 59 / 0.35) 38%, rgb(15 23 42) 62%, rgb(2 6 23) 100%)
            `,
          }}
        />
        {/* Soft animated orbs */}
        <div className="absolute -left-[20%] -top-[25%] h-[85vmin] w-[85vmin] rounded-full bg-emerald-400/20 blur-[120px] motion-safe:animate-kgc-gateway-orb-a" />
        <div className="absolute -right-[15%] top-[10%] h-[70vmin] w-[70vmin] rounded-full bg-amber-400/15 blur-[100px] motion-safe:animate-kgc-gateway-orb-b" />
        <div className="absolute left-[20%] -bottom-[30%] h-[75vmin] w-[75vmin] rounded-full bg-teal-400/12 blur-[110px] motion-safe:animate-kgc-gateway-orb-c" />
        <div className="absolute right-[5%] bottom-[5%] h-[45vmin] w-[45vmin] rounded-full bg-teal-500/10 blur-[90px] motion-safe:animate-kgc-gateway-orb-b" />
        {/* Organic line art */}
        <GatewayArtSvg className="absolute left-1/2 top-1/2 min-h-[140%] min-w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-[0.55] md:opacity-70" />
        {/* Horizon glow */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
        {/* Diagonal veil */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-amber-500/[0.03]" />
        {/* Slow light drift */}
        <div className="absolute -left-1/2 top-0 h-full w-[80%] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent motion-safe:animate-kgc-gateway-shimmer" />
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Grain + vignette */}
        <div className="kgc-gateway-grain absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(2_6_23)_78%)] opacity-75" />
      </div>

      {/* —— Foreground —— */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        <div className="max-w-lg w-full text-center mb-10 drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
          <img src="/machafi-logo.svg" alt="" className="h-14 mx-auto mb-6 brightness-0 invert opacity-90" />
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{t('gateway.title')}</h1>
          <p className="mt-3 text-sm text-emerald-100/90">{t('gateway.subtitle')}</p>
        </div>

        <div className="grid gap-6 w-full max-w-2xl md:grid-cols-2">
          <Link
            to={SERVICES_BASE}
            onClick={() => persistShell('services')}
            className="group rounded-2xl border border-white/15 bg-slate-950/40 p-8 backdrop-blur-md hover:bg-slate-900/50 hover:border-emerald-400/25 transition-all text-start shadow-[0_8px_40px_-12px_rgba(0,0,0,0.65)] ring-1 ring-white/5"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">{t('gateway.servicesTitle')}</div>
            <div className="text-lg font-bold text-white mb-2">{t('gateway.servicesCta')}</div>
            <p className="text-sm text-emerald-50/80">{t('gateway.servicesBody')}</p>
            <span className="mt-4 inline-flex text-emerald-300 font-semibold group-hover:underline">{t('gateway.servicesCta')} →</span>
          </Link>

          <div className="rounded-2xl border border-white/15 bg-slate-950/40 p-8 backdrop-blur-md shadow-[0_8px_40px_-12px_rgba(0,0,0,0.65)] ring-1 ring-white/5 flex flex-col">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-200 mb-2">{t('gateway.tvTitle')}</div>
            <p className="text-sm text-emerald-50/80 mb-4">{t('gateway.tvBody')}</p>
            <label className="flex flex-col gap-2 mb-4 text-start">
              <span className="text-xs font-semibold text-white/80">{t('gateway.editionLabel')}</span>
              <select
                value={tvEdition}
                onChange={(e) => setTvEdition(e.target.value)}
                className="rounded-lg border border-white/20 bg-slate-900/80 text-white px-3 py-2 text-sm"
              >
                <option value="ar">{t('gateway.editions.ar')}</option>
                <option value="fr">{t('gateway.editions.fr')}</option>
                <option value="en">{t('gateway.editions.en')}</option>
              </select>
            </label>
            <Link
              to={tvEditionPath(tvEdition, '/')}
              onClick={() => persistShell(`tv_${tvEdition}`)}
              className="mt-auto inline-flex justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-4 transition-colors shadow-lg shadow-amber-900/20"
            >
              {t('gateway.tvCta')}
            </Link>
          </div>
        </div>

        <label className="mt-10 flex items-center gap-2 text-sm text-emerald-100/90 cursor-pointer select-none drop-shadow-md">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-white/30" />
          {t('gateway.rememberLabel')}
        </label>
      </div>
    </div>
  );
}
