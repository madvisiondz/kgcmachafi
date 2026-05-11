import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { contentApi } from '@/lib/localApi';

/** Renders inside `<Header />` so sticky chrome shares one column; `collapsed` comes from header scroll. */
const UrgentNewsBanner = ({ collapsed = false }) => {
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

  return (
    <div
      className={`relative z-[1] grid min-h-0 transition-[grid-template-rows] duration-200 ease-out ${
        collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
      }`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className={`min-h-0 overflow-hidden ${collapsed ? 'pointer-events-none' : ''}`}>
        <div className="bg-blue-700 text-white border-b border-blue-800 shadow-md">
          <div className="container mx-auto px-3 sm:px-4 py-1.5 sm:py-2">
            <div className="flex items-center gap-3 min-h-0">
              <div className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-blue-800/80 px-2 py-0.5 shadow-sm leading-none">
                <Globe className="w-3.5 h-3.5 text-yellow-300" />
                <span className="font-bold text-[10px] sm:text-xs text-yellow-200">{compactLabel}</span>
              </div>

              <div className="relative h-5 flex-1 overflow-hidden">
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
                  <span className="font-bold text-[11px] sm:text-xs md:text-sm inline-block px-2 tracking-wide text-white drop-shadow-md leading-none">
                    {content}
                    <span className="mx-8 text-blue-300">✦</span>
                    {content}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrgentNewsBanner;
