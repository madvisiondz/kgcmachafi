import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSiteContent } from '@/contexts/SiteContentContext';
import { serviceIcons } from '@/lib/siteContentIcons';

const defaultSection = {
  section_title: 'الخدمات والمساعدات الصحية',
  section_subtitle: 'خدمات صحية متكاملة تلبي احتياجاتك في المنزل والمستشفى، مع شبكة واسعة من المحترفين لخدمتك.',
};

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { settings, services } = useSiteContent();
  const sectionContent = { ...defaultSection, ...(settings.services_content || {}) };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleContactSupport = () => {
    setIsDialogOpen(false);
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {sectionContent.section_title}
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {sectionContent.section_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = serviceIcons[service.icon_key] || serviceIcons.heart;

              return (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${service.bg_class} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-opacity-20 relative overflow-hidden h-full flex flex-col`}
                  onClick={() => handleServiceClick(service)}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color_class} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 transition-all">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">{service.description}</p>
                  <Button variant="ghost" className="w-full group-hover:bg-white/80 transition-colors mt-auto">
                    طلب الخدمة
                  </Button>
                </motion.div>
              );
            })}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-md">
              {selectedService && (
                <>
                  <DialogHeader>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedService.color_class} flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                      {(() => {
                        const IconComponent = serviceIcons[selectedService.icon_key] || serviceIcons.heart;
                        return <IconComponent className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold text-gray-800">
                      {selectedService.title}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <p className="text-gray-600 text-center leading-relaxed">
                      {selectedService.details}
                    </p>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                      <h4 className="font-bold text-gray-800 mb-2 text-sm">مميزات الخدمة:</h4>
                      {(selectedService.features || []).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                      إغلاق
                    </Button>
                    <Button onClick={handleContactSupport} className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700">
                      <Phone className="w-4 h-4" />
                      اتصل بنا
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
