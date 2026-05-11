import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, CheckCircle2, ArrowRight, ChevronLeft, Star, Hotel as Hospital, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/contexts/SiteContentContext';

const defaultSection = {
  section_title: 'احجز استشارتك',
  section_subtitle: 'تواصل مع أطباء متخصصين عبر الفيديو',
  sidebar_title: 'احجز استشارتك',
  contact_phone: '+213 2813-3022',
};

const Consultations = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { settings, consultation_specialties, consultation_doctors } = useSiteContent();
  const sectionContent = { ...defaultSection, ...(settings.consultations_content || {}) };

  const doctorsBySpecialty = useMemo(() => {
    return consultation_doctors.reduce((accumulator, doctor) => {
      const key = Number(doctor.specialty_id);
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(doctor);
      return accumulator;
    }, {});
  }, [consultation_doctors]);

  const getDoctors = (id) => doctorsBySpecialty[id] || [];

  const handleBookingSubmit = (event) => {
    event.preventDefault();
    setIsBookingOpen(false);
    toast({
      title: t('consultations.bookingSuccess'),
      description: `${t('consultations.bookWith')} ${selectedDoctor.name}`,
    });
    setSelectedDoctor(null);
  };

  return (
    <section id="consultations" className="py-12 bg-white/50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {sectionContent.section_title}
            </span>
          </h2>
          <p className="text-gray-600 text-lg">{sectionContent.section_subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!selectedSpecialty ? (
                <motion.div key="specialties" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {consultation_specialties.map((specialty, index) => (
                    <motion.div
                      key={specialty.id || index}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 hover:border-green-200 group"
                      onClick={() => setSelectedSpecialty(specialty)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${specialty.color_class} flex items-center justify-center text-3xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                          {specialty.icon_emoji}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg mb-1">{specialty.name}</h3>
                          <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                            {specialty.doctors_count} {t('consultations.availableDoctors')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="doctors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">{t('consultations.availableDoctors')}: {selectedSpecialty.name}</h3>
                    <Button variant="outline" onClick={() => setSelectedSpecialty(null)} className="gap-2">
                      {isRTL ? <ArrowRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                      {t('consultations.backToSpecialties')}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {getDoctors(selectedSpecialty.id).map((doctor) => (
                      <div key={doctor.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 flex-shrink-0">
                          <User className="w-12 h-12" />
                        </div>
                        <div className="flex-1 text-center sm:text-start">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <h4 className="text-xl font-bold text-gray-900">{doctor.name}</h4>
                            <div className="flex items-center justify-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-lg mt-2 sm:mt-0 w-fit mx-auto sm:mx-0">
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <span className="font-bold text-sm">{doctor.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm mb-1 flex items-center justify-center sm:justify-start gap-2">
                            <Hospital className="w-4 h-4" /> {doctor.hospital}
                          </p>
                          <p className="text-gray-500 text-sm mb-4 flex items-center justify-center sm:justify-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> {doctor.experience_years} {t('consultations.years')} {t('consultations.experience')}
                          </p>
                          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                            <div className="font-bold text-lg text-green-700">
                              {doctor.price} {doctor.currency} <span className="text-xs text-gray-400 font-normal">/ {t('consultations.fee')}</span>
                            </div>
                            <Dialog
                              open={isBookingOpen && selectedDoctor?.id === doctor.id}
                              onOpenChange={(open) => {
                                setIsBookingOpen(open);
                                if (open) setSelectedDoctor(doctor);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button className="w-full sm:w-auto ml-auto bg-green-600 hover:bg-green-700">
                                  {t('common.bookNow')}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{t('consultations.bookWith')} {doctor.name}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
                                  <div className="space-y-2">
                                    <Label>{t('consultations.fullName')}</Label>
                                    <input className="w-full p-2 border rounded-md" required placeholder={t('consultations.fullName')} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>{t('consultations.phoneNumber')}</Label>
                                    <input className="w-full p-2 border rounded-md" type="tel" required placeholder="+213..." dir="ltr" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>{t('consultations.notes')}</Label>
                                    <textarea className="w-full p-2 border rounded-md h-24" placeholder="..." />
                                  </div>
                                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">{t('consultations.confirmBooking')}</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-xl sticky top-24">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{sectionContent.sidebar_title}</h3>

              <div className="space-y-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white text-green-600 flex items-center justify-center font-bold shadow-sm flex-shrink-0 border border-green-100">
                      {step}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">{t('consultations.selectDoctor')}</h4>
                      <p className="text-gray-600 text-xs">اختر التخصص ثم الطبيب وحدد موعدك المناسب.</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-white rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-gray-800">{t('common.contactUs')}</span>
                </div>
                <p className="font-bold text-lg text-green-600" dir="ltr">{sectionContent.contact_phone}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Consultations;
