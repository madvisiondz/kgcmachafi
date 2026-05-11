import { Routes, Route } from 'react-router-dom';
import DocumentTitle from './components/DocumentTitle.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
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

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <DocumentTitle />
      <Header />
      {/* Spacer so page content never goes under the fixed/collapsing header */}
      <div aria-hidden="true" style={{ height: 'var(--app-header-height, 0px)' }} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutContactPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/service" element={<ServicesPage />} />
          <Route path="/donations" element={<DonationsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/pharmacies" element={<PharmaciesPage />} />
          <Route path="/ambulances" element={<AmbulancesPage />} />
          <Route path="/accommodations" element={<AccommodationsPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/consultations" element={<ConsultationsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
