import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogIn, Globe, Facebook, Twitter, Instagram, Youtube, HeartHandshake, Clock, Tv, Radio, BookOpen, LogOut, LayoutDashboard, Bus as Ambulance, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from '@/components/ui/use-toast';
import AuthModal from '@/components/AuthModal';
import { Link, useNavigate } from 'react-router-dom';
import { canAccessAdmin } from '@/lib/permissions';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userRole, setUserRole] = useState(null);
  const [isCompact, setIsCompact] = useState(false);

  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user?.user_metadata?.role) {
      setUserRole(user.user_metadata.role);
    }
  }, [user]);

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.library'), href: '/library' },
    { name: t('nav.pharmacies'), href: '/pharmacies' },
    { name: t('nav.ambulances') || 'دليل الإسعاف', href: '/ambulances' },
    { name: t('nav.accommodation') || 'إيواء المرضى', href: '/accommodations' },
    { name: t('nav.programs'), href: '/programs' },
    { name: t('nav.services'), href: '/service' },
    { name: t('nav.hospitals'), href: '/hospitals' },
    { name: t('nav.consultations'), href: '/consultations' },
    { name: t('nav.donations'), href: '/donations' },
  ];

  const languages = [
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'tz', label: 'Tamazight' },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'Youtube', href: '#' },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'تم تسجيل الخروج',
      description: 'إلى اللقاء!',
    });
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'المستخدم';
  };

  return <header className="sticky top-0 z-50 shadow-md flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`bg-slate-900 text-white text-xs md:text-sm relative z-20 overflow-hidden transition-all duration-300 ${isCompact ? 'max-h-0 py-0 opacity-0' : 'max-h-24 py-2 opacity-100'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex gap-2">
              {socialLinks.map((social, index) => <a key={index} href={social.href} className="hover:text-green-400 transition-colors">
                  <social.icon className="w-4 h-4" />
                </a>)}
            </div>

            <div className="hidden md:block w-px h-4 bg-gray-700"></div>

            <div className="hidden lg:flex items-center gap-2 text-gray-200 cursor-default text-sm md:text-base font-bold tracking-wide">
               <Clock className="w-4 h-4 text-green-400" />
               <span>
                 {currentTime.toLocaleDateString(language === 'ar' ? 'ar-EG' : (language === 'es' ? 'es-ES' : (language === 'fr' ? 'fr-FR' : 'en-US')), {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
               </span>
               <span className="w-px h-4 bg-gray-600 mx-2"></span>
               <span className="text-green-400 font-mono font-bold" dir="ltr">
                 {currentTime.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
               </span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {user ? (
              canAccessAdmin(userRole) ? (
                <Link to="/admin" className="hover:text-red-400 transition-colors hidden md:flex items-center gap-1 font-bold">
                  <LayoutDashboard className="w-3 h-3" />
                  لوحة الإدارة
                </Link>
              ) : null
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                size="sm"
                variant="ghost"
                className="hidden md:flex items-center gap-1 px-0 h-auto font-bold text-red-500 hover:text-red-400 hover:bg-transparent"
              >
                <LogIn className="w-3 h-3" />
                {t('nav.login')}
              </Button>
            )}
            <a href="#" className="hover:text-green-400 transition-colors hidden md:block">{t('common.whoWeAre')}</a>
            <a href="#" className="hover:text-green-400 transition-colors hidden md:block">{t('common.contactUs')}</a>

            <div className="w-px h-4 bg-gray-700 hidden md:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:text-green-400 transition-colors focus:outline-none">
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{language}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map(lang => <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)} className={language === lang.code ? 'bg-green-50 text-green-600 font-bold' : ''}>
                    {lang.label}
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className={`bg-white border-b relative z-10 transition-all duration-300 ${isCompact ? 'py-1' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          <div className={`flex flex-col md:flex-row justify-between items-center transition-all duration-300 ${isCompact ? 'gap-2' : 'gap-4'}`}>
            <div className={`flex items-center justify-between w-full md:w-auto transition-all duration-300 ${isCompact ? 'gap-2' : 'gap-4'}`}>
              <div className={`flex-shrink-0 transition-all duration-300 ${isCompact ? 'w-12 md:w-14 lg:w-16' : 'w-24 md:w-32 lg:w-40'}`}>
                <Link to="/">
                  <img src="/logo.png" alt="Machafi Channel" className="w-full h-auto object-contain drop-shadow-sm hover:scale-105 transition-transform" />
                </Link>
              </div>
              <div className={`flex-shrink-0 hidden sm:block transition-all duration-300 ${isCompact ? 'w-0 opacity-0 overflow-hidden' : 'w-20 md:w-28 lg:w-36 opacity-100'}`}>
                <img src="https://horizons-cdn.hostinger.com/0aa384d7-6fea-4830-83ee-bd56f39e3500/9daf0b6f4bdc8f5236150e485de0cc7b.png" alt="KGC" className="w-full h-auto object-contain drop-shadow-sm" />
              </div>
              <div className={`flex-shrink-0 hidden sm:block transition-all duration-300 ${isCompact ? 'w-0 opacity-0 overflow-hidden' : 'w-24 md:w-32 opacity-100'}`}>
                <img src="https://horizons-cdn.hostinger.com/0aa384d7-6fea-4830-83ee-bd56f39e3500/komas-group-logo-transparant-officiel-cfD7b.png" alt="Komas Group" className="w-full h-auto object-contain drop-shadow-sm" />
              </div>
            </div>

            <div className={`flex items-center transition-all duration-300 ${isCompact ? 'gap-1.5' : 'gap-3'}`}>
              <Button
                variant="outline"
                className={`border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm transition-all duration-300 ${isCompact ? 'h-8 w-8 p-0 min-w-0' : 'gap-2 animate-pulse'}`}
                onClick={() => navigate('/live')}
                aria-label={t('common.watchLive')}
                title={t('common.watchLive')}
              >
                <Radio className="w-4 h-4" />
                {!isCompact && <span className="font-bold">{t('common.watchLive')}</span>}
              </Button>

              <Button
                variant="outline"
                className={`border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm transition-all duration-300 ${isCompact ? 'h-8 w-8 p-0 min-w-0' : 'gap-2'}`}
                onClick={() => navigate('/programs')}
                aria-label={t('nav.programs')}
                title={t('nav.programs')}
              >
                <Tv className="w-4 h-4" />
                {!isCompact && <span className="font-bold">{t('nav.programs')}</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block bg-gradient-to-r from-emerald-700 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-0">
            <ul className="flex items-center">
              {navigation.map((item, index) => <li key={index}>
                  <Link to={item.href} className="block py-3 px-4 text-sm font-medium hover:bg-white/10 transition-colors relative group whitespace-nowrap flex items-center gap-2">
                    {item.name === t('nav.library') && <BookOpen className="w-4 h-4 text-yellow-300" />}
                    {item.name === t('nav.ambulances') && <Ambulance className="w-4 h-4 text-red-300" />}
                    {item.name === t('nav.accommodation') && <Home className="w-4 h-4 text-blue-300" />}
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                </li>)}
            </ul>

            <div className="flex items-center gap-3 ml-auto">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gap-2 bg-green-600 text-white hover:bg-green-700 border border-green-500 shadow-sm">
                      <User className="w-4 h-4" />
                      {getUserDisplayName()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>الملف الشخصي</span>
                    </DropdownMenuItem>
                    {canAccessAdmin(userRole) && (
                        <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = '/admin'}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>لوحة التحكم</span>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button onClick={() => setIsAuthModalOpen(true)} size="sm" className="gap-2 bg-green-500 hover:bg-green-600 text-white shadow-sm">
                    <HeartHandshake className="w-4 h-4" />
                    {t('common.subscribe')}
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors absolute right-4 z-20 ${isCompact ? 'top-[58px]' : 'top-[80px]'}`}>
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isMenuOpen && <motion.div initial={{
      opacity: 0,
      height: 0
    }} animate={{
      opacity: 1,
      height: 'auto'
    }} exit={{
      opacity: 0,
      height: 0
    }} className="lg:hidden bg-white border-b shadow-xl overflow-hidden">
          <div className="p-4 bg-gray-50 flex justify-between items-center border-b">
             <div className="w-24">
                <img src="https://horizons-cdn.hostinger.com/0aa384d7-6fea-4830-83ee-bd56f39e3500/da5a0ea8d9f904206cd86c911e98a0b6.png" alt="Komas Group" className="w-full h-auto object-contain" />
             </div>
             <div className="flex gap-2 text-sm text-gray-600 font-bold">
                <a href="#">{t('common.whoWeAre')}</a>
                <span>|</span>
                <a href="#">{t('common.contactUs')}</a>
             </div>
          </div>

          <nav className="p-4 space-y-1">
            {navigation.map((item, index) => <Link key={index} to={item.href} onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors font-medium">
                {item.name}
              </Link>)}

            <div className="pt-4 mt-4 border-t">
              {user ? (
                canAccessAdmin(userRole) ? (
                  <Link to="/admin" className="block py-3 px-4 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-medium flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    لوحة الإدارة
                  </Link>
                ) : null
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2 px-4 py-3 h-auto text-gray-700 hover:bg-red-50 hover:text-red-700"
                >
                  <LogIn className="w-4 h-4" />
                  {t('nav.login')}
                </Button>
              )}
              {user ? (
                 <Button onClick={handleSignOut} variant="destructive" className="w-full gap-2 mb-3 mt-4">
                   <LogOut className="w-4 h-4" />
                   تسجيل الخروج
                 </Button>
              ) : (
                <Button onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMenuOpen(false);
                }} className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600 mb-3 mt-4">
                  <HeartHandshake className="w-4 h-4" />
                  {t('common.subscribe')}
                </Button>
              )}
            </div>
          </nav>
        </motion.div>}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>;
};

export default Header;
