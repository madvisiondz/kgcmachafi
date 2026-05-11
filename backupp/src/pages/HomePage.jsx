import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Bus as Ambulance, HeartHandshake, Home, Building2, Radio, Stethoscope, Tv, Heart, Pill } from 'lucide-react';
import Hero from '@/components/Hero';
import HealthNews from '@/components/HealthNews';
import HealthInDrama from '@/components/HealthInDrama';
import StatsCounter from '@/components/StatsCounter';
import AdBanner from '@/components/AdBanner';
import { useLanguage } from '@/contexts/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();

  const sectionLinks = [
    { title: t('common.watchLive'), description: 'شاهد البث المباشر والبرامج المسجلة', path: '/live', icon: Radio, color: 'from-red-500 to-rose-600' },
    { title: t('nav.programs'), description: 'اطلع على الشبكة اليومية للبرامج الصحية', path: '/programs', icon: Tv, color: 'from-blue-500 to-cyan-600' },
    { title: t('nav.services'), description: 'اكتشف الخدمات والمساعدات الصحية المتاحة', path: '/service', icon: HeartHandshake, color: 'from-emerald-500 to-green-600' },
    { title: t('nav.library'), description: 'تصفح المكتبة الصحية والمواد التوعوية', path: '/library', icon: BookOpen, color: 'from-indigo-500 to-violet-600' },
    { title: t('nav.pharmacies'), description: 'ابحث عن الصيدليات والمخابر', path: '/pharmacies', icon: Pill, color: 'from-amber-500 to-orange-600' },
    { title: t('nav.ambulances') || 'دليل الإسعاف', description: 'اعثر على وسائل النقل الصحي والإسعاف', path: '/ambulances', icon: Ambulance, color: 'from-rose-500 to-red-600' },
    { title: t('nav.accommodation') || 'إيواء المرضى', description: 'أماكن الإيواء المتاحة للمرضى والمرافقين', path: '/accommodations', icon: Home, color: 'from-sky-500 to-blue-600' },
    { title: t('nav.hospitals'), description: 'مستشفيات ومراكز علاج وخدمات متخصصة', path: '/hospitals', icon: Building2, color: 'from-slate-600 to-slate-800' },
    { title: t('nav.consultations'), description: 'احجز أو تابع الاستشارات الطبية', path: '/consultations', icon: Stethoscope, color: 'from-lime-500 to-emerald-600' },
    { title: t('nav.donations'), description: 'ساهم في دعم المرضى والحملات الإنسانية', path: '/donations', icon: Heart, color: 'from-pink-500 to-rose-600' },
  ];

  return (
    <div className="space-y-16">
      <Hero />

      <div className="container mx-auto px-4">
        <AdBanner slotId="1234567890" />
      </div>

      <StatsCounter />
      <HealthInDrama />
      <HealthNews />

      <section className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">أقسام المنصة</h2>
          <p className="text-lg text-slate-600">كل قسم أصبح له صفحة مستقلة لسهولة التصفح والوصول السريع.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sectionLinks.map((section, index) => (
            <motion.div
              key={section.path}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={section.path} className="block h-full">
                <div className="h-full rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
                    <section.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-slate-600 leading-7">
                    {section.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4">
        <AdBanner slotId="0987654321" />
      </div>
    </div>
  );
};

export default HomePage;
