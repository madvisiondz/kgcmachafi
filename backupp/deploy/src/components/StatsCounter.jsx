import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, UserCheck, Shield, Briefcase, PenTool, Wrench, UserCog, Newspaper, Headphones } from 'lucide-react';
import { fetchSiteStats, ROLE_LABELS } from '@/lib/roles-service';
import { useLanguage } from '@/contexts/LanguageContext';

const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
};

const StatsCounter = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchSiteStats();
      if (data) setStats(data);
    };
    loadStats();
  }, []);

  if (!stats) return null;

  const statItems = [
    {
      id: 'visitors',
      label: t('stats.visitors') || 'الزوار النشطين',
      value: stats.visitors || 12450,
      icon: Eye,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'subscribers',
      label: t('stats.subscribers') || 'المشتركين',
      value: stats.subscribers || 850,
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'registered',
      label: t('stats.registered') || 'المسجلين',
      value: stats.registered || 320,
      icon: UserCheck,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  // Calculate staff counts from the json object
  const staffCounts = stats.staff || {};
  
  // Updated Staff Items with new roles
  const staffItems = [
    { role: 'manager', icon: Shield, label: ROLE_LABELS.manager, color: 'text-red-600' },
    { role: 'consultant', icon: UserCog, label: ROLE_LABELS.consultant, color: 'text-indigo-600' }, // New
    { role: 'news_manager', icon: Newspaper, label: ROLE_LABELS.news_manager, color: 'text-cyan-600' }, // New
    { role: 'support_manager', icon: Headphones, label: ROLE_LABELS.support_manager, color: 'text-pink-600' }, // New
    { role: 'editor', icon: PenTool, label: ROLE_LABELS.editor, color: 'text-green-600' },
    { role: 'technician', icon: Wrench, label: ROLE_LABELS.technician, color: 'text-orange-600' },
    { role: 'supervisor', icon: Briefcase, label: ROLE_LABELS.supervisor, color: 'text-blue-600' },
  ];

  return (
    <div className="py-12 bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {statItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${item.color}`}>
                <item.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900">
                  <CountUp end={item.value} />
                </h3>
                <p className="text-gray-600 font-medium">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Staff Stats with New Roles */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/10 pb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-yellow-500" />
              {t('stats.staff') || 'طاقم الإدارة والعمل'}
            </h3>
            <span className="text-gray-400 text-sm">فريق عمل متكامل لخدمتكم 24/7</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {staffItems.map((item, index) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
              >
                <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 mb-3 transition-colors">
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <span className="text-2xl font-bold mb-1">
                  <CountUp end={staffCounts[item.role] || 0} />
                </span>
                <span className="text-xs text-gray-400 text-center font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;