import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Microscope, MapPin, Search, FlaskConical, Phone, Clock, 
  CheckCircle2, Building2, Filter, Beaker, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { wilayas, getCommunes } from '@/lib/algeria-data';

const Laboratories = () => {
  // State for filters
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedBaladiya, setSelectedBaladiya] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, private, public

  // Dynamic communes based on selected Wilaya
  const availableCommunes = useMemo(() => {
    if (!selectedWilaya) return [];
    return getCommunes(selectedWilaya);
  }, [selectedWilaya]);

  // Mock Data for Laboratories
  const laboratories = [
    { 
      id: 1, 
      name: "مخبر البركة للتحاليل الطبية", 
      type: "private", 
      wilaya: "16", 
      baladiya: "1601", 
      address: "23 شارع العربي بن مهيدي، الجزائر الوسطى", 
      phone: "021 63 11 22",
      hours: "07:00 - 19:00",
      services: ["تحاليل شاملة", "هرمونات", "PCR"],
      rating: 4.8
    },
    { 
      id: 2, 
      name: "مخبر المستشفى الجامعي", 
      type: "public", 
      wilaya: "31", 
      baladiya: "3101", 
      address: "حي بلاطو، وهران", 
      phone: "041 41 11 11",
      hours: "24/7",
      services: ["تحاليل استعجالية", "ميكروبيولوجيا", "دم"],
      rating: 4.0
    },
    { 
      id: 3, 
      name: "مخبر الشفاء", 
      type: "private", 
      wilaya: "25", 
      baladiya: "2501", 
      address: "حي 500 مسكن، قسنطينة", 
      phone: "031 99 88 77",
      hours: "07:30 - 18:00",
      services: ["كيمياء حيوية", "مناعة"],
      rating: 4.5
    },
    { 
      id: 4, 
      name: "مخبر ابن سينا", 
      type: "private", 
      wilaya: "16", 
      baladiya: "1635", 
      address: "سيدي يحيى، حيدرة", 
      phone: "023 55 44 33",
      hours: "07:00 - 20:00",
      services: ["جينات", "خصوبة", "كشف مبكر"],
      rating: 4.9
    },
    { 
      id: 5, 
      name: "المخبر المركزي العمومي", 
      type: "public", 
      wilaya: "30", 
      baladiya: "3001", 
      address: "وسط المدينة، ورقلة", 
      phone: "029 71 22 11",
      hours: "08:00 - 16:00",
      services: ["تحاليل عامة", "أمراض متنقلة"],
      rating: 3.8
    },
    { 
      id: 6, 
      name: "مخبر الحياة", 
      type: "private", 
      wilaya: "19", 
      baladiya: "1901", 
      address: "حي المعبودة، سطيف", 
      phone: "036 61 22 33",
      hours: "07:00 - 18:30",
      services: ["تحاليل السكري", "فيتامينات"],
      rating: 4.6
    }
  ];

  // Filter Logic
  const filteredLabs = laboratories.filter(lab => {
    const matchWilaya = !selectedWilaya || lab.wilaya === selectedWilaya;
    const matchBaladiya = !selectedBaladiya || lab.baladiya === selectedBaladiya;
    const matchType = selectedType === 'all' || lab.type === selectedType;
    return matchWilaya && matchBaladiya && matchType;
  });

  const handleSearch = () => {
    const resultsSection = document.getElementById('labs-results');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    toast({
      title: "تم تحديث النتائج",
      description: `تم العثور على ${filteredLabs.length} مخبر تحاليل`,
    });
  };

  const getWilayaName = (id) => wilayas.find(w => w.id === id)?.ar_name || id;
  const getBaladiyaName = (wid, bid) => getCommunes(wid).find(c => c.id === bid)?.ar_name || bid;

  return (
    <section id="laboratories" className="py-16 bg-slate-50 relative overflow-hidden" dir="rtl">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex p-4 bg-white shadow-lg rounded-2xl mb-4 text-blue-600"
          >
            <Microscope className="w-10 h-10" />
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">
            دليل المخابر الطبية
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            ابحث عن أقرب مخبر تحاليل طبية عمومي أو خاص، وتعرف على الخدمات المتاحة وأوقات العمل.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-50 mb-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Wilaya */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                اختر الولاية
              </label>
              <select 
                className="w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={selectedWilaya}
                onChange={(e) => {
                  setSelectedWilaya(e.target.value);
                  setSelectedBaladiya('');
                }}
              >
                <option value="">كل الولايات</option>
                {wilayas.map(w => (
                  <option key={w.id} value={w.id}>{w.id} - {w.ar_name}</option>
                ))}
              </select>
            </div>

            {/* Baladiya */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                اختر البلدية
              </label>
              <select 
                className="w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                value={selectedBaladiya}
                onChange={(e) => setSelectedBaladiya(e.target.value)}
                disabled={!selectedWilaya}
              >
                <option value="">
                  {availableCommunes.length > 0 ? "كل البلديات" : (selectedWilaya ? "لا توجد بيانات" : "اختر الولاية أولاً")}
                </option>
                {availableCommunes.map(c => (
                  <option key={c.id} value={c.id}>{c.ar_name}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-500" />
                نوع المخبر
              </label>
              <select 
                className="w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">الكل</option>
                <option value="private">خاص (Privé)</option>
                <option value="public">عمومي (Public)</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button 
                onClick={handleSearch} 
                className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-lg shadow-lg shadow-blue-200 transition-transform active:scale-95"
              >
                <Search className="w-5 h-5 ml-2" />
                بحث
              </Button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div id="labs-results" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredLabs.length > 0 ? (
              filteredLabs.map((lab, index) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                >
                  {/* Card Header */}
                  <div className={`p-5 relative overflow-hidden ${lab.type === 'public' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <FlaskConical className="w-24 h-24 text-white" />
                    </div>
                    <div className="relative z-10 flex justify-between items-start">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md bg-white/20 text-white backdrop-blur-sm border border-white/30`}>
                        {lab.type === 'public' ? 'عمومي' : 'خاص'}
                      </span>
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                         <Activity className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-4 line-clamp-1 relative z-10">{lab.name}</h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-1 text-blue-500 shrink-0" />
                        <span className="line-clamp-2">{lab.address} - {getWilayaName(lab.wilaya)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span dir="ltr">{lab.hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-purple-500 shrink-0" />
                        <span dir="ltr" className="font-medium">{lab.phone}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 mt-auto">
                      <p className="text-xs font-bold text-gray-400 mb-2">الخدمات المتوفرة:</p>
                      <div className="flex flex-wrap gap-2">
                        {lab.services.map((service, idx) => (
                          <span key={idx} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200" onClick={() => toast({ title: "الموقع الجغرافي", description: "جاري فتح الخريطة..." })}>
                      <MapPin className="w-3 h-3 ml-1" />
                      الموقع
                    </Button>
                    <Button className={`w-full text-xs ${lab.type === 'public' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`} onClick={() => toast({ title: "اتصال", description: `جاري الاتصال بـ ${lab.phone}` })}>
                      <Phone className="w-3 h-3 ml-1" />
                      اتصل الآن
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Beaker className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-400">لا توجد مخابر مطابقة للبحث</h3>
                <p className="text-gray-400 mt-2">يرجى تغيير معايير البحث والمحاولة مرة أخرى</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Laboratories;