import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchNewsById } from '@/lib/news-service';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar, Tag, Globe, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const NewsDetailPage = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const item = await fetchNewsById(id);
        setNewsItem(item);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: newsItem.title,
        text: newsItem.desc,
        url: window.location.href,
      });
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{t('common.error')}</h2>
        <Link to="/news">
          <Button>{t('news.title')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
      dir="rtl"
    >
      <Link to="/news" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        {isRtl ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
        {t('news.title')}
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {newsItem.tag}
          </span>
          <span className="text-gray-500 text-sm flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {newsItem.date}
          </span>
          <span className="text-gray-500 text-sm flex items-center gap-1">
            <Globe className="w-4 h-4" />
            {newsItem.source}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
          {newsItem.title}
        </h1>
      </div>

      <div className="flex items-center justify-end border-y border-gray-100 py-4 mb-8">
        <Button variant="ghost" size="sm" className="text-gray-500 gap-2" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          مشاركة
        </Button>
      </div>

      <div className="prose prose-lg max-w-none prose-blue text-gray-700 leading-relaxed whitespace-pre-line">
        <p className="font-semibold text-xl mb-6 text-slate-800">
          {newsItem.desc}
        </p>
        {newsItem.content || newsItem.desc}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <p className="text-sm text-gray-500 text-center">
          {t('common.copyright')}
        </p>
      </div>
    </motion.div>
  );
};

export default NewsDetailPage;
