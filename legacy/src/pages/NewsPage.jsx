import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Globe, RefreshCw, Filter, Search, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { NEWS_AGENCIES, fetchNewsFromAgency, fetchAllNews } from '@/lib/news-service';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const NewsPage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedAgency, setSelectedAgency] = useState('all');
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial load
  useEffect(() => {
    loadNews('all');
  }, []);

  const loadNews = async (agencyId) => {
    setLoading(true);
    setSelectedAgency(agencyId);
    try {
      let data;
      if (agencyId === 'all') {
        data = await fetchAllNews();
      } else {
        data = await fetchNewsFromAgency(agencyId);
      }
      setNewsItems(data);
      
      if (agencyId !== 'all') {
        toast({
          title: t('common.loading'),
          description: `تم تحديث الأخبار من المصدر: ${NEWS_AGENCIES.find(a => a.id === agencyId)?.name}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: "فشل الاتصال بوكالة الأنباء. يرجى المحاولة لاحقاً.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = newsItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isRtl = language === 'ar';

  return (
    <div className="container mx-auto px-4 py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
               {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-8 h-8 text-blue-600" />
              {t('news.pageTitle')}
            </h1>
          </div>
          <p className="text-gray-600">{t('news.pageSubtitle')}</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={t('news.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
          />
        </div>
      </div>

      {/* Agency Filters */}
      <div className="flex flex-wrap gap-3 mb-8 pb-4 border-b border-gray-100">
        <Button
          variant={selectedAgency === 'all' ? 'default' : 'outline'}
          onClick={() => loadNews('all')}
          className={`gap-2 ${selectedAgency === 'all' ? 'bg-blue-600' : ''}`}
        >
          <Filter className="w-4 h-4" />
          {t('news.allSources')}
        </Button>
        
        {NEWS_AGENCIES.map((agency) => (
          <Button
            key={agency.id}
            variant={selectedAgency === agency.id ? 'default' : 'outline'}
            onClick={() => loadNews(agency.id)}
            className={`gap-2 transition-all ${selectedAgency === agency.id ? agency.color + ' text-white border-transparent' : 'hover:bg-gray-50'}`}
          >
            <span>{agency.icon}</span>
            {agency.name}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => loadNews(selectedAgency)}
          disabled={loading}
          className="mr-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-64 animate-pulse shadow-sm border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.length > 0 ? (
            filteredNews.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col group"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      item.source === 'APS' ? 'bg-green-100 text-green-800' :
                      item.source === 'SPA' ? 'bg-emerald-100 text-emerald-800' :
                      item.source === 'Reuters' ? 'bg-orange-100 text-orange-800' :
                      item.source === 'AFP' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.source || t('app.title')}
                    </span>
                    <span className="text-gray-400 text-xs">{item.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed flex-grow">
                    {item.desc}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      #{item.tag}
                    </span>
                    <Link to={`/news/${item.id}`}>
                      <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800 gap-1">
                        {t('common.readMore')}
                        {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">لا توجد أخبار</h3>
              <p className="text-gray-500">جرب تغيير مصادر البحث أو كلمات البحث</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsPage;