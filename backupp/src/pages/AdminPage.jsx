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
];

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
    if (!isSidebarOpen) {
      return;
    }

    const autoHideTimer = window.setTimeout(() => {
      setIsSidebarOpen(false);
    }, 10000);

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
    setActiveTab(value);
    setIsSidebarOpen(false);
  };

  const renderSidebarItems = () =>
    ADMIN_TABS.map((tab) => {
      if (tab.children) {
        const hasActiveChild = tab.children.some((child) => child.value === activeTab);
        return (
          <div key={tab.value} className="space-y-2">
            <button
              type="button"
              onClick={() => setIsSiteSettingsExpanded((current) => !current)}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-right transition-colors ${hasActiveChild ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <span className="flex items-center gap-3">
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{tab.label}</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isSiteSettingsExpanded ? 'rotate-180' : ''}`} />
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
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-right transition-colors ${isActive ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600 hover:bg-slate-100'}`}
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
          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-right transition-colors ${isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4" dir="rtl">
        <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl p-8 border">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <LockKeyhole className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">لوحة التحكم المحلية</h1>
            <p className="text-gray-500 mt-2">تسجيل الدخول يتم الآن عبر قاعدة SQL المحلية بدون Supabase.</p>
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
            <Button variant="ghost" onClick={() => navigate('/')}>
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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-slate-900 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen((current) => !current)}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <LayoutDashboard className="w-6 h-6 text-green-400" />
            <h1 className="text-xl font-bold">لوحة التحكم - {t('app.title')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-300">
              مرحباً، <span className="font-bold text-white">{admin.full_name || admin.username}</span>
              <span className="mx-2">|</span>
              <span className="bg-blue-600 px-2 py-0.5 rounded text-xs">{LOCAL_ROLE_LABELS[admin.role] || admin.role}</span>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex gap-6 items-start">
            <div className={`hidden lg:block shrink-0 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:w-72' : 'lg:w-0'}`}>
              <aside className="sticky top-24 h-[calc(100vh-7rem)] w-72 bg-white shadow-sm border rounded-2xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-bold text-slate-900">أقسام لوحة التحكم</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-3 space-y-2 overflow-y-auto h-[calc(100%-73px)]">
                  {renderSidebarItems()}
                </div>
              </aside>
            </div>

            <aside className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl border-l z-50 transition-transform duration-300 lg:hidden ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold text-slate-900">أقسام لوحة التحكم</span>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
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

            <div className="flex-1 min-w-0">
              <TabsContent value="news" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <NewsManager />
              </TabsContent>

              <TabsContent value="library" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <LibraryManager />
              </TabsContent>

              <TabsContent value="programs" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <ProgramManager />
              </TabsContent>

              <TabsContent value="site-settings" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <SiteSettingsManager mode="general" />
              </TabsContent>

              <TabsContent value="site-settings-hero" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <SiteSettingsManager mode="hero" />
              </TabsContent>

              <TabsContent value="site-settings-stats" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <HeroStatsManager />
              </TabsContent>

              <TabsContent value="services" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <ServicesManager />
              </TabsContent>

              <TabsContent value="pharmacies" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <PharmaciesManager />
              </TabsContent>

              <TabsContent value="hospitals" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <HospitalsManager />
              </TabsContent>

              <TabsContent value="international-hospitals" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <InternationalHospitalsManager />
              </TabsContent>

              <TabsContent value="ambulances" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <AmbulancesManager />
              </TabsContent>

              <TabsContent value="accommodations" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <AccommodationsManager />
              </TabsContent>

              <TabsContent value="videos" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <VideoProgramsManager />
              </TabsContent>

              <TabsContent value="consultations" className="bg-white p-6 rounded-xl shadow-sm border mt-0">
                <ConsultationsManager />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
