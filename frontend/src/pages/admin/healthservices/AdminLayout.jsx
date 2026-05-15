import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useI18n } from '../../../i18n/I18nProvider';
import { servicesPath } from '../../../routes/paths';
import { useHealthAdminAuth } from './HealthAdminAuthContext';
import HealthAdminToastStack from '../../../components/admin/healthservices/HealthAdminToastStack';
import {
  IconDashboard,
  IconFolder,
  IconHeart,
  IconMail,
  IconNews,
  IconSettings,
} from '../../../components/admin/healthservices/AdminNavIcons';
import * as ui from '../../../components/admin/healthservices/adminUiClasses';

function NavGroup({ title, children }) {
  return (
    <div className="space-y-1">
      <p className={ui.navGroupTitle}>{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({ to, end, icon, label, onNavigate }) {
  return (
    <NavLink to={to} end={end} className={ui.navLink} onClick={onNavigate}>
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default function AdminLayout() {
  const { t, dir } = useI18n();
  const { admin, logout } = useHealthAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const initials = (admin?.full_name || admin?.username || 'A').slice(0, 2).toUpperCase();

  const sidebarPos =
    dir === 'rtl'
      ? menuOpen
        ? 'translate-x-0'
        : 'translate-x-full lg:translate-x-0'
      : menuOpen
        ? 'translate-x-0'
        : '-translate-x-full lg:translate-x-0';

  return (
    <div className={ui.shell} dir={dir}>
      <HealthAdminToastStack />
      <div className="flex min-h-screen">
        <aside
          className={`${ui.sidebar} ${sidebarPos} ${dir === 'rtl' ? 'right-0 border-s border-e-0' : 'left-0'}`}
        >
          <div className="flex h-16 items-center justify-between border-b border-emerald-500/15 px-4">
            <div>
              <p className={ui.sidebarBrand}>{t('admin.hsvc.brand')}</p>
              <p className={ui.sidebarSub}>{t('admin.hsvc.controlCenter')}</p>
            </div>
            <button
              type="button"
              className="lg:hidden rounded-lg p-2 text-slate-300 hover:bg-emerald-950/50 hover:text-white"
              aria-label={t('admin.hsvc.closeMenu')}
              onClick={close}
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 space-y-4 overflow-y-auto p-3 max-h-[calc(100vh-4rem)]">
            <NavItem to="/healthservices/admin" end icon={<IconDashboard />} label={t('admin.hsvc.dashboard')} onNavigate={close} />

            <NavGroup title={t('admin.hsvc.contentGroup')}>
              <NavItem to="/healthservices/admin/news" icon={<IconNews />} label={t('admin.hsvc.navNews')} onNavigate={close} />
              <NavItem to="/healthservices/admin/services" icon={<IconHeart />} label={t('admin.hsvc.navServices')} onNavigate={close} />
              <NavItem to="/healthservices/admin/programs" icon={<IconFolder />} label={t('admin.hsvc.navPrograms')} onNavigate={close} />
              <NavItem to="/healthservices/admin/library" icon={<IconFolder />} label={t('admin.hsvc.navLibrary')} onNavigate={close} />
              <NavItem to="/healthservices/admin/live" icon={<IconFolder />} label={t('admin.hsvc.navLive')} onNavigate={close} />
              <NavItem to="/healthservices/admin/homepage" icon={<IconFolder />} label={t('admin.hsvc.navHomepage')} onNavigate={close} />
              <NavItem to="/healthservices/admin/settings" icon={<IconSettings />} label={t('admin.hsvc.navSettings')} onNavigate={close} />
              <NavItem to="/healthservices/admin/i18n" icon={<IconSettings />} label={t('admin.hsvc.navI18n')} onNavigate={close} />
            </NavGroup>

            <NavGroup title={t('admin.hsvc.directoriesGroup')}>
              <NavItem to="/healthservices/admin/pharmacies" icon={<IconFolder />} label={t('admin.hsvc.navPharmacies')} onNavigate={close} />
              <NavItem to="/healthservices/admin/hospitals" icon={<IconHeart />} label={t('admin.hsvc.navHospitals')} onNavigate={close} />
              <NavItem
                to="/healthservices/admin/international-hospitals"
                icon={<IconHeart />}
                label={t('admin.hsvc.navIntlHospitals')}
                onNavigate={close}
              />
              <NavItem to="/healthservices/admin/ambulances" icon={<IconFolder />} label={t('admin.hsvc.navAmbulances')} onNavigate={close} />
              <NavItem to="/healthservices/admin/accommodations" icon={<IconFolder />} label={t('admin.hsvc.navAccommodations')} onNavigate={close} />
            </NavGroup>

            <NavGroup title={t('admin.hsvc.consultGroup')}>
              <NavItem to="/healthservices/admin/consultations/specialties" icon={<IconFolder />} label={t('admin.hsvc.navSpec')} onNavigate={close} />
              <NavItem to="/healthservices/admin/consultations/doctors" icon={<IconFolder />} label={t('admin.hsvc.navDoctors')} onNavigate={close} />
              <NavItem to="/healthservices/admin/consultations/bookings" icon={<IconMail />} label={t('admin.hsvc.navBookings')} onNavigate={close} />
            </NavGroup>

            <NavGroup title={t('admin.hsvc.donateGroup')}>
              <NavItem to="/healthservices/admin/donations/campaigns" icon={<IconHeart />} label={t('admin.hsvc.navCamp')} onNavigate={close} />
              <NavItem to="/healthservices/admin/donations/intents" icon={<IconFolder />} label={t('admin.hsvc.navIntents')} onNavigate={close} />
            </NavGroup>

            <NavGroup title={t('admin.hsvc.messagesGroup')}>
              <NavItem to="/healthservices/admin/messages" icon={<IconMail />} label={t('admin.hsvc.navMessages')} onNavigate={close} />
            </NavGroup>
          </nav>
        </aside>

        {menuOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            aria-label={t('admin.hsvc.closeMenu')}
            onClick={close}
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className={ui.topBar}>
            <button type="button" className={`${ui.btnGhost} lg:hidden !py-2 !px-3`} onClick={() => setMenuOpen(true)}>
              {t('admin.hsvc.menuOpen')}
            </button>
            <div className="flex-1 min-w-0" />
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-black text-white">
                {initials}
              </div>
              <div className="text-end text-xs">
                <p className="max-w-[180px] truncate font-bold text-white">{admin?.full_name || admin?.username}</p>
                <p className="text-slate-300">
                  {t('admin.hsvc.roleLabel')}: {admin?.role}
                </p>
              </div>
            </div>
            <Link to={servicesPath('/')} className={`${ui.btnGhost} whitespace-nowrap !py-2 text-xs`} target="_blank" rel="noreferrer">
              {t('admin.hsvc.backPublic')}
            </Link>
            <button type="button" onClick={() => void logout()} className={`${ui.btnDanger} !py-2 text-xs`}>
              {t('admin.hsvc.logout')}
            </button>
          </header>
          <main className={ui.main}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
