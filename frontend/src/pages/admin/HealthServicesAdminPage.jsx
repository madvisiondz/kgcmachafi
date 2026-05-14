import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import CrudResourcePage from '../../components/admin/healthservices/CrudResourcePage';
import { HealthAdminAuthProvider } from './healthservices/HealthAdminAuthContext';
import { HealthAdminToastProvider } from './healthservices/HealthAdminToastContext';
import RequireHealthAdmin from './healthservices/RequireHealthAdmin';
import AdminLayout from './healthservices/AdminLayout';
import LoginPage from './healthservices/LoginPage';
import DashboardPage from './healthservices/DashboardPage';
import SettingsPage from './healthservices/SettingsPage';
import LiveAdminPage from './healthservices/LiveAdminPage';
import HomepageAdminPage from './healthservices/HomepageAdminPage';
import DonationCampaignsAdminPage from './healthservices/DonationCampaignsAdminPage';
import MessagesAdminPage from './healthservices/MessagesAdminPage';
import BookingsAdminPage from './healthservices/BookingsAdminPage';
import IntentsAdminPage from './healthservices/IntentsAdminPage';
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

export default function HealthServicesAdminPage() {
  return (
    <HealthAdminAuthProvider>
      <HealthAdminToastProvider>
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
      </HealthAdminToastProvider>
    </HealthAdminAuthProvider>
  );
}
