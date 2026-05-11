import React from 'react';
import { Film, PlayCircle, Info } from 'lucide-react';

const HealthInDrama = () => {
  return (
    <section className="py-16 bg-slate-900 text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div className="lg:w-1/3 text-right" dir="rtl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 mb-6">
              <Film className="w-5 h-5" />
              <span className="font-bold text-sm">جديد: ركن الدراما</span>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              الصحة في <span className="text-red-500">الدراما</span>
            </h2>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              استكشف كيف تجسد الأعمال الدرامية الواقع الصحي، التحديات الطبية، وقصص الكفاح داخل المستشفيات. نلقي الضوء على الجانب الإنساني والمهني للطب من خلال عدسة الفن.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <PlayCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-300">تحليل دقيق للمشاهد الطبية في الدراما العربية والعالمية</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <Info className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-gray-300">تصحيح المفاهيم الطبية الخاطئة الشائعة في المسلسلات</span>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="lg:w-2/3 w-full">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 group">
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/SbDeMQ26RM8" 
                title="Health in Drama Video"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4 font-medium">
              شاهد الحلقة المميزة: "الأخطاء الطبية في الدراما الرمضانية"
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HealthInDrama;