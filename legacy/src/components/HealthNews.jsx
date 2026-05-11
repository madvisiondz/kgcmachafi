import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, Tag, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { fetchAllNews } from '@/lib/news-service';

const HealthNews = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentNews = async () => {
      try {
        const data = await fetchAllNews();
        setNewsItems(data.slice(0, 3)); // Show top 3 recent news
      } catch (error) {
        console.error("Failed to load news", error);
      } finally {
        setLoading(false);
      }
    };
    loadRecentNews();
  }, []);

  return (
    <section className="py-12 bg-white rounded-2xl shadow-sm border border-slate-100 px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Newspaper className="w-8 h-8 text-blue-600" />
            {t('news.title')}
          </h2>
          <p className="text-gray-600 text-lg">{t('news.subtitle')}</p>
        </div>
        <Link to="/news">
          <Button variant="outline" className="gap-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50">
            {t('common.readMore')}
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir={isRtl ? 'rtl' : 'ltr'}>
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                 <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                   <Tag className="w-3 h-3" />
                   {item.tag}
                 </span>
                 <span className="text-gray-500 text-xs flex items-center gap-1">
                   <Calendar className="w-3 h-3" />
                   {item.date}
                 </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 min-h-[3.5rem]">
                {item.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed flex-grow">
                {item.desc}
              </p>
              
              {/* Active Read More Button Linking to Dynamic Detail Page */}
              <Link to={`/news/${item.id}`} className="mt-auto">
                <Button variant="link" className="p-0 h-auto justify-start text-blue-600 font-semibold hover:text-blue-800">
                  {t('common.readMore')} &rarr;
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HealthNews;