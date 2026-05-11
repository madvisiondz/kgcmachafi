import React, { useEffect, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/localApi';

const fieldClass =
  'bg-[#0b1020]/40 border-white/10 text-slate-100 placeholder:text-slate-500';
const textareaClass = `${fieldClass} min-h-[90px]`;

const defaultSettings = {
  hero_content: {
    badge: '',
    title_start: '',
    title_end: '',
    description: '',
    image_url: '',
  },
  services_content: {
    section_title: '',
    section_subtitle: '',
  },
  live_player: {
    section_title: '',
    section_subtitle: '',
    live_title: '',
    live_description: '',
    preview_image_url: '',
    stream_url: '',
  },
  consultations_content: {
    section_title: '',
    section_subtitle: '',
    sidebar_title: '',
    contact_phone: '',
  },
  footer_content: {
    brand_name: '',
    slogan: '',
    description: '',
    phone: '',
    email: '',
    address: '',
  },
};

const SiteSettingsManager = ({ mode = 'general' }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await adminApi.getSiteSettings();
        setSettings({ ...defaultSettings, ...(response.settings || {}) });
      } catch (error) {
        toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const updateSection = (sectionKey, field, value) => {
    setSettings((current) => ({
      ...current,
      [sectionKey]: {
        ...current[sectionKey],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSiteSettings(settings);
      toast({ title: 'تم الحفظ', description: 'تم تحديث إعدادات الموقع بنجاح.' });
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-slate-300">جاري تحميل إعدادات الموقع...</div>;
  }

  const isHeroMode = mode === 'hero';
  const panelClass = 'rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl space-y-4';

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-300" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            {isHeroMode ? 'إعدادات Hero' : 'إعدادات ومحتوى الموقع'}
          </h2>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Save className="w-4 h-4" />
          حفظ الكل
        </Button>
      </div>

      <div className="grid gap-5">
        {isHeroMode ? (
          <section className={panelClass}>
            <h3 className="text-lg font-bold text-slate-100">محتوى Hero</h3>
            <Input
              className={fieldClass}
              value={settings.hero_content.badge}
              onChange={(event) => updateSection('hero_content', 'badge', event.target.value)}
              placeholder="الشارة"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                className={fieldClass}
                value={settings.hero_content.title_start}
                onChange={(event) => updateSection('hero_content', 'title_start', event.target.value)}
                placeholder="العنوان الأول"
              />
              <Input
                className={fieldClass}
                value={settings.hero_content.title_end}
                onChange={(event) => updateSection('hero_content', 'title_end', event.target.value)}
                placeholder="العنوان الثاني"
              />
            </div>
            <Textarea
              className={textareaClass}
              value={settings.hero_content.description}
              onChange={(event) => updateSection('hero_content', 'description', event.target.value)}
              placeholder="وصف القسم"
            />
            <Input
              className={fieldClass}
              value={settings.hero_content.image_url}
              onChange={(event) => updateSection('hero_content', 'image_url', event.target.value)}
              placeholder="رابط الصورة"
              dir="ltr"
            />
          </section>
        ) : (
          <>
            <section className={panelClass}>
              <h3 className="text-lg font-bold text-slate-100">الخدمات</h3>
              <Input
                className={fieldClass}
                value={settings.services_content.section_title}
                onChange={(event) => updateSection('services_content', 'section_title', event.target.value)}
                placeholder="عنوان القسم"
              />
              <Textarea
                className={textareaClass}
                value={settings.services_content.section_subtitle}
                onChange={(event) => updateSection('services_content', 'section_subtitle', event.target.value)}
                placeholder="وصف القسم"
              />
            </section>

            <section className={panelClass}>
              <h3 className="text-lg font-bold text-slate-100">البث والبرامج</h3>
              <Input
                className={fieldClass}
                value={settings.live_player.section_title}
                onChange={(event) => updateSection('live_player', 'section_title', event.target.value)}
                placeholder="عنوان القسم"
              />
              <Textarea
                className={textareaClass}
                value={settings.live_player.section_subtitle}
                onChange={(event) => updateSection('live_player', 'section_subtitle', event.target.value)}
                placeholder="وصف القسم"
              />
              <Input
                className={fieldClass}
                value={settings.live_player.live_title}
                onChange={(event) => updateSection('live_player', 'live_title', event.target.value)}
                placeholder="عنوان البث المباشر"
              />
              <Textarea
                className={textareaClass}
                value={settings.live_player.live_description}
                onChange={(event) => updateSection('live_player', 'live_description', event.target.value)}
                placeholder="وصف البث المباشر"
              />
              <Input
                className={fieldClass}
                value={settings.live_player.preview_image_url}
                onChange={(event) => updateSection('live_player', 'preview_image_url', event.target.value)}
                placeholder="صورة البث"
                dir="ltr"
              />
              <Input
                className={fieldClass}
                value={settings.live_player.stream_url}
                onChange={(event) => updateSection('live_player', 'stream_url', event.target.value)}
                placeholder="رابط البث المباشر"
                dir="ltr"
              />
            </section>

            <section className={panelClass}>
              <h3 className="text-lg font-bold text-slate-100">الاستشارات</h3>
              <Input
                className={fieldClass}
                value={settings.consultations_content.section_title}
                onChange={(event) => updateSection('consultations_content', 'section_title', event.target.value)}
                placeholder="عنوان القسم"
              />
              <Textarea
                className={textareaClass}
                value={settings.consultations_content.section_subtitle}
                onChange={(event) => updateSection('consultations_content', 'section_subtitle', event.target.value)}
                placeholder="وصف القسم"
              />
              <Input
                className={fieldClass}
                value={settings.consultations_content.sidebar_title}
                onChange={(event) => updateSection('consultations_content', 'sidebar_title', event.target.value)}
                placeholder="عنوان الصندوق الجانبي"
              />
              <Input
                className={fieldClass}
                value={settings.consultations_content.contact_phone}
                onChange={(event) => updateSection('consultations_content', 'contact_phone', event.target.value)}
                placeholder="رقم الهاتف"
                dir="ltr"
              />
            </section>

            <section className={panelClass}>
              <h3 className="text-lg font-bold text-slate-100">الفوتر</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  className={fieldClass}
                  value={settings.footer_content.brand_name}
                  onChange={(event) => updateSection('footer_content', 'brand_name', event.target.value)}
                  placeholder="اسم العلامة"
                />
                <Input
                  className={fieldClass}
                  value={settings.footer_content.slogan}
                  onChange={(event) => updateSection('footer_content', 'slogan', event.target.value)}
                  placeholder="الشعار النصي"
                />
              </div>
              <Textarea
                className={textareaClass}
                value={settings.footer_content.description}
                onChange={(event) => updateSection('footer_content', 'description', event.target.value)}
                placeholder="وصف الفوتر"
              />
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  className={fieldClass}
                  value={settings.footer_content.phone}
                  onChange={(event) => updateSection('footer_content', 'phone', event.target.value)}
                  placeholder="الهاتف"
                  dir="ltr"
                />
                <Input
                  className={fieldClass}
                  value={settings.footer_content.email}
                  onChange={(event) => updateSection('footer_content', 'email', event.target.value)}
                  placeholder="البريد الإلكتروني"
                  dir="ltr"
                />
                <Input
                  className={fieldClass}
                  value={settings.footer_content.address}
                  onChange={(event) => updateSection('footer_content', 'address', event.target.value)}
                  placeholder="العنوان"
                />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default SiteSettingsManager;
