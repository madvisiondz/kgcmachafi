import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bus as Ambulance, MapPin, Phone, User, Banknote, AlertCircle, Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { wilayas } from '@/lib/algeria-data';
import { contentApi } from '@/lib/localApi';
import { useLanguage } from '@/contexts/LanguageContext';
import ReviewList from '@/components/ReviewList';

const AmbulanceDirectory = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWilaya, setSelectedWilaya] = useState("all");
  const [detailsOpen, setDetailsOpen] = useState(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await contentApi.listAmbulances({ wilayaId: selectedWilaya !== 'all' ? selectedWilaya : undefined });
      setListings(response.items || []);
    } catch (error) {
      console.error('Error fetching ambulances:', error);
      setListings([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, [selectedWilaya]);

  return (
    <section id="ambulances" className="py-16 bg-red-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3 text-red-800">
            <Ambulance className="w-8 h-8" />
            {t('ambulances.title') || "دليل النقل الصحي والإسعاف"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('ambulances.subtitle') || "اعثر على أقرب سيارة إسعاف في ولايتك، أو قم بتسجيل سيارتك لمساعدة المرضى."}
          </p>
        </motion.div>

        {/* Search & Action Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <div className="w-full sm:w-64">
                <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
                    <SelectTrigger>
                        <SelectValue placeholder="اختر الولاية" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                        <SelectItem value="all">كل الولايات</SelectItem>
                        {wilayas.map((w) => (
                            <SelectItem key={w.id} value={w.id}>{w.id} - {w.ar_name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>
             <div className="flex items-center text-sm text-gray-500 gap-2">
                <Search className="w-4 h-4" />
                <span>{listings.length} سيارة متوفرة</span>
             </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
                <div className="col-span-full text-center py-12 text-gray-500">جاري التحميل...</div>
            ) : listings.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">لا توجد سيارات مسجلة في هذه المنطقة حالياً.</p>
                    <p className="mt-2 text-sm text-gray-400">تتم إضافة سيارات الإسعاف الآن من لوحة التحكم فقط.</p>
                </div>
            ) : (
                listings.map((item) => (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                <Ambulance className="w-6 h-6 text-red-600" />
                            </div>
                            {item.is_free ? (
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200">
                                    مجاني
                                </span>
                            ) : (
                                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                    مدفوع
                                </span>
                            )}
                        </div>
                        
                        <h3 className="font-bold text-lg mb-1 text-gray-900">{item.owner_name}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                            <MapPin className="w-3 h-3" />
                            <span>{wilayas.find(w => w.id === item.wilaya_id)?.ar_name}</span>
                            {item.city && <span>- {item.city}</span>}
                        </div>

                        <div className="space-y-2 border-t pt-4">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">نوع المركبة: {item.vehicle_type === 'icu' ? 'إنعاش (ICU)' : item.vehicle_type === 'standard' ? 'عادية' : 'نقل صحي'}</span>
                            </div>
                            {!item.is_free && item.price_description && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Banknote className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{item.price_description}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-6">
                            <Button className="bg-green-600 hover:bg-green-700 gap-2" onClick={() => window.location.href = `tel:${item.phone}`}>
                                <Phone className="w-4 h-4" />
                                اتصل
                            </Button>
                            
                            <Dialog open={detailsOpen === item.id} onOpenChange={(open) => setDetailsOpen(open ? item.id : null)}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <Star className="w-4 h-4" />
                                        التقييمات
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>تقييمات {item.owner_name}</DialogTitle>
                                    </DialogHeader>
                                    <ReviewList targetId={item.id} type="ambulance" />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
      </div>
    </section>
  );
};

export default AmbulanceDirectory;