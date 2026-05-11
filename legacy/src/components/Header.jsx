import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogIn, Globe, Facebook, Twitter, Instagram, Youtube, HeartHandshake, Clock, Tv, Radio, BookOpen, LogOut, LayoutDashboard, Bus as Ambulance, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from '@/components/ui/use-toast';
import AuthModal from '@/components/AuthModal';
import UrgentNewsBanner from '@/components/UrgentNewsBanner';
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
    // Prevent flicker/oscillation around the threshold by:
    // - using hysteresis (different enter/exit thresholds)
    // - throttling updates to animation frames
    const isMobile = typeof window !== 'undefined' && window.matchMedia?.('(max-width: 768px)')?.matches;
    // Mobile scroll is noisier (momentum + address bar show/hide), so use wider hysteresis.
    const ENTER_AT = isMobile ? 220 : 140;
    const EXIT_AT = isMobile ? 120 : 90;

    let rafId = 0;
    const compactRef = { current: false };
    let lastY = window.scrollY || 0;

    const update = () => {
      rafId = 0;
      const y = window.scrollY || 0;
      const delta = y - lastY;
      lastY = y;
      const goingDown = delta > 0.5;
      const goingUp = delta < -0.5;

      // Direction-aware hysteresis: only collapse while scrolling down, expand while scrolling up.
      // This prevents rapid toggling on mobile when scrollY jitters by a few pixels.
      let next = compactRef.current;
      if (!compactRef.current && goingDown && y > ENTER_AT) next = true;
      if (compactRef.current && goingUp && y < EXIT_AT) next = false;

      if (next !== compactRef.current) {
        compactRef.current = next;
        setIsCompact(next);
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    // initial
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
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
      title: t('auth.signOutTitle'),
      description: t('auth.signOutDesc'),
    });
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return t('auth.userFallback');
  };

  return <header className="sticky top-0 z-50 shadow-md flex flex-col min-h-0" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <UrgentNewsBanner collapsed={isCompact} />

      {/* Grid 0fr/1fr collapses to true zero height (reliable vs max-height + flex min-height:auto) */}
      <div
        className={`relative z-[2] grid min-h-0 transition-[grid-template-rows] duration-200 ease-out ${
          isCompact ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className={`min-h-0 overflow-hidden ${isCompact ? 'pointer-events-none' : ''}`}>
          <div className={`bg-slate-900 text-white text-xs md:text-sm ${!isCompact ? 'border-b border-slate-800/70' : ''}`}>
        <div className="container mx-auto px-4 py-2 md:py-2.5 flex justify-between items-center">
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
                  {t('nav.adminLink')}
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
        </div>
      </div>

      <div className="bg-white border-b relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center py-3 md:py-4 gap-3">
            <div className="flex items-center w-full md:w-auto gap-3 md:gap-4">
              <div className={`flex-shrink-0 transition-[width,opacity] duration-200 ${isCompact ? 'w-12 md:w-14 lg:w-16' : 'w-24 md:w-32 lg:w-40'}`}>
                <Link to="/">
                  <img src="/logo.png" alt="Machafi Channel" className="w-full h-auto object-contain drop-shadow-sm hover:scale-105 transition-transform" />
                </Link>
              </div>
              <div className={`flex-shrink-0 hidden sm:block transition-[width,opacity] duration-200 ${isCompact ? 'w-0 opacity-0 overflow-hidden' : 'w-20 md:w-28 lg:w-36 opacity-100'}`}>
                <img src="https://horizons-cdn.hostinger.com/0aa384d7-6fea-4830-83ee-bd56f39e3500/9daf0b6f4bdc8f5236150e485de0cc7b.png" alt="KGC" className="w-full h-auto object-contain drop-shadow-sm" />
              </div>
              <div className={`flex-shrink-0 hidden sm:block transition-[width,opacity] duration-200 ${isCompact ? 'w-0 opacity-0 overflow-hidden' : 'w-24 md:w-32 opacity-100'}`}>
                <img src="https://horizons-cdn.hostinger.com/0aa384d7-6fea-4830-83ee-bd56f39e3500/komas-group-logo-transparant-officiel-cfD7b.png" alt="Komas Group" className="w-full h-auto object-contain drop-shadow-sm" />
              </div>

              <div className="flex-1 lg:hidden" />

              <div className="flex items-center gap-2 lg:hidden">
                <Button
                  variant="outline"
                  className={`border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm transition-[width,height,padding] duration-200 ${isCompact ? 'h-8 w-8 p-0 min-w-0' : 'h-9 w-9 p-0 min-w-0'}`}
                  onClick={() => navigate('/live')}
                  aria-label={t('common.watchLive')}
                  title={t('common.watchLive')}
                >
                  <Radio className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  className={`border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm transition-[width,height,padding] duration-200 ${isCompact ? 'h-8 w-8 p-0 min-w-0' : 'h-9 w-9 p-0 min-w-0'}`}
                  onClick={() => navigate('/programs')}
                  aria-label={t('nav.programs')}
                  title={t('nav.programs')}
                >
                  <Tv className="w-4 h-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  aria-label="Menu"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </div>
            </div>

            <div className={`hidden lg:flex items-center gap-3`}>
              <Button
                variant="outline"
                className={`border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm transition-[width,height,padding] duration-200 ${isCompact ? 'h-8 w-8 p-0 min-w-0' : 'gap-2 animate-pulse'}`}
                onClick={() => navigate('/live')}
                aria-label={t('common.watchLive')}
                title={t('common.watchLive')}
              >
                <Radio className="w-4 h-4" />
                {!isCompact && <span className="font-bold">{t('common.watchLive')}</span>}
              </Button>

              <Button
                variant="outline"
                className={`border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm transition-[width,height,padding] duration-200 ${isCompact ? 'h-8 w-8 p-0 min-w-0' : 'gap-2'}`}
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
                      <span>{t('nav.profile')}</span>
                    </DropdownMenuItem>
                    {canAccessAdmin(userRole) && (
                        <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = '/admin'}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>{t('nav.adminPanel')}</span>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('auth.signOutTitle')}</span>
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
                    {t('nav.adminLink')}
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
                   {t('auth.signOutTitle')}
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
