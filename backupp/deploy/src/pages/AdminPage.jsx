import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Newspaper,
  BookOpen,
  Tv,
  Settings,
  Sparkles,
  Command,
  HeartHandshake,
  Film,
  Stethoscope,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  Loader2,
  LockKeyhole,
  User,
  Menu,
  X,
  ChevronDown,
  BarChart3,
  Pill,
  Bus as Ambulance,
  Home,
  Building2,
  Plane,
} from 'lucide-react';
import NewsManager from '@/components/admin/NewsManager';
import LibraryManager from '@/components/admin/LibraryManager';
import ProgramManager from '@/components/admin/ProgramManager';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';
import HeroStatsManager from '@/components/admin/HeroStatsManager';
import ServicesManager from '@/components/admin/ServicesManager';
import VideoProgramsManager from '@/components/admin/VideoProgramsManager';
import ConsultationsManager from '@/components/admin/ConsultationsManager';
import PharmaciesManager from '@/components/admin/PharmaciesManager';
import AmbulancesManager from '@/components/admin/AmbulancesManager';
import AccommodationsManager from '@/components/admin/AccommodationsManager';
import HospitalsManager from '@/components/admin/HospitalsManager';
import InternationalHospitalsManager from '@/components/admin/InternationalHospitalsManager';
import UsersManager from '@/components/admin/UsersManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { adminApi } from '@/lib/localApi';
import { useToast } from '@/components/ui/use-toast';

const LOCAL_ROLE_LABELS = {
  admin: 'مسؤول النظام',
  manager: 'مدير عام',
  supervisor: 'مشرف عام',
  editor: 'محرر صحفي',
  technician: 'تقني بث',
  consultant: 'مستشار',
  news_manager: 'مدير الأخبار',
  support_manager: 'مدير الدعم الفني',
};

const ADMIN_TABS = [
  { value: 'news', icon: Newspaper, label: 'إدارة الأخبار' },
  { value: 'library', icon: BookOpen, label: 'المكتبة الصحية' },
  { value: 'programs', icon: Tv, label: 'البرامج اليومية' },
  {
    value: 'site-settings-group',
    icon: Settings,
    label: 'إدارة الموقع',
    children: [
      { value: 'site-settings', icon: Settings, label: 'الإعدادات العامة' },
      { value: 'site-settings-hero', icon: Settings, label: 'Hero' },
      { value: 'site-settings-stats', icon: BarChart3, label: 'الإحصاءات' },
    ],
  },
  { value: 'services', icon: HeartHandshake, label: 'الخدمات' },
  { value: 'pharmacies', icon: Pill, label: 'إدارة الصيدليات' },
  { value: 'hospitals', icon: Building2, label: 'إدارة المستشفيات' },
  { value: 'international-hospitals', icon: Plane, label: 'العلاج بالخارج' },
  { value: 'ambulances', icon: Ambulance, label: 'دليل الإسعاف' },
  { value: 'accommodations', icon: Home, label: 'إيواء المرضى' },
  { value: 'videos', icon: Film, label: 'الفيديوهات' },
  { value: 'consultations', icon: Stethoscope, label: 'الاستشارات' },
  { value: 'users', icon: User, label: 'المستخدمون' },
];

const getTabMeta = (value) => {
  for (const tab of ADMIN_TABS) {
    if (tab.value === value) return tab;
    if (tab.children) {
      const child = tab.children.find((item) => item.value === value);
      if (child) return child;
    }
  }
  return null;
};

const AdminPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('news');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSiteSettingsExpanded, setIsSiteSettingsExpanded] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const adminRole = admin?.role || '';
  const canAssignUserRoles = adminRole === 'admin';
  const isEditor = adminRole === 'editor';
  const isModerator = adminRole === 'moderator';

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await adminApi.getSession();
        if (response.authenticated) {
          setAdmin(response.admin);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    const siteSettingsTab = ADMIN_TABS.find((tab) => tab.children);
    if (!siteSettingsTab) return;
    const hasActiveChild = siteSettingsTab.children.some((child) => child.value === activeTab);
    if (hasActiveChild) {
      setIsSiteSettingsExpanded(true);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const autoHideTimer = window.setTimeout(() => {
      setIsSidebarOpen(false);
    }, 20000);

    return () => window.clearTimeout(autoHideTimer);
  }, [isSidebarOpen]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await adminApi.login(credentials);
      setAdmin(response.admin);
      setCredentials({ username: '', password: '' });
      toast({
        title: 'تم تسجيل الدخول',
        description: 'أهلا بك في لوحة التحكم المحلية.',
      });
    } catch (error) {
      toast({
        title: 'تعذر تسجيل الدخول',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminApi.logout();
      setAdmin(null);
      toast({
        title: 'تم تسجيل الخروج',
        description: 'تم إنهاء جلسة الإدارة المحلية.',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleTabChange = (value) => {
    if (isEditor && value !== 'news') {
      return;
    }

    if (isModerator && value === 'users') {
      return;
    }

    setActiveTab(value);
    setIsSidebarOpen(false);
  };

  const renderSidebarItems = () =>
    ADMIN_TABS.filter((tab) => {
      if (isEditor) {
        // Editor = only one entry point editing access (News).
        return tab.value === 'news';
      }

      if (isModerator) {
        // Moderator = all control, but no role assignment.
        return tab.value !== 'users';
      }

      return true;
    }).map((tab) => {
      if (tab.children) {
        const hasActiveChild = tab.children.some((child) => child.value === activeTab);
        return (
          <div key={tab.value} className="space-y-2">
            <button
              type="button"
              onClick={() => setIsSiteSettingsExpanded((current) => !current)}
              className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-right transition-all border ${
                hasActiveChild
                  ? 'bg-white/10 text-white border-white/10 shadow-[0_18px_45px_-40px_rgba(255,255,255,0.6)]'
                  : 'text-slate-200/90 border-transparent hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <span className="flex items-center gap-3">
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{tab.label}</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform text-slate-300 ${isSiteSettingsExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isSiteSettingsExpanded && (
              <div className="space-y-1 pr-4">
                {tab.children.map((child) => {
                  const isActive = activeTab === child.value;
                  return (
                    <button
                      key={child.value}
                      type="button"
                      onClick={() => handleTabChange(child.value)}
                      className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 text-right transition-all border ${
                        isActive
                          ? 'bg-gradient-to-r from-fuchsia-500/15 to-cyan-400/15 text-white border-white/10'
                          : 'text-slate-200/80 border-transparent hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <child.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">{child.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      const isActive = activeTab === tab.value;
      return (
        <button
          key={tab.value}
          type="button"
          onClick={() => handleTabChange(tab.value)}
          className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-right transition-all border ${
            isActive
              ? 'bg-white/10 text-white border-white/10 shadow-[0_18px_45px_-40px_rgba(255,255,255,0.6)]'
              : 'text-slate-200/90 border-transparent hover:bg-white/5 hover:border-white/10'
          }`}
        >
          <tab.icon className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{tab.label}</span>
        </button>
      );
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3 bg-gray-50">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span>جاري التحقق من جلسة الإدارة...</span>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4 py-10" dir="rtl">
        <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
              <LockKeyhole className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">لوحة التحكم المحلية</h1>
            <p className="text-gray-500 mt-2 leading-relaxed">
              سجل الدخول للوصول إلى أدوات إدارة المحتوى والخدمات.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-username">اسم المستخدم</Label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="admin-username"
                  value={credentials.username}
                  onChange={(event) => setCredentials((current) => ({ ...current, username: event.target.value }))}
                  className="pr-10"
                  placeholder="اسم مستخدم الإدارة"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="admin-password">كلمة المرور</Label>
              <div className="relative">
                <LockKeyhole className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="admin-password"
                  type="password"
                  value={credentials.password}
                  onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                  className="pr-10"
                  placeholder="كلمة المرور"
                  autoComplete="current-password"
                  dir="ltr"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'دخول لوحة التحكم'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-slate-600 hover:text-slate-900">
              العودة إلى الرئيسية
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!admin.role) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold">تعذر التحقق من الصلاحيات</h1>
        <p className="text-gray-500">الجلسة الحالية لا تحتوي على دور صالح للإدارة.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-slate-100" dir="rtl">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute top-40 -right-40 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1020]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen((current) => !current)}
              className="text-slate-100 hover:bg-white/10 hover:text-white"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 grid place-items-center shadow-[0_12px_40px_-18px_rgba(34,211,238,0.6)]">
                <Command className="w-5 h-5 text-[#0b1020]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold leading-tight tracking-wide">Control Room</h1>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-fuchsia-200" />
                    {getTabMeta(activeTab)?.label || 'لوحة التحكم'}
                  </span>
                </div>
                <div className="text-xs text-slate-300/90 truncate">
                  {t('app.title')}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right leading-tight">
                <div className="text-sm text-slate-200">
                  {admin.full_name || admin.username}
                </div>
                <div className="text-[11px] text-slate-400">
                  {LOCAL_ROLE_LABELS[admin.role] || admin.role}
                </div>
              </div>
              <div className="h-9 w-9 rounded-2xl bg-white/10 border border-white/10 grid place-items-center">
                <User className="w-4.5 h-4.5" />
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2 bg-rose-600 hover:bg-rose-700">
              <LogOut className="w-4 h-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-6 sm:py-8 relative">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
            <div className={`hidden lg:block transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <aside className="sticky top-24 h-[calc(100vh-7.5rem)] rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_18px_60px_-38px_rgba(0,0,0,0.9)]">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <span className="font-semibold text-slate-100">Navigation</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="hover:bg-white/10 text-slate-100">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-3 space-y-2 overflow-y-auto h-[calc(100%-73px)]">
                  {renderSidebarItems()}
                </div>
              </aside>
            </div>

            <aside className={`fixed top-0 right-0 h-full w-80 bg-[#0b1020] shadow-2xl border-l border-white/10 z-50 transition-transform duration-300 lg:hidden ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="font-semibold text-slate-100">Navigation</span>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-slate-100 hover:bg-white/10">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-3 space-y-2 overflow-y-auto h-[calc(100%-73px)]">
                {renderSidebarItems()}
              </div>
            </aside>

            {isSidebarOpen && (
              <button
                type="button"
                aria-label="Close sidebar"
                className="fixed inset-0 bg-slate-950/30 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            <div className="min-w-0">
              <div className="mb-4 sm:mb-6 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400">Workspace</div>
                  <div className="text-lg sm:text-2xl font-bold text-slate-100 truncate">
                    {getTabMeta(activeTab)?.label || 'لوحة التحكم'}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="hidden sm:inline-flex border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  فتح الأقسام
                </Button>
              </div>

              <TabsContent value="news" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <NewsManager />
              </TabsContent>

              <TabsContent value="library" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <LibraryManager />
              </TabsContent>

              <TabsContent value="programs" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <ProgramManager />
              </TabsContent>

              <TabsContent value="site-settings" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <SiteSettingsManager mode="general" />
              </TabsContent>

              <TabsContent value="site-settings-hero" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <SiteSettingsManager mode="hero" />
              </TabsContent>

              <TabsContent value="site-settings-stats" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <HeroStatsManager />
              </TabsContent>

              <TabsContent value="services" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <ServicesManager />
              </TabsContent>

              <TabsContent value="pharmacies" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <PharmaciesManager />
              </TabsContent>

              <TabsContent value="hospitals" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <HospitalsManager />
              </TabsContent>

              <TabsContent value="international-hospitals" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <InternationalHospitalsManager />
              </TabsContent>

              <TabsContent value="ambulances" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <AmbulancesManager />
              </TabsContent>

              <TabsContent value="accommodations" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <AccommodationsManager />
              </TabsContent>

              <TabsContent value="videos" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <VideoProgramsManager />
              </TabsContent>

              <TabsContent value="consultations" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                <ConsultationsManager />
              </TabsContent>

              {!isEditor && (
                <TabsContent value="users" className="bg-white/5 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] border border-white/10 mt-0 backdrop-blur-xl">
                  <UsersManager adminRole={adminRole} canAssignRoles={canAssignUserRoles} />
                </TabsContent>
              )}
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
