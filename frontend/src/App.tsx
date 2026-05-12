import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import DocumentTitle from './components/DocumentTitle.jsx';
import GatewayPage from './pages/GatewayPage.jsx';
import ServicesLayout from './layouts/ServicesLayout.jsx';
import TvShellLayout from './layouts/TvShellLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import PharmaciesPage from './pages/PharmaciesPage.jsx';
import AmbulancesPage from './pages/AmbulancesPage.jsx';
import AccommodationsPage from './pages/AccommodationsPage.jsx';
import ProgramsPage from './pages/ProgramsPage.jsx';
import HospitalsPage from './pages/HospitalsPage.jsx';
import ConsultationsPage from './pages/ConsultationsPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import DonationsPage from './pages/DonationsPage.jsx';
import NewsPage from './pages/NewsPage.jsx';
import NewsDetailPage from './pages/NewsDetailPage.jsx';
import LivePage from './pages/LivePage.jsx';
import AboutContactPage from './pages/AboutContactPage.jsx';
import TvHomePage from './pages/tv/TvHomePage.jsx';
import TvLivePage from './pages/tv/TvLivePage.jsx';
import TvSchedulePage from './pages/tv/TvSchedulePage.jsx';
import TvArticlePage from './pages/tv/TvArticlePage.jsx';
import TvDeskPage from './pages/tv/TvDeskPage.jsx';
import TvActivityPage from './pages/tv/TvActivityPage.jsx';
import TvTopicPage from './pages/tv/TvTopicPage.jsx';
import TvSearchPage from './pages/tv/TvSearchPage.jsx';
import HealthServicesAdminPage from './pages/admin/HealthServicesAdminPage.jsx';
import MachafiTvAdminPage from './pages/admin/MachafiTvAdminPage.jsx';
import { servicesPath } from './routes/paths';

function LegacyNewsDetailRedirect() {
  const { id } = useParams();
  return <Navigate to={`${servicesPath('/news')}/${encodeURIComponent(id ?? '')}`} replace />;
}

export default function App() {
  return (
    <>
      <DocumentTitle />
      <Routes>
        <Route path="/" element={<GatewayPage />} />

        <Route path="/healthservices/admin/*" element={<HealthServicesAdminPage />} />
        <Route path="/machafitv/admin/*" element={<MachafiTvAdminPage />} />

        <Route path="/tv/:edition" element={<TvShellLayout />}>
          <Route index element={<TvHomePage />} />
          <Route path="desk" element={<TvDeskPage />} />
          <Route path="activity" element={<TvActivityPage />} />
          <Route path="topics/:topicId" element={<TvTopicPage />} />
          <Route path="search" element={<TvSearchPage />} />
          <Route path="live" element={<TvLivePage />} />
          <Route path="schedule" element={<TvSchedulePage />} />
          <Route path="article/:slug" element={<TvArticlePage />} />
        </Route>

        <Route path="/healthservices" element={<ServicesLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutContactPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="service" element={<ServicesPage />} />
          <Route path="donations" element={<DonationsPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:id" element={<NewsDetailPage />} />
          <Route path="live" element={<LivePage />} />
          <Route path="pharmacies" element={<PharmaciesPage />} />
          <Route path="ambulances" element={<AmbulancesPage />} />
          <Route path="accommodations" element={<AccommodationsPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="hospitals" element={<HospitalsPage />} />
          <Route path="consultations" element={<ConsultationsPage />} />
          <Route path="*" element={<Navigate to="/healthservices" replace />} />
        </Route>

        <Route path="/about" element={<Navigate to="/healthservices/about" replace />} />
        <Route path="/library" element={<Navigate to="/healthservices/library" replace />} />
        <Route path="/service" element={<Navigate to="/healthservices/service" replace />} />
        <Route path="/donations" element={<Navigate to="/healthservices/donations" replace />} />
        <Route path="/news" element={<Navigate to="/healthservices/news" replace />} />
        <Route path="/news/:id" element={<LegacyNewsDetailRedirect />} />
        <Route path="/live" element={<Navigate to="/healthservices/live" replace />} />
        <Route path="/pharmacies" element={<Navigate to="/healthservices/pharmacies" replace />} />
        <Route path="/ambulances" element={<Navigate to="/healthservices/ambulances" replace />} />
        <Route path="/accommodations" element={<Navigate to="/healthservices/accommodations" replace />} />
        <Route path="/programs" element={<Navigate to="/healthservices/programs" replace />} />
        <Route path="/hospitals" element={<Navigate to="/healthservices/hospitals" replace />} />
        <Route path="/consultations" element={<Navigate to="/healthservices/consultations" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
