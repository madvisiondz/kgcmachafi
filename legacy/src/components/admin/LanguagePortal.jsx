import React, { useEffect, useMemo, useState } from 'react';
import { Globe, Save, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/localApi';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];

const SITE_FIELDS = [
  { key: 'hero_content.badge', label: 'Hero • Badge', type: 'input' },
  { key: 'hero_content.title_start', label: 'Hero • Title start', type: 'input' },
  { key: 'hero_content.title_end', label: 'Hero • Title end', type: 'input' },
  { key: 'hero_content.description', label: 'Hero • Description', type: 'textarea' },
  { key: 'footer_content.brand_name', label: 'Footer • Brand name', type: 'input' },
  { key: 'footer_content.slogan', label: 'Footer • Slogan', type: 'input' },
  { key: 'footer_content.description', label: 'Footer • Description', type: 'textarea' },
  { key: 'footer_content.address', label: 'Footer • Address', type: 'textarea' },
];

export default function LanguagePortal() {
  const { toast } = useToast();
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState({});

  const langLabel = useMemo(() => LANGS.find((l) => l.code === activeLang)?.label || activeLang, [activeLang]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getI18n({ entity_type: 'site_settings', entity_id: 0, lang: activeLang });
      setFields(res.fields || {});
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
      setFields({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLang]);

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.saveI18n({
        entity_type: 'site_settings',
        entity_id: 0,
        lang: activeLang,
        fields,
      });
      toast({ title: 'تم الحفظ', description: `تم حفظ ترجمات ${langLabel}.` });
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-slate-300" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">بوابة اللغات</h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">
            <Sparkles className="w-3.5 h-3.5" />
            ترجمات محفوظة داخل قاعدة البيانات
          </span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            {LANGS.map((l) => (
              <Button
                key={l.code}
                type="button"
                variant={activeLang === l.code ? 'default' : 'outline'}
                className={activeLang === l.code ? 'bg-white/15 text-white hover:bg-white/20' : 'border-white/15 bg-white/5 text-slate-100 hover:bg-white/10'}
                onClick={() => setActiveLang(l.code)}
              >
                {l.label}
              </Button>
            ))}
          </div>
          <Button onClick={save} disabled={saving || loading} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4" />
            حفظ
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-slate-300">جاري تحميل الترجمات...</div>
      ) : (
        <div className="grid gap-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="text-sm text-slate-300 mb-4">
              هذه الصفحة تُستخدم لإدارة نصوص **Hero** و **Footer** للغات EN/FR بدون أي اتصال بخدمات ترجمة خارجية.
            </div>

            <div className="grid gap-4">
              {SITE_FIELDS.map((f) => (
                <div key={f.key} className="grid gap-2">
                  <div className="text-sm font-semibold text-slate-100">{f.label}</div>
                  {f.type === 'textarea' ? (
                    <Textarea
                      value={fields[f.key] || ''}
                      onChange={(e) => setFields((c) => ({ ...c, [f.key]: e.target.value }))}
                      className="min-h-[90px] bg-[#0b1020]/40 border-white/10 text-slate-100"
                    />
                  ) : (
                    <Input
                      value={fields[f.key] || ''}
                      onChange={(e) => setFields((c) => ({ ...c, [f.key]: e.target.value }))}
                      className="bg-[#0b1020]/40 border-white/10 text-slate-100"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

