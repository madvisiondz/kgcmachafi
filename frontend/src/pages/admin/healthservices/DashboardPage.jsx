import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../i18n/I18nProvider';
import { adminFetch } from '../../../services/admin/healthAdminApi';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import { useHealthAdminToast } from './HealthAdminToastContext';

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
        } else toast.error(res.errorMessage || 'Error');
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
        ['News', counts.news, '/healthservices/admin/news'],
        ['Pharmacies', counts.pharmacies, '/healthservices/admin/pharmacies'],
        ['Hospitals', counts.hospitals, '/healthservices/admin/hospitals'],
        ['Intl hospitals', counts.international_hospitals, '/healthservices/admin/international-hospitals'],
        ['Ambulances', counts.ambulances, '/healthservices/admin/ambulances'],
        ['Accommodations', counts.accommodations, '/healthservices/admin/accommodations'],
        ['Bookings', counts.consultation_bookings, '/healthservices/admin/consultations/bookings'],
        ['Donation intents', counts.donation_intents, '/healthservices/admin/donations/intents'],
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">{t('admin.hsvc.dashboard')}</h1>
        <p className="text-sm text-slate-600 mt-1">{t('admin.hsvc.countsIntro')}</p>
      </div>

      {showDefaultPw ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 font-semibold">
          {t('admin.hsvc.defaultPasswordWarn')}
        </div>
      ) : null}

      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([label, n, href]) => (
            <Link key={label} to={href} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-300 transition-colors">
              <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">{n}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">{t('admin.hsvc.openActions')}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700" to="/healthservices/admin/messages">
            {t('admin.hsvc.navMessages')}
          </Link>
          <Link className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50" to="/healthservices/admin/settings">
            {t('admin.hsvc.navSettings')}
          </Link>
          <Link className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50" to="/healthservices/admin/live">
            {t('admin.hsvc.navLive')}
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">{t('admin.hsvc.recentMessages')}</h2>
        {recent.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">{t('admin.hsvc.noMessages')}</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {recent.map((m) => (
              <li key={m.id} className="py-2 text-sm flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-semibold text-slate-900">{m.name}</span>
                <span className="text-slate-500">{m.subject}</span>
                <span className="text-xs text-slate-400">{m.created_at}</span>
              </li>
            ))}
          </ul>
        )}
        <Link to="/healthservices/admin/messages" className="mt-3 inline-block text-sm font-bold text-emerald-700 hover:underline">
          {t('admin.hsvc.navMessages')} →
        </Link>
      </div>
    </div>
  );
}
