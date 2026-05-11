import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hotel as Hospital, MapPin, Phone, Search, Globe2, Building2, HeartPulse, 
  Stethoscope, Plane, Star, CheckCircle2, Clock, CreditCard, ShieldCheck, 
  Video, CalendarCheck, Globe, Banknote, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCommunes, wilayas } from '@/lib/algeria-data';
import {
  getInternationalHospitalCountryLabel,
  INTERNATIONAL_HOSPITAL_COUNTRIES,
  INTERNATIONAL_HOSPITAL_SPECIALTIES,
} from '@/lib/hospitalOptions';
import { contentApi } from '@/lib/localApi';

const Hospitals = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [activeTab, setActiveTab] = useState('algeria'); // 'algeria' or 'abroad'
  
  // Algeria Search State
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  // Abroad Search State
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const [algeriaHospitals, setAlgeriaHospitals] = useState([]);
  const [loadingLocalHospitals, setLoadingLocalHospitals] = useState(true);
  const [internationalHospitals, setInternationalHospitals] = useState([]);
  const [loadingInternationalHospitals, setLoadingInternationalHospitals] = useState(true);

  const getCountryLabel = (country) => {
    const translated = t(`hospitals.countries.${country}`);
    return translated === `hospitals.countries.${country}`
      ? getInternationalHospitalCountryLabel(country)
      : translated;
  };

  const availableCommunes = useMemo(() => {
    if (!selectedWilaya) {
      return [];
    }

    return getCommunes(selectedWilaya);
  }, [selectedWilaya]);

  // Filter Logic
  useEffect(() => {
    const loadHospitals = async () => {
      setLoadingLocalHospitals(true);

      try {
        const response = await contentApi.listHospitals({
          wilayaId: selectedWilaya || undefined,
          type: selectedType,
          city: selectedCommune || undefined,
        });

        setAlgeriaHospitals((response.items || []).map((item) => ({
          ...item,
          wilaya: item.wilaya_id,
          reviews: item.reviews_count,
          payment: item.payment_methods || [],
          insurance: item.insurance_providers || [],
        })));
      } catch (error) {
        console.error(error);
        toast({
          title: 'تعذر تحميل المستشفيات',
          description: 'حدث خطأ أثناء جلب بيانات المستشفيات المحلية.',
          variant: 'destructive',
        });
        setAlgeriaHospitals([]);
      } finally {
        setLoadingLocalHospitals(false);
      }
    };

    loadHospitals();
  }, [selectedCommune, selectedType, selectedWilaya]);

  useEffect(() => {
    const loadInternationalHospitals = async () => {
      setLoadingInternationalHospitals(true);

      try {
        const response = await contentApi.listInternationalHospitals({
          country: selectedCountry,
          specialty: selectedSpecialty,
        });

        setInternationalHospitals((response.items || []).map((item) => ({
          ...item,
          desc: item.description,
          reviews: item.reviews_count,
          payment: item.payment_methods || [],
          insurance: item.insurance_providers || [],
        })));
      } catch (error) {
        console.error(error);
        toast({
          title: 'تعذر تحميل مستشفيات العلاج بالخارج',
          description: 'حدث خطأ أثناء جلب بيانات المستشفيات الخارجية.',
          variant: 'destructive',
        });
        setInternationalHospitals([]);
      } finally {
        setLoadingInternationalHospitals(false);
      }
    };

    loadInternationalHospitals();
  }, [selectedCountry, selectedSpecialty]);

  useEffect(() => {
    setSelectedCommune('');
  }, [selectedWilaya]);

  const filteredAlgeria = useMemo(() => algeriaHospitals, [algeriaHospitals]);

  const filteredInternational = useMemo(() => internationalHospitals, [internationalHospitals]);

  const handleAction = (action, data) => {
    if (action === 'Website') {
      if (data.website) {
        // In a real app, we might use window.open. Here we simulate navigation success.
        toast({
            title: "جاري فتح الموقع",
            description: `يتم الآن تحويلك إلى ${data.website}`,
        });
        // window.open(`https://${data.website}`, '_blank'); 
      } else {
        toast({ title: "الموقع غير متوفر", description: "عذراً، هذا المستشفى لا يملك موقعاً إلكترونياً حالياً." });
      }
    } else if (action === 'Booking') {
      // Redirect to Consultations section for booking
      const element = document.getElementById('consultations');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        toast({ 
            title: "حجز موعد", 
            description: `جاري تحويلك لقسم الاستشارات لحجز موعد مع ${data.name}...` 
        });
      } else {
        toast({ title: t('common.featureNotImplemented') });
      }
    }
  };

  // Reusable Card Component for internal use within Hospitals
  const HospitalCard = ({ data, isInternational = false }) => {
    const hasFeature = (feature) => data.features?.includes(feature);

    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group relative flex flex-col h-full">
        {/* Header / Image Area */}
        <div className={`h-36 p-6 relative overflow-hidden ${isInternational ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
           {isInternational && (
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center"></div>
           )}
           
           <div className="flex justify-between items-start relative z-10">
              {!isInternational ? (
                <div className="p-3 bg-white/80 backdrop-blur rounded-xl text-blue-600 shadow-sm">
                  <Hospital className="w-8 h-8" />
                </div>
              ) : (
                <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-lg border border-white/30 text-xs font-bold flex items-center gap-2">
                  <Globe2 className="w-3 h-3" />
                  {getCountryLabel(data.country)}
                </div>
              )}
              
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-lg shadow-sm">
                   <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                   <span className="text-xs font-bold text-gray-800">{data.rating}</span>
                   <span className="text-[10px] text-gray-400">({data.reviews})</span>
                </div>
                {isInternational && (
                  <span className="mt-2 text-xs bg-black/20 px-2 py-0.5 rounded text-white/90">
                    {t(`hospitals.details.reviews`)}: {data.reviews}
                  </span>
                )}
              </div>
           </div>

           <div className="absolute bottom-4 left-4 right-4 relative z-10">
             <h3 className={`font-bold text-lg line-clamp-1 ${isInternational ? 'text-white' : 'text-gray-900'}`}>
               {data.name}
             </h3>
             {!isInternational && (
                <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-md">
                   {t(`hospitals.types.${data.type}`)}
                </span>
             )}
           </div>
        </div>

        {/* Body Content */}
        <div className="p-5 flex-1 flex flex-col gap-4">
           {/* Location & Contact */}
           <div className="space-y-2">
              <p className="text-gray-500 text-sm flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                <span className="line-clamp-2">{data.address || `${data.city}, ${getCountryLabel(data.country)}`}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                 <div className="flex items-center gap-1">
                   <Clock className="w-3.5 h-3.5 text-emerald-500" />
                   <span>{data.hours === "24/7" ? t('hospitals.details.open24') : data.hours}</span>
                 </div>
                 {data.phone && (
                   <div className="flex items-center gap-1">
                     <Phone className="w-3.5 h-3.5 text-blue-500" />
                     <span dir="ltr">{data.phone}</span>
                   </div>
                 )}
              </div>
           </div>

           {/* Info Grid */}
           <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
             {/* Insurance */}
             <div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{t('hospitals.details.insurance')}</span>
               <div className="flex flex-wrap gap-1">
                 {data.insurance?.slice(0, 2).map((ins, i) => (
                   <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">
                     {ins}
                   </span>
                 ))}
                 {data.insurance?.length > 2 && <span className="text-[10px] text-gray-400">+{data.insurance.length - 2}</span>}
               </div>
             </div>
             {/* Payment */}
             <div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{t('hospitals.details.payment')}</span>
               <div className="flex items-center gap-1 text-gray-600">
                 {data.payment?.includes('card') && <CreditCard className="w-4 h-4" title={t('hospitals.paymentMethods.card')} />}
                 {data.payment?.includes('cash') && <Banknote className="w-4 h-4" title={t('hospitals.paymentMethods.cash')} />}
                 {data.payment?.includes('transfer') && <Globe className="w-4 h-4" title={t('hospitals.paymentMethods.transfer')} />}
               </div>
             </div>
           </div>

           {/* Badges */}
           <div className="flex flex-wrap gap-2 mt-auto">
             {hasFeature('online_consult') && (
               <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100 flex items-center gap-1">
                 <Video className="w-3 h-3" /> {t('hospitals.details.onlineConsult')}
               </span>
             )}
             {hasFeature('direct_booking') && (
               <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                 <CalendarCheck className="w-3 h-3" /> {t('hospitals.details.directBooking')}
               </span>
             )}
           </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 grid grid-cols-2 gap-2">
           <Button variant="outline" size="sm" className="w-full bg-white hover:bg-gray-100 text-xs" onClick={() => handleAction("Website", data)}>
             <Globe2 className="w-3 h-3 mr-1" /> {t('hospitals.details.website')}
           </Button>
           <Button size="sm" className={`w-full text-xs ${isInternational ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}`} onClick={() => handleAction("Booking", data)}>
             {hasFeature('direct_booking') ? t('common.bookNow') : t('hospitals.contactCenter')}
           </Button>
        </div>
      </div>
    );
  };

  return (
    <section id="hospitals" className="py-16 bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="inline-block p-3 bg-blue-100 text-blue-700 rounded-full mb-4"
          >
            <Building2 className="w-8 h-8" />
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">
            {t('hospitals.title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('hospitals.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-full shadow-sm border inline-flex relative">
            <button
              onClick={() => setActiveTab('algeria')}
              className={`relative z-10 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'algeria' ? 'text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              {t('hospitals.tabs.local')}
            </button>
            
            <button
              onClick={() => setActiveTab('abroad')}
              className={`relative z-10 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'abroad' ? 'text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Plane className="w-4 h-4" />
              {t('hospitals.tabs.abroad')}
            </button>

            {/* Animated Background Pill */}
            <div 
              className={`absolute top-1.5 bottom-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ease-in-out ${
                activeTab === 'algeria' 
                  ? (isRTL ? 'right-1.5 w-[50%]' : 'left-1.5 w-[50%]') 
                  : (isRTL ? 'right-[50%] w-[49%]' : 'left-[50%] w-[49%]')
              }`}
            ></div>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'algeria' ? (
            <motion.div
              key="algeria"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search Filters for Algeria */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t('hospitals.filters.wilaya')}</label>
                    <select 
                      className="w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedWilaya}
                      onChange={(e) => setSelectedWilaya(e.target.value)}
                    >
                      <option value="">{t('hospitals.types.all')}</option>
                      {wilayas.map(w => (
                        <option key={w.id} value={w.id}>{w.id} - {isRTL ? w.ar_name : w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">البلدية</label>
                    <select
                      className="w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60"
                      value={selectedCommune}
                      onChange={(e) => setSelectedCommune(e.target.value)}
                      disabled={!selectedWilaya}
                    >
                      <option value="">كل البلديات</option>
                      {availableCommunes.map((commune) => (
                        <option key={commune.id} value={commune.ar_name}>
                          {commune.ar_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t('hospitals.filters.type')}</label>
                    <select 
                      className="w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="all">{t('hospitals.types.all')}</option>
                      <option value="public">{t('hospitals.types.public')}</option>
                      <option value="private">{t('hospitals.types.private')}</option>
                      <option value="specialized">{t('hospitals.types.specialized')}</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-lg" onClick={() => {
                        // Visual feedback for search
                        const container = document.getElementById('hospitals');
                        if(container) container.scrollIntoView({ behavior: 'smooth' });
                        toast({ title: "تم تحديث النتائج", description: `تم العثور على ${filteredAlgeria.length} مستشفى` });
                    }}>
                      <Search className="w-5 h-5 mr-2" />
                      {t('common.hospitalSearch')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Algeria Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingLocalHospitals ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">جاري تحميل المستشفيات...</p>
                  </div>
                ) : filteredAlgeria.map((hospital) => (
                  <HospitalCard key={hospital.id} data={hospital} isInternational={false} />
                ))}
                {!loadingLocalHospitals && filteredAlgeria.length === 0 && (
                   <div className="col-span-full text-center py-12">
                     <p className="text-gray-500 text-lg">لا توجد نتائج مطابقة للبحث</p>
                   </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="abroad"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
               {/* Info Banner for Abroad */}
               <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-full shadow-sm text-indigo-600 hidden md:block">
                    <Globe2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-900 text-lg mb-1">{t('hospitals.tabs.abroad')}</h3>
                    <p className="text-indigo-700 opacity-80">
                      {t('hospitals.abroadSubtitle')} - {t('nav.kgcNetwork')}
                    </p>
                  </div>
               </div>

               {/* Search Filters for Abroad */}
               <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t('hospitals.filters.country')}</label>
                    <select 
                      className="w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                      <option value="all">{t('hospitals.types.all')}</option>
                      {INTERNATIONAL_HOSPITAL_COUNTRIES.map((country) => (
                        <option key={country.value} value={country.value}>{getCountryLabel(country.value)}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t('hospitals.filters.specialty')}</label>
                    <select 
                      className="w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                    >
                      <option value="all">{t('hospitals.types.all')}</option>
                      {INTERNATIONAL_HOSPITAL_SPECIALTIES.map((specialty) => (
                        <option key={specialty.value} value={specialty.value}>{specialty.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-lg" onClick={() => {
                        toast({ title: "تم تحديث النتائج", description: `تم العثور على ${filteredInternational.length} عيادة دولية` });
                    }}>
                      <Search className="w-5 h-5 mr-2" />
                      {t('common.hospitalSearch')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* International Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingInternationalHospitals ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">جاري تحميل مستشفيات العلاج بالخارج...</p>
                  </div>
                ) : filteredInternational.map((clinic) => (
                   <HospitalCard key={clinic.id} data={clinic} isInternational={true} />
                ))}
                {!loadingInternationalHospitals && filteredInternational.length === 0 && (
                   <div className="col-span-full text-center py-12">
                     <p className="text-gray-500 text-lg">لا توجد نتائج مطابقة للبحث</p>
                   </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Hospitals;