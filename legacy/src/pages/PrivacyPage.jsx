import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Lock, Eye } from 'lucide-react';

const PrivacyPage = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl" dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8 text-slate-900 flex items-center gap-3">
        <Shield className="w-8 h-8 text-blue-600" />
        {t('common.privacyPolicy') || 'سياسة الخصوصية'}
      </h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            1. جمع المعلومات
          </h2>
          <p>نحن نجمع المعلومات التي تقدمها لنا مباشرة عند استخدامك لخدماتنا، مثل عند إنشاء حساب، أو الاشتراك في النشرة الإخبارية، أو التواصل معنا.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-500" />
            2. استخدام المعلومات
          </h2>
          <p>نستخدم المعلومات التي نجمعها لتقديم خدماتنا وصيانتها وتحسينها، وللتواصل معك، ولتخصيص تجربتك.</p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">3. مشاركة المعلومات</h2>
          <p>لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات المنصوص عليها في سياسة الخصوصية هذه، أو بموافقتك، أو كما يقتضيه القانون.</p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">4. أمن البيانات</h2>
          <p>نحن نتخذ إجراءات معقولة لحماية معلوماتك من الفقدان والسرقة وسوء الاستخدام والوصول غير المصرح به والإفشاء والتغيير والإتلاف.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;