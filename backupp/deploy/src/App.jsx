import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UrgentNewsBanner from '@/components/UrgentNewsBanner'; 
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import HomePage from '@/pages/HomePage';
import NewsPage from '@/pages/NewsPage';
import NewsDetailPage from '@/pages/NewsDetailPage';
import NewsArchivePage from '@/pages/NewsArchivePage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import AdminPage from '@/pages/AdminPage';
import LivePage from '@/pages/LivePage';
import ProgramsPage from '@/pages/ProgramsPage';
import ServicesPage from '@/pages/ServicesPage';
import LibraryPage from '@/pages/LibraryPage';
import PharmaciesPage from '@/pages/PharmaciesPage';
import AmbulancesPage from '@/pages/AmbulancesPage';
import AccommodationsPage from '@/pages/AccommodationsPage';
import HospitalsPage from '@/pages/HospitalsPage';
import ConsultationsPage from '@/pages/ConsultationsPage';
import DonationsPage from '@/pages/DonationsPage';
import ScrollToTop from '@/components/ScrollToTop';
import PageTransition from '@/components/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="*"
          element={
            <>
              <UrgentNewsBanner />
              <Header />
              <main className="flex-grow">
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/live" element={<LivePage />} />
                    <Route path="/programs" element={<ProgramsPage />} />
                    <Route path="/service" element={<ServicesPage />} />
                    <Route path="/library" element={<LibraryPage />} />
                    <Route path="/pharmacies" element={<PharmaciesPage />} />
                    <Route path="/ambulances" element={<AmbulancesPage />} />
                    <Route path="/accommodations" element={<AccommodationsPage />} />
                    <Route path="/hospitals" element={<HospitalsPage />} />
                    <Route path="/consultations" element={<ConsultationsPage />} />
                    <Route path="/donations" element={<DonationsPage />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/news/archive" element={<NewsArchivePage />} />
                    <Route path="/news/:id" element={<NewsDetailPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                  </Routes>
                </PageTransition>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { t } = useLanguage();

  return (
    <Router>
      <ScrollToTop />
      <Helmet>
        <title>{t('app.title')}</title>
        <meta name="description" content={t('app.description')} />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={t('app.title')} />
        <meta property="og:description" content={t('app.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        {/* Replace with your default image URL, or dynamically set per page */}
        <meta property="og:image" content="https://your-website.com/default-share-image.jpg" /> 
        <meta property="og:image:alt" content={t('app.image_alt')} />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('app.title')} />
        <meta name="twitter:description" content={t('app.description')} />
        {/* Replace with your default image URL, or dynamically set per page */}
        <meta name="twitter:image" content="https://your-website.com/default-share-image.jpg" />

        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5400522311718555" crossOrigin="anonymous"></script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col">
        <AnimatedRoutes />
        
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
