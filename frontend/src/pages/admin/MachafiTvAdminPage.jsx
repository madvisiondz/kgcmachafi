import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { tvEditionPath } from '../../routes/paths';

export default function MachafiTvAdminPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl bg-slate-800 shadow-lg border border-slate-600 p-8 text-center">
        <h1 className="text-xl font-bold text-white">{t('admin.tvTitle')}</h1>
        <p className="mt-2 text-sm text-slate-300">{t('admin.tvSub')}</p>
        <Link className="mt-6 inline-block text-amber-300 font-semibold hover:underline" to={tvEditionPath('ar', '/')}>
          ← {t('admin.backToTv')}
        </Link>
      </div>
    </div>
  );
}
