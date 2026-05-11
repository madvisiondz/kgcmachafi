import React from 'react';
import { motion } from 'framer-motion';
import { Package, Phone, MapPin, Stethoscope, ShieldCheck, Microscope, Syringe, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const MedicalSupplies = () => {
  const suppliers = [
    { 
      id: 1, 
      name: 'مؤسسة الشفاء للتجهيزات', 
      type: 'معدات طبية ثقيلة', 
      desc: 'تجهيز غرف العمليات والإنعاش بأحدث المعدات الألمانية.',
      location: 'الجزائر العاصمة', 
      phone: '021 55 44 33',
      icon: Stethoscope,
      color: 'text-blue-600 bg-blue-100'
    },
    { 
      id: 2, 
      name: 'تكنو لاب (TechnoLab)', 
      type: 'تجهيزات مخبرية', 
      desc: 'كل ما يحتاجه مخبر التحاليل من كواشف وأجهزة دقيقة.',
      location: 'وهران', 
      phone: '041 33 22 11',
      icon: Microscope,
      color: 'text-purple-600 bg-purple-100'
    },
    { 
      id: 3, 
      name: 'بيو ميديكال (BioMedical)', 
      type: 'مستهلكات طبية', 
      desc: 'توريد الحقن، القفازات، والضمادات للمستشفيات والعيادات.',
      location: 'قسنطينة', 
      phone: '031 66 77 88',
      icon: Syringe,
      color: 'text-emerald-600 bg-emerald-100'
    },
    { 
      id: 4, 
      name: 'الأمل للأطراف الصناعية', 
      type: 'أجهزة تعويضية', 
      desc: 'صناعة وتركيب الأطراف الصناعية والمعدات الحركية.',
      location: 'سطيف', 
      phone: '036 99 88 77',
      icon: ShieldCheck,
      color: 'text-orange-600 bg-orange-100'
    },
  ];

  const handleContact = (name) => {
    toast({
      title: "طلب تواصل",
      description: `سيتم تحويلك للاتصال بـ ${name}`,
    });
  };

  return (
    <section className="py-16 bg-white" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="inline-flex p-3 bg-blue-50 rounded-full mb-4 text-blue-600"
           >
             <Package className="w-8 h-8" />
           </motion.div>
           <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-slate-900">
             مؤسسات المستلزمات الطبية والمخبرية
           </h2>
           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
             دليل شامل لأهم الموردين والمصنعين للمعدات الطبية في الجزائر
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suppliers.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
               <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${item.color}`}>
                 <item.icon className="w-7 h-7" />
               </div>
               
               <h3 className="font-bold text-xl text-slate-900 mb-2">{item.name}</h3>
               <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit mb-3">{item.type}</span>
               
               <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">
                 {item.desc}
               </p>
               
               <div className="mt-auto pt-4 border-t border-slate-200 space-y-3">
                 <div className="flex items-center gap-2 text-gray-500 text-sm">
                   <MapPin className="w-4 h-4" />
                   {item.location}
                 </div>
                 <div className="flex items-center gap-2 text-gray-500 text-sm">
                   <Phone className="w-4 h-4" />
                   <span dir="ltr">{item.phone}</span>
                 </div>
                 
                 <Button onClick={() => handleContact(item.name)} className="w-full mt-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                   تواصل مع المؤسسة
                 </Button>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MedicalSupplies;