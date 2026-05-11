import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { contentApi } from '@/lib/localApi';

const UrgentNewsBanner = () => {
  const { t, language } = useLanguage();
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const { items } = await contentApi.listNews({ limit: 10 });
        if (items && items.length > 0) {
          setHeadlines(items.map((item) => `${item.title} ${item.source ? `(${item.source})` : ''}`));
        }
      } catch (error) {
        console.error('Failed to load urgent news', error);
      }
    };

    fetchHeadlines();
  }, []);

  const content = headlines.length > 0 ? headlines.join('  ✦  ') : t('common.urgentNews');
  const compactLabel = t('common.urgentLabel');
  const badgeText = t('common.urgentNewsShort');

  return (
    <div
      className="relative bg-blue-700 text-white py-2 sm:py-3 overflow-hidden z-[60] border-b border-blue-800 shadow-md"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0 inline-flex items-center gap-2 rounded-full bg-blue-800/80 px-3 py-1 shadow-sm">
            <Globe className="w-4 h-4 text-yellow-300" />
            <span className="font-bold text-xs sm:text-sm text-yellow-200">
              {compactLabel}
            </span>
          </div>

          {/* Mobile: readable, no marquee. */}
          <div className="min-w-0 flex-1 sm:hidden">
            <div className="text-xs font-semibold text-white/90 truncate">
              {badgeText}
            </div>
          </div>

          {/* Tablet/Desktop: marquee */}
          <div className="relative h-6 flex-1 overflow-hidden hidden sm:block">
            <motion.div
              initial={{ x: language === 'ar' ? '100%' : '-100%' }}
              animate={{ x: language === 'ar' ? '-100vw' : '100vw' }}
              transition={{
                repeat: Infinity,
                repeatType: 'loop',
                duration: 40,
                ease: 'linear',
              }}
              className="whitespace-nowrap absolute flex items-center will-change-transform"
            >
              <span className="font-bold text-sm md:text-base inline-block px-2 tracking-wide text-white drop-shadow-md">
                {content}
                <span className="mx-8 text-blue-300">✦</span>
                {content}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrgentNewsBanner;
