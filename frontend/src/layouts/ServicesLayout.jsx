import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

/**
 * Chrome for Machafi Services — same header/footer as before, nested under /healthservices/*.
 */
export default function ServicesLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div aria-hidden="true" style={{ height: 'var(--app-header-height, 0px)' }} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
