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

  return (
    <div
      className="relative bg-blue-700 text-white py-3 overflow-hidden z-[60] border-b border-blue-800 shadow-md"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 bottom-0 right-0 z-20 bg-blue-800 px-4 flex items-center shadow-lg">
        <span className="font-bold text-xs md:text-sm whitespace-nowrap flex items-center gap-2 text-yellow-400 animate-pulse">
          <Globe className="w-4 h-4" />
          {t('common.urgentNews')}
        </span>
      </div>

      <div className="container mx-auto flex items-center overflow-hidden relative h-6">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100vw' }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 40,
            ease: 'linear',
          }}
          className="whitespace-nowrap absolute flex items-center will-change-transform"
        >
          <span className="font-bold text-base md:text-lg inline-block px-4 tracking-wide text-white drop-shadow-md">
            {content}
            <span className="mx-8 text-blue-400">✦</span>
            {content}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default UrgentNewsBanner;
