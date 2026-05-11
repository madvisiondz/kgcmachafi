import React, { createContext, useContext, useEffect, useState } from 'react';
import { contentApi } from '@/lib/localApi';

const SiteContentContext = createContext(undefined);

export const SiteContentProvider = ({ children }) => {
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
      const response = await contentApi.getSiteContent();
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
  }, []);

  return (
    <SiteContentContext.Provider value={{ ...siteContent, loading, refreshSiteContent: loadSiteContent }}>
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
