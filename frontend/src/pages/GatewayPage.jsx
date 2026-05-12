import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { SERVICES_BASE, tvEditionPath } from '../routes/paths';

const STORAGE_SHELL = 'kgc_shell_choice';

export default function GatewayPage() {
  const { t } = useI18n();
  const [remember, setRemember] = useState(false);
  const [tvEdition, setTvEdition] = useState('ar');

  useEffect(() => {
    document.title = `${t('gateway.pageTitle')} — ${t('gateway.title')}`;
  }, [t]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_SHELL);
      if (saved === 'services') {
        window.location.replace(SERVICES_BASE);
      }
      if (saved === 'tv_ar') window.location.replace(tvEditionPath('ar', '/'));
      if (saved === 'tv_fr') window.location.replace(tvEditionPath('fr', '/'));
      if (saved === 'tv_en') window.location.replace(tvEditionPath('en', '/'));
    } catch {
      // ignore
    }
  }, []);

  const persistShell = (shell) => {
    if (!remember) return;
    try {
      window.localStorage.setItem(STORAGE_SHELL, shell);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 px-4 py-16">
      <div className="max-w-lg w-full text-center mb-10">
        <img src="/machafi-logo.svg" alt="" className="h-14 mx-auto mb-6 brightness-0 invert opacity-90" />
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{t('gateway.title')}</h1>
        <p className="mt-3 text-sm text-emerald-100/90">{t('gateway.subtitle')}</p>
      </div>

      <div className="grid gap-6 w-full max-w-2xl md:grid-cols-2">
        <Link
          to={SERVICES_BASE}
          onClick={() => persistShell('services')}
          className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur hover:bg-white/10 transition-colors text-start shadow-xl"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">{t('gateway.servicesTitle')}</div>
          <div className="text-lg font-bold text-white mb-2">{t('gateway.servicesCta')}</div>
          <p className="text-sm text-emerald-50/80">{t('gateway.servicesBody')}</p>
          <span className="mt-4 inline-flex text-emerald-300 font-semibold group-hover:underline">{t('gateway.servicesCta')} →</span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur shadow-xl flex flex-col">
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
            className="mt-auto inline-flex justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-4 transition-colors"
          >
            {t('gateway.tvCta')}
          </Link>
        </div>
      </div>

      <label className="mt-10 flex items-center gap-2 text-sm text-emerald-100/90 cursor-pointer select-none">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-white/30" />
        {t('gateway.rememberLabel')}
      </label>
    </div>
  );
}
