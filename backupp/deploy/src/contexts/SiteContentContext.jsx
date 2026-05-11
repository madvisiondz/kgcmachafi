import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { contentApi } from '@/lib/localApi';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateDeep } from '@/lib/autoTranslate';

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
  const [localizedContent, setLocalizedContent] = useState(null);
  const [localizing, setLocalizing] = useState(false);

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

  useEffect(() => {
    let cancelled = false;

    const localize = async () => {
      if (language === 'ar') {
        setLocalizedContent(null);
        setLocalizing(false);
        return;
      }

      setLocalizing(true);
      try {
        const translated = await translateDeep(siteContent, { source: 'ar', target: language });
        if (!cancelled) {
          setLocalizedContent(translated);
        }
      } catch (error) {
        if (!cancelled) {
          setLocalizedContent(null);
        }
      } finally {
        if (!cancelled) {
          setLocalizing(false);
        }
      }
    };

    localize();
    return () => {
      cancelled = true;
    };
  }, [language, siteContent]);

  const value = useMemo(() => {
    const effective = language === 'ar' || !localizedContent ? siteContent : localizedContent;
    return {
      ...effective,
      loading,
      localizing,
      refreshSiteContent: loadSiteContent,
    };
  }, [language, localizedContent, loading, localizing, siteContent]);

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
