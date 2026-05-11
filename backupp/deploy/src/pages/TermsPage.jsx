import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const TermsPage = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl" dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8 text-slate-900 flex items-center gap-3">
        <FileText className="w-8 h-8 text-blue-600" />
        {t('common.terms') || 'شروط الاستخدام'}
      </h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-8 text-gray-700 leading-relaxed">
        <p className="text-lg text-slate-600 border-b pb-6">
          أهلاً بك في موقع KGC Machafi. باستخداك لهذا الموقع، فإنك توافق على الامتثال لهذه الشروط والأحكام والالتزام بها.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            1. الاستخدام المقبول
          </h2>
          <p>يجب عليك استخدام موقعنا فقط للأغراض القانونية وبطريقة لا تنتهك حقوق الآخرين أو تقيد أو تمنع استخدامهم للموقع والتمتع به.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            2. الملكية الفكرية
          </h2>
          <p>جميع المحتويات الموجودة على هذا الموقع، بما في ذلك النصوص والرسومات والشعارات والصور، هي ملك لـ KGC Machafi أو موردي محتوياتها ومحمية بموجب قوانين حقوق النشر الدولية.</p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">3. إخلاء المسؤولية</h2>
          <p>يتم تقديم المعلومات الواردة في هذا الموقع لأغراض إعلامية عامة فقط. لا نقدم أي ضمانات حول دقة أو اكتمال هذه المعلومات.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;