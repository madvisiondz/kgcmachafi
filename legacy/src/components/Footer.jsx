import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useSiteContent } from '@/contexts/SiteContentContext';

const defaultFooter = {
  brand_name: 'KGC MACHAFI',
  slogan: 'القناة الصحية الاحترافية',
  description: 'قناة صحية احترافية تقدم بث مباشر، استشارات طبية، خدمات اجتماعية، وباب التبرعات للمرضى المحتاجين على مدار الساعة.',
  phone: '+213 2813-3022',
  email: 'info@kgc-machafi.online',
  address: '1، شارع بشير عطار، سيدي امحمد، الجزائر',
};

const Footer = () => {
  const { t, language } = useLanguage();
  const { settings } = useSiteContent();
  const footer = { ...defaultFooter, ...(settings.footer_content || {}) };
  const isRTL = language === 'ar';
  const navigate = useNavigate();

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Twitter, label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: Instagram, label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Youtube, label: 'Youtube', color: 'hover:text-red-600' },
  ];

  const handleNavigation = (event, item) => {
    event.preventDefault();

    if (item.path) {
      navigate(item.path);
      window.scrollTo(0, 0);
      return;
    }

    toast({
      title: t('common.featureNotImplemented'),
      description: 'هذا الرابط غير متاح حالياً',
    });
  };

  const footerLinks = [
    {
      title: t('nav.home'),
      items: [
        { label: footer.brand_name, path: '/' },
        { label: t('nav.programs'), path: '/programs' },
        { label: t('nav.services'), path: '/service' },
        { label: t('nav.live'), path: '/live' },
      ],
    },
    {
      title: t('nav.services'),
      items: [
        { label: t('nav.consultations'), path: '/consultations' },
        { label: t('nav.donations'), path: '/donations' },
        { label: t('nav.hospitals'), path: '/hospitals' },
        { label: t('nav.library'), path: '/library' },
      ],
    },
    {
      title: t('common.readMore'),
      items: [
        { label: t('common.privacyPolicy'), path: '/privacy' },
        { label: t('common.terms'), path: '/terms' },
        { label: t('nav.pharmacies'), path: '/pharmacies' },
      ],
    },
  ];

  return (
    <footer id="footer" className="bg-gradient-to-br from-gray-900 to-slate-900 text-white pt-16 pb-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                K
              </div>
              <div>
                <span className="text-2xl font-bold">{footer.brand_name}</span>
                <p className="text-sm text-gray-400">{footer.slogan}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">{footer.description}</p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className={`rounded-full bg-gray-800 hover:bg-gray-700 ${social.color} transition-colors`}
                  onClick={() => toast({ title: social.label, description: t('common.featureNotImplemented') })}
                >
                  <social.icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </motion.div>

          {footerLinks.map((section, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <span className="text-lg font-bold mb-4 block">{section.title}</span>
              <ul className="space-y-2">
                {section.items.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button onClick={(event) => handleNavigation(event, link)} className="text-gray-400 hover:text-green-400 transition-colors text-start w-full">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <span className="text-lg font-bold mb-4 block">{t('common.contactUs')}</span>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">{t('common.phone')}:</p>
                  <p className="text-white" dir="ltr">{footer.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">{t('common.email')}:</p>
                  <p className="text-white">{footer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">{t('common.address')}:</p>
                  <p className="text-white">{footer.address}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-right">{t('common.copyright')}</p>
            <p className="text-gray-400 text-center md:text-left">{t('common.madeWith')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
