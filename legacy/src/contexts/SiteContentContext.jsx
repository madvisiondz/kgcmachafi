import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { contentApi } from '@/lib/localApi';
import { useLanguage } from '@/contexts/LanguageContext';

const SiteContentContext = createContext(undefined);

export const SiteContentProvider = ({ children }) => {
  const { language } = useLanguage();
  const [siteContent, setSiteContent] = useState({
    settings: {},
    hero_stats: [],
    services: [],
    video_programs: [],
    consultation_specialties: [],
    consultation_doctors: [],
  });
  const [loading, setLoading] = useState(true);

  const loadSiteContent = async () => {
    setLoading(true);
    try {
      const response = await contentApi.getSiteContent({ lang: language });
      setSiteContent({
        settings: response.settings || {},
        hero_stats: response.hero_stats || [],
        services: response.services || [],
        video_programs: response.video_programs || [],
        consultation_specialties: response.consultation_specialties || [],
        consultation_doctors: response.consultation_doctors || [],
      });
    } catch (error) {
      console.error('Failed to load site content', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSiteContent();
  }, [language]);

  const value = useMemo(() => {
    return {
      ...siteContent,
      loading,
      refreshSiteContent: loadSiteContent,
    };
  }, [loading, siteContent]);

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }

  return context;
};
