import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useI18n } from '../../../i18n/I18nProvider';
import { servicesPath } from '../../../routes/paths';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import HealthAdminToastStack from '../../../components/admin/healthservices/HealthAdminToastStack';

const navClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-emerald-600 text-white shadow' : 'text-slate-700 hover:bg-slate-100'
  }`;

function NavGroup({ title, children }) {
  return (
    <div className="space-y-1">
      <p className="px-3 text-[11px] font-black uppercase tracking-wider text-slate-400">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export default function AdminLayout() {
  const { t, dir } = useI18n();
  const { admin, logout } = useHealthAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900" dir={dir}>
      <HealthAdminToastStack />
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 z-40 w-72 max-w-[85vw] border-e border-slate-200 bg-white shadow-lg transition-transform lg:static lg:translate-x-0 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4">
            <span className="text-sm font-black text-emerald-800">{t('admin.hsvc.brand')}</span>
            <button type="button" className="lg:hidden text-slate-500" onClick={() => setMenuOpen(false)}>
              ✕
            </button>
          </div>
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
            <NavLink to="/healthservices/admin" end className={navClass} onClick={() => setMenuOpen(false)}>
              {t('admin.hsvc.dashboard')}
            </NavLink>

            <NavGroup title={t('admin.hsvc.contentGroup')}>
              <NavLink to="/healthservices/admin/news" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navNews')}
              </NavLink>
              <NavLink to="/healthservices/admin/services" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navServices')}
              </NavLink>
              <NavLink to="/healthservices/admin/programs" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navPrograms')}
              </NavLink>
              <NavLink to="/healthservices/admin/library" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navLibrary')}
              </NavLink>
              <NavLink to="/healthservices/admin/live" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navLive')}
              </NavLink>
              <NavLink to="/healthservices/admin/homepage" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navHomepage')}
              </NavLink>
              <NavLink to="/healthservices/admin/settings" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navSettings')}
              </NavLink>
              <NavLink to="/healthservices/admin/i18n" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navI18n')}
              </NavLink>
            </NavGroup>

            <NavGroup title={t('admin.hsvc.directoriesGroup')}>
              <NavLink to="/healthservices/admin/pharmacies" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navPharmacies')}
              </NavLink>
              <NavLink to="/healthservices/admin/hospitals" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navHospitals')}
              </NavLink>
              <NavLink to="/healthservices/admin/international-hospitals" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navIntlHospitals')}
              </NavLink>
              <NavLink to="/healthservices/admin/ambulances" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navAmbulances')}
              </NavLink>
              <NavLink to="/healthservices/admin/accommodations" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navAccommodations')}
              </NavLink>
            </NavGroup>

            <NavGroup title={t('admin.hsvc.consultGroup')}>
              <NavLink to="/healthservices/admin/consultations/specialties" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navSpec')}
              </NavLink>
              <NavLink to="/healthservices/admin/consultations/doctors" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navDoctors')}
              </NavLink>
              <NavLink to="/healthservices/admin/consultations/bookings" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navBookings')}
              </NavLink>
            </NavGroup>

            <NavGroup title={t('admin.hsvc.donateGroup')}>
              <NavLink to="/healthservices/admin/donations/campaigns" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navCamp')}
              </NavLink>
              <NavLink to="/healthservices/admin/donations/intents" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navIntents')}
              </NavLink>
            </NavGroup>

            <NavGroup title={t('admin.hsvc.messagesGroup')}>
              <NavLink to="/healthservices/admin/messages" className={navClass} onClick={() => setMenuOpen(false)}>
                {t('admin.hsvc.navMessages')}
              </NavLink>
            </NavGroup>
          </nav>
        </aside>

        {menuOpen ? (
          <button type="button" className="fixed inset-0 z-30 bg-black/30 lg:hidden" aria-label={t('admin.hsvc.closeMenu')} onClick={() => setMenuOpen(false)} />
        ) : null}

        <div className="flex flex-1 flex-col min-w-0 lg:ms-0">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 backdrop-blur px-4">
            <button
              type="button"
              className="lg:hidden rounded-lg border border-slate-200 px-2 py-1 text-sm font-bold"
              onClick={() => setMenuOpen(true)}
            >
              {t('admin.hsvc.menuOpen')}
            </button>
            <div className="flex-1 min-w-0" />
            <div className="hidden sm:flex flex-col items-end text-xs text-slate-600">
              <span className="font-bold text-slate-900 truncate max-w-[200px]">{admin?.full_name || admin?.username}</span>
              <span>
                {t('admin.hsvc.roleLabel')}: {admin?.role}
              </span>
            </div>
            <Link to={servicesPath('/')} className="text-sm font-bold text-emerald-700 hover:underline whitespace-nowrap">
              {t('admin.hsvc.backPublic')}
            </Link>
            <button type="button" onClick={() => void logout()} className="text-sm font-bold text-slate-600 hover:text-red-600">
              {t('admin.hsvc.logout')}
            </button>
          </header>
          <main className="flex-1 p-4 md:p-6 max-w-6xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
