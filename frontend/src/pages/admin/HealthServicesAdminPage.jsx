import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { SERVICES_BASE } from '../../routes/paths';

export default function HealthServicesAdminPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl bg-white shadow-lg border border-slate-200 p-8 text-center">
        <h1 className="text-xl font-bold text-slate-900">{t('admin.healthTitle')}</h1>
        <p className="mt-2 text-sm text-slate-600">{t('admin.healthSub')}</p>
        <Link className="mt-6 inline-block text-emerald-700 font-semibold hover:underline" to={SERVICES_BASE}>
          ← {t('admin.backToSite')}
        </Link>
      </div>
    </div>
  );
}
