import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Globe2, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const HealthExhibitions = () => {
  const events = {
    algeria: [
      { id: 1, title: 'الصالون الدولي للصحة "SIPHAL"', date: '15-18 فيفري 2026', location: 'قصر المعارض، الجزائر العاصمة', desc: 'الملتقى السنوي الأبرز لمهنيي قطاع الصيدلة وشبه الصيدلة في الجزائر، يجمع كبار المصنعين والموزعين.' },
      { id: 2, title: 'معرض الصحة والطب "SIMEM"', date: '10-13 أفريل 2026', location: 'مركز الاتفاقيات، وهران', desc: 'معرض دولي متخصص في التجهيزات الطبية، الاستشفائية، ومعدات المخابر، بمشاركة شركات عالمية.' },
    ],
    arab: [
      { id: 3, title: 'الصحة العربي (Arab Health)', date: '27-30 جانفي 2026', location: 'دبي، الإمارات العربية المتحدة', desc: 'أضخم حدث للرعاية الصحية في منطقة الشرق الأوسط وشمال أفريقيا، يجمع آلاف العارضين من حول العالم.' },
      { id: 4, title: 'المؤتمر الطبي السعودي الدولي', date: '15-17 مارس 2026', location: 'الرياض، المملكة العربية السعودية', desc: 'منصة رائدة لاستعراض أحدث الابتكارات في مجال الرعاية الصحية الرقمية والذكاء الاصطناعي في الطب.' },
    ],
    world: [
      { id: 5, title: 'MEDICA', date: '11-14 نوفمبر 2026', location: 'دوسلدورف، ألمانيا', desc: 'المنتدى العالمي للطب، يعتبر المعرض التجاري الرائد عالمياً لقطاع التكنولوجيا الطبية.' },
      { id: 6, title: 'FIME', date: '23-25 جوان 2026', location: 'ميامي، الولايات المتحدة', desc: 'أكبر معرض تجاري للأجهزة والمعدات الطبية في الأمريكيتين، بوابة رئيسية للأسواق العالمية.' },
    ]
  };

  const EventCard = ({ event }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 hover:shadow-md hover:border-indigo-200 transition-all group"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
            {event.date}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
          {event.desc}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block p-3 bg-white rounded-full shadow-md mb-4 text-indigo-600"
          >
            <Globe2 className="w-8 h-8" />
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-indigo-950">
            معارض قطاع الصحة
          </h2>
          <p className="text-indigo-800/70 text-lg">
            أجندة أهم الفعاليات الطبية المحلية، العربية، والعالمية
          </p>
        </div>

        <Tabs defaultValue="algeria" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-white/80 backdrop-blur rounded-xl border border-indigo-100 shadow-sm">
            <TabsTrigger value="algeria" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white">الجزائر</TabsTrigger>
            <TabsTrigger value="arab" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white">الوطن العربي</TabsTrigger>
            <TabsTrigger value="world" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white">العالم</TabsTrigger>
          </TabsList>
          
          <TabsContent value="algeria" className="grid grid-cols-1 md:grid-cols-2 gap-6 outline-none animate-in fade-in-50 zoom-in-95 duration-300">
            {events.algeria.map(e => <EventCard key={e.id} event={e} />)}
          </TabsContent>
          <TabsContent value="arab" className="grid grid-cols-1 md:grid-cols-2 gap-6 outline-none animate-in fade-in-50 zoom-in-95 duration-300">
            {events.arab.map(e => <EventCard key={e.id} event={e} />)}
          </TabsContent>
          <TabsContent value="world" className="grid grid-cols-1 md:grid-cols-2 gap-6 outline-none animate-in fade-in-50 zoom-in-95 duration-300">
            {events.world.map(e => <EventCard key={e.id} event={e} />)}
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-10">
           <Button variant="link" className="text-indigo-600 gap-2 hover:text-indigo-800">
             عرض المزيد من الفعاليات <ArrowRight className="w-4 h-4" />
           </Button>
        </div>
      </div>
    </section>
  );
};

export default HealthExhibitions;