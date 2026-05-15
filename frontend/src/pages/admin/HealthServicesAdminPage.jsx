import React, { Suspense, lazy } from 'react';
import '../../styles/healthAdminTheme.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import CrudResourcePage from '../../components/admin/healthservices/CrudResourcePage';
import { HealthAdminAuthProvider } from './healthservices/HealthAdminAuthContext';
import { HealthAdminToastProvider } from './healthservices/HealthAdminToastContext';
import RequireHealthAdmin from './healthservices/RequireHealthAdmin';
import {
  newsCrud,
  pharmaciesCrud,
  hospitalsCrud,
  intlHospitalsCrud,
  ambulancesCrud,
  accommodationsCrud,
  servicesCrud,
  programsCrud,
  booksCrud,
  consultationSpecialtiesCrud,
  consultationDoctorsCrud,
} from './healthservices/healthAdminCrudConfigs';

const AdminLayout = lazy(() => import('./healthservices/AdminLayout.jsx'));
const LoginPage = lazy(() => import('./healthservices/LoginPage.jsx'));
const DashboardPage = lazy(() => import('./healthservices/DashboardPage.jsx'));
const SettingsPage = lazy(() => import('./healthservices/SettingsPage.jsx'));
const LiveAdminPage = lazy(() => import('./healthservices/LiveAdminPage.jsx'));
const HomepageAdminPage = lazy(() => import('./healthservices/HomepageAdminPage.jsx'));
const DonationCampaignsAdminPage = lazy(() => import('./healthservices/DonationCampaignsAdminPage.jsx'));
const MessagesAdminPage = lazy(() => import('./healthservices/MessagesAdminPage.jsx'));
const BookingsAdminPage = lazy(() => import('./healthservices/BookingsAdminPage.jsx'));
const IntentsAdminPage = lazy(() => import('./healthservices/IntentsAdminPage.jsx'));
const I18nDbPage = lazy(() => import('./healthservices/I18nDbPage.jsx'));

function AdminFallback() {
  return (
    <div className="hsvc-admin-root hsvc-admin-bg machafi-subtle-emerald-bg machafi-soft-grid flex min-h-[40vh] items-center justify-center text-sm font-semibold text-emerald-400/80">
      Loading admin…
    </div>
  );
}

export default function HealthServicesAdminPage() {
  return (
    <HealthAdminAuthProvider>
      <HealthAdminToastProvider>
        <Suspense fallback={<AdminFallback />}>
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route element={<RequireHealthAdmin />}>
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="news" element={<CrudResourcePage {...newsCrud} />} />
                <Route path="pharmacies" element={<CrudResourcePage {...pharmaciesCrud} />} />
                <Route path="hospitals" element={<CrudResourcePage {...hospitalsCrud} />} />
                <Route path="international-hospitals" element={<CrudResourcePage {...intlHospitalsCrud} />} />
                <Route path="ambulances" element={<CrudResourcePage {...ambulancesCrud} />} />
                <Route path="accommodations" element={<CrudResourcePage {...accommodationsCrud} />} />
                <Route path="services" element={<CrudResourcePage {...servicesCrud} />} />
                <Route path="programs" element={<CrudResourcePage {...programsCrud} />} />
                <Route path="library" element={<CrudResourcePage {...booksCrud} />} />
                <Route path="live" element={<LiveAdminPage />} />
                <Route path="homepage" element={<HomepageAdminPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="i18n" element={<I18nDbPage />} />
                <Route path="consultations/specialties" element={<CrudResourcePage {...consultationSpecialtiesCrud} />} />
                <Route path="consultations/doctors" element={<CrudResourcePage {...consultationDoctorsCrud} />} />
                <Route path="consultations/bookings" element={<BookingsAdminPage />} />
                <Route path="donations/campaigns" element={<DonationCampaignsAdminPage />} />
                <Route path="donations/intents" element={<IntentsAdminPage />} />
                <Route path="messages" element={<MessagesAdminPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/healthservices/admin" replace />} />
          </Routes>
        </Suspense>
      </HealthAdminToastProvider>
    </HealthAdminAuthProvider>
  );
}
