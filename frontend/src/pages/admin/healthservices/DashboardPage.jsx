import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../i18n/I18nProvider';
import { adminFetch } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';
import * as ui from '../../../components/admin/healthservices/adminUiClasses';

const kpiIcons = ['📰', '💊', '🏥', '🌍', '🚑', '🏠', '📅', '💚'];

export default function DashboardPage() {
  const { t } = useI18n();
  const { admin, refreshSession } = useHealthAdminAuth();
  const toast = useHealthAdminToast();
  const [counts, setCounts] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await adminFetch('/admin/dashboard-stats.php');
      if (cancelled) return;
      if (!res.ok) {
        if (res.response.status === 401) {
          toast.error(t('admin.hsvc.sessionExpired'));
          await refreshSession();
        } else toast.error(res.errorMessage || t('admin.hsvc.dashLoadError'));
        setLoading(false);
        return;
      }
      const d = res.data && typeof res.data === 'object' ? res.data : {};
      setCounts(d.counts || null);
      setRecent(Array.isArray(d.recent_contacts) ? d.recent_contacts : []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshSession, t, toast]);

  const showDefaultPw = admin?.username === 'admin';

  const cards = counts
    ? [
        [t('admin.hsvc.dashNews'), counts.news, '/healthservices/admin/news'],
        [t('admin.hsvc.dashPharmacies'), counts.pharmacies, '/healthservices/admin/pharmacies'],
        [t('admin.hsvc.dashHospitals'), counts.hospitals, '/healthservices/admin/hospitals'],
        [t('admin.hsvc.dashIntlHospitals'), counts.international_hospitals, '/healthservices/admin/international-hospitals'],
        [t('admin.hsvc.dashAmbulances'), counts.ambulances, '/healthservices/admin/ambulances'],
        [t('admin.hsvc.dashAccommodations'), counts.accommodations, '/healthservices/admin/accommodations'],
        [t('admin.hsvc.dashBookings'), counts.consultation_bookings, '/healthservices/admin/consultations/bookings'],
        [t('admin.hsvc.dashIntents'), counts.donation_intents, '/healthservices/admin/donations/intents'],
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={ui.pageTitle}>{t('admin.hsvc.dashboard')}</h1>
        <p className={ui.pageSub}>
          {t('admin.hsvc.dashWelcome')}, {admin?.full_name || admin?.username}. {t('admin.hsvc.dashPendingHint')}
        </p>
      </div>

      {showDefaultPw ? <div className={ui.alertWarn}>{t('admin.hsvc.defaultPasswordWarn')}</div> : null}

      {loading ? (
        <p className={ui.loadingState}>{t('admin.hsvc.uiLoading')}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([label, n, href], i) => (
            <Link key={label} to={href} className={ui.kpiCard}>
              <span className="text-2xl" aria-hidden>
                {kpiIcons[i] ?? '•'}
              </span>
              <p className={ui.kpiLabel}>{label}</p>
              <p className={ui.kpiValue}>{n}</p>
            </Link>
          ))}
        </div>
      )}

      <div className={`${ui.glassCard} p-4`}>
        <h2 className={ui.sectionTitle}>{t('admin.hsvc.openActions')}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className={ui.btnPrimary} to="/healthservices/admin/messages">
            {t('admin.hsvc.navMessages')}
          </Link>
          <Link className={ui.btnGhost} to="/healthservices/admin/settings">
            {t('admin.hsvc.navSettings')}
          </Link>
          <Link className={ui.btnGhost} to="/healthservices/admin/live">
            {t('admin.hsvc.navLive')}
          </Link>
        </div>
      </div>

      <div className={`${ui.glassCard} p-4`}>
        <h2 className={ui.sectionTitle}>{t('admin.hsvc.recentMessages')}</h2>
        {recent.length === 0 ? (
          <p className={`mt-2 ${ui.muted}`}>{t('admin.hsvc.noMessages')}</p>
        ) : (
          <ul className="mt-3 divide-y divide-emerald-500/10">
            {recent.map((m) => (
              <li key={m.id} className="py-2 text-sm flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-semibold text-white">{m.name}</span>
                <span className="text-slate-300">{m.subject}</span>
                <span className={ui.mutedXs}>{m.created_at}</span>
              </li>
            ))}
          </ul>
        )}
        <Link to="/healthservices/admin/messages" className={`mt-3 inline-block ${ui.link}`}>
          {t('admin.hsvc.navMessages')} →
        </Link>
      </div>
    </div>
  );
}
