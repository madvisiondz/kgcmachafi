import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { SiteContentProvider } from '@/contexts/SiteContentContext';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <LanguageProvider>
      <SiteContentProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SiteContentProvider>
    </LanguageProvider>
  </>
);
