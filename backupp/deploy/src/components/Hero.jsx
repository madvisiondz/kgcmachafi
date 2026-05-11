import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/contexts/SiteContentContext';
import { statIcons } from '@/lib/siteContentIcons';

const defaultHero = {
  badge: '🏥 صحتك أولويتنا',
  title_start: 'مشافي',
  title_end: 'المنصة الصحية الشاملة',
  description: 'قناة صحية احترافية تقدم بث مباشر، استشارات طبية، خدمات اجتماعية، وباب التبرعات للمرضى المحتاجين على مدار الساعة.',
  image_url: 'https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3',
};

const Hero = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { settings, hero_stats } = useSiteContent();
  const hero = { ...defaultHero, ...(settings.hero_content || {}) };
  const stats = hero_stats.length > 0 ? hero_stats : [
    { id: 1, icon_key: 'users', label: 'مشاهد نشط', value: '50K+', color_class: 'from-green-500 to-emerald-600' },
    { id: 2, icon_key: 'calendar', label: 'برنامج صحي', value: '24/7', color_class: 'from-blue-500 to-cyan-600' },
    { id: 3, icon_key: 'heart', label: 'حالة مساعدة', value: '1000+', color_class: 'from-red-500 to-pink-600' },
  ];

  return (
    <section id="home" className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20 overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwZDRhYSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-start"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full"
            >
              <span className="text-green-700 font-semibold">{hero.badge}</span>
            </motion.div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {hero.title_start}
              </span>
              <br />
              <span className="text-gray-800">{hero.title_end}</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {hero.description}
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button onClick={() => navigate('/live')} size="lg" className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <Play className="w-5 h-5" />
                {t('common.watchLive')}
              </Button>
              <Button
                onClick={() => navigate('/service')}
                size="lg"
                variant="outline"
                className="gap-2 border-2 border-green-600 text-green-600 hover:bg-green-50 text-lg px-8"
              >
                {t('common.discoverServices')}
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
              {stats.map((stat, index) => {
                const IconComponent = statIcons[stat.icon_key] || statIcons.users;

                return (
                  <motion.div
                    key={stat.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color_class} flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-start">
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <img className="w-full h-96 object-cover rounded-2xl" alt="Medical team providing healthcare services" src={hero.image_url} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
