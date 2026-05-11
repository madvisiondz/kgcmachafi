import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default to Arabic ('ar') for full Arabization
  const [language, setLanguage] = useState('ar');

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Force body class for potential font overrides
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.remove('font-arabic');
      document.body.classList.add('font-sans');
    }
  }, [language]);

  const t = (path) => {
    const keys = path.split('.');
    let current = translations[language];
    
    if (!current) {
        // Fallback to Arabic if language is not found
        current = translations['ar'];
    }

    for (const key of keys) {
      if (current[key] === undefined) {
        // Try to find in Arabic fallback if missing in current language
        if (language !== 'ar') {
             let fallback = translations['ar'];
             for (const k of keys) {
                 if (fallback[k] === undefined) return path;
                 fallback = fallback[k];
             }
             return fallback;
        }
        return path;
      }
      current = current[key];
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};