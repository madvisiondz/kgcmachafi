import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Archive, Calendar, ArrowLeft, ArrowRight, RefreshCw, Search, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { fetchArchivedNews } from '@/lib/news-service';
import { useToast } from '@/components/ui/use-toast';

const NewsArchivePage = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const { toast } = useToast();
  const [archivedNews, setArchivedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadArchive();
  }, []);

  const loadArchive = async () => {
    setLoading(true);
    try {
      const data = await fetchArchivedNews();
      setArchivedNews(data);
    } catch (error) {
      console.error('Failed to load archive', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshArchive = async () => {
    setRefreshing(true);
    await loadArchive();
    setRefreshing(false);
    toast({
      title: 'تم التحديث',
      description: 'تم تحديث بيانات الأرشيف من قاعدة SQL المحلية.',
    });
  };

  const filteredNews = archivedNews.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.desc?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <Link to="/news" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-2 transition-colors">
            {isRtl ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
            {t('news.title') || 'الأخبار'}
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Archive className="w-8 h-8 text-amber-600" />
            {t('news.archiveTitle') || 'أرشيف الأخبار'}
          </h1>
          <p className="text-gray-600 mt-2">تصفح الأخبار والمقالات القديمة المؤرشفة محلياً</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              placeholder="بحث في الأرشيف..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={`w-full pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefreshArchive}
            disabled={refreshing}
            title="تحديث الأرشيف"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="space-y-4">
          {filteredNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-medium">
                    <Archive className="w-3 h-3" />
                    مؤرشف
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 line-clamp-2 mb-4">{item.desc}</p>
                <Link to={`/news/${item.id}`}>
                  <Button variant="link" className="p-0 h-auto text-amber-700 hover:text-amber-900">
                    قراءة المزيد
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">الأرشيف فارغ</h3>
          <p className="text-gray-500 mb-6">لا توجد أخبار مؤرشفة حالياً</p>
          <Button onClick={handleRefreshArchive} disabled={refreshing} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            تحديث القائمة
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewsArchivePage;
