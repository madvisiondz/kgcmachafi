import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Edit, Globe2, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { getCommunes, wilayas } from '@/lib/algeria-data';
import { getBestMatchingCommune, getFilteredCommunes } from '@/lib/algeriaLocation';
import { adminApi } from '@/lib/localApi';
import { getBestMatchingWilaya, getFilteredWilayas } from '@/lib/wilayaSearch';

const initialForm = {
  name: '',
  type: 'public',
  wilaya_id: '',
  city: '',
  address: '',
  specialties: '',
  rating: '4.0',
  reviews_count: '0',
  hours: '24/7',
  phone: '',
  website: '',
  payment_methods: 'cash',
  insurance_providers: 'CNAS',
  features: 'emergency',
  sort_order: '0',
  is_active: true,
};

const HospitalsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [wilayaSearch, setWilayaSearch] = useState('');
  const [communeSearch, setCommuneSearch] = useState('');
  const { toast } = useToast();

  const filteredWilayas = useMemo(() => getFilteredWilayas(wilayas, wilayaSearch), [wilayaSearch]);
  const availableCommunes = useMemo(() => getFilteredCommunes(formData.wilaya_id, communeSearch), [communeSearch, formData.wilaya_id]);

  const loadItems = async () => {
    setLoading(true);

    try {
      const response = await adminApi.listHospitals();
      setItems(response.items || []);
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setWilayaSearch('');
    setCommuneSearch('');
  };

  const normalizeTextList = (value) => value.split(/[,\n]+/).map((item) => item.trim()).filter(Boolean);

  const buildPayload = () => ({
    ...formData,
    specialties: normalizeTextList(formData.specialties),
    payment_methods: normalizeTextList(formData.payment_methods),
    insurance_providers: normalizeTextList(formData.insurance_providers),
    features: normalizeTextList(formData.features),
    rating: Number(formData.rating || 0),
    reviews_count: Number(formData.reviews_count || 0),
    sort_order: Number(formData.sort_order || 0),
  });

  const handleSave = async () => {
    if (!formData.name || !formData.wilaya_id || !formData.city || !formData.address || !formData.phone) {
      toast({
        title: 'بيانات ناقصة',
        description: 'أدخل اسم المستشفى والولاية والبلدية والعنوان ورقم الهاتف.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const payload = buildPayload();

      if (editingId) {
        await adminApi.updateHospital(editingId, payload);
      } else {
        await adminApi.createHospital(payload);
      }

      toast({
        title: 'تم الحفظ',
        description: editingId ? 'تم تحديث المستشفى.' : 'تمت إضافة المستشفى.',
      });
      setIsDialogOpen(false);
      resetForm();
      loadItems();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (item) => {
    const activeWilaya = wilayas.find((wilaya) => wilaya.id === String(item.wilaya_id));
    const activeCommune = getBestMatchingCommune(item.wilaya_id, item.city || '');

    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      type: item.type || 'public',
      wilaya_id: item.wilaya_id || '',
      city: item.city || '',
      address: item.address || '',
      specialties: (item.specialties || []).join(', '),
      rating: item.rating != null ? String(item.rating) : '4.0',
      reviews_count: item.reviews_count != null ? String(item.reviews_count) : '0',
      hours: item.hours || '24/7',
      phone: item.phone || '',
      website: item.website || '',
      payment_methods: (item.payment_methods || []).join(', '),
      insurance_providers: (item.insurance_providers || []).join(', '),
      features: (item.features || []).join(', '),
      sort_order: item.sort_order != null ? String(item.sort_order) : '0',
      is_active: Boolean(item.is_active),
    });
    setWilayaSearch(activeWilaya ? `${activeWilaya.id} - ${activeWilaya.ar_name}` : '');
    setCommuneSearch(activeCommune?.ar_name || item.city || '');
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('حذف هذا المستشفى؟')) {
      return;
    }

    try {
      await adminApi.deleteHospital(id);
      toast({ title: 'تم الحذف', description: 'تم حذف المستشفى.' });
      loadItems();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const getWilayaName = (wilayaId) => wilayas.find((item) => item.id === String(wilayaId))?.ar_name || wilayaId;
  const getTypeLabel = (type) => {
    if (type === 'private') return 'خاص';
    if (type === 'specialized') return 'متخصص';
    return 'عمومي';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Building2 className="h-6 w-6 text-blue-600" />
          إدارة المستشفيات
        </h2>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              إضافة مستشفى
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل المستشفى' : 'إضافة مستشفى جديد'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>اسم المستشفى</Label>
                  <Input value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} placeholder="مثال: المستشفى الجامعي..." />
                </div>
                <div className="grid gap-2">
                  <Label>رقم الهاتف</Label>
                  <Input value={formData.phone} onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))} placeholder="021 00 00 00" dir="ltr" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>الولاية</Label>
                  <Input
                    value={wilayaSearch}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      const bestMatch = getBestMatchingWilaya(wilayas, nextValue);

                      setWilayaSearch(nextValue);
                      setFormData((current) => ({
                        ...current,
                        wilaya_id: bestMatch?.id || '',
                        city: current.wilaya_id === bestMatch?.id ? current.city : '',
                      }));
                      if (formData.wilaya_id !== bestMatch?.id) {
                        setCommuneSearch('');
                      }
                    }}
                    placeholder="ابحث عن الولاية"
                  />
                  <Select
                    value={formData.wilaya_id}
                    onValueChange={(value) => {
                      const selectedWilaya = wilayas.find((wilaya) => wilaya.id === value);
                      setFormData((current) => ({ ...current, wilaya_id: value, city: '' }));
                      setWilayaSearch(selectedWilaya ? `${selectedWilaya.id} - ${selectedWilaya.ar_name}` : '');
                      setCommuneSearch('');
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="اختر الولاية" /></SelectTrigger>
                    <SelectContent>
                      {filteredWilayas.map((wilaya) => (
                        <SelectItem key={wilaya.id} value={wilaya.id}>{wilaya.id} - {wilaya.ar_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>البلدية</Label>
                  <Input
                    value={communeSearch}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      const bestMatch = getBestMatchingCommune(formData.wilaya_id, nextValue);

                      setCommuneSearch(nextValue);
                      setFormData((current) => ({ ...current, city: bestMatch?.ar_name || '' }));
                    }}
                    placeholder={formData.wilaya_id ? 'ابحث عن البلدية' : 'اختر الولاية أولاً'}
                    disabled={!formData.wilaya_id}
                  />
                  <Select value={formData.city} onValueChange={(value) => {
                    setFormData((current) => ({ ...current, city: value }));
                    setCommuneSearch(value);
                  }} disabled={!formData.wilaya_id}>
                    <SelectTrigger><SelectValue placeholder={formData.wilaya_id ? 'اختر البلدية' : 'اختر الولاية أولاً'} /></SelectTrigger>
                    <SelectContent>
                      {availableCommunes.map((commune) => (
                        <SelectItem key={commune.id} value={commune.ar_name}>{commune.ar_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>نوع المستشفى</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData((current) => ({ ...current, type: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">عمومي</SelectItem>
                    <SelectItem value="private">خاص</SelectItem>
                    <SelectItem value="specialized">متخصص</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>العنوان</Label>
                <Input value={formData.address} onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))} placeholder="العنوان الكامل" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>ساعات العمل</Label>
                  <Input value={formData.hours} onChange={(event) => setFormData((current) => ({ ...current, hours: event.target.value }))} placeholder="24/7 أو 08:00 - 20:00" />
                </div>
                <div className="grid gap-2">
                  <Label>الموقع الإلكتروني</Label>
                  <Input value={formData.website} onChange={(event) => setFormData((current) => ({ ...current, website: event.target.value }))} placeholder="www.example.dz" dir="ltr" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>التقييم</Label>
                  <Input type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={(event) => setFormData((current) => ({ ...current, rating: event.target.value }))} dir="ltr" />
                </div>
                <div className="grid gap-2">
                  <Label>عدد المراجعات</Label>
                  <Input type="number" min="0" value={formData.reviews_count} onChange={(event) => setFormData((current) => ({ ...current, reviews_count: event.target.value }))} dir="ltr" />
                </div>
                <div className="grid gap-2">
                  <Label>الترتيب</Label>
                  <Input type="number" min="0" value={formData.sort_order} onChange={(event) => setFormData((current) => ({ ...current, sort_order: event.target.value }))} dir="ltr" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>التخصصات</Label>
                  <Textarea value={formData.specialties} onChange={(event) => setFormData((current) => ({ ...current, specialties: event.target.value }))} placeholder="متعدد التخصصات, استعجالات, قلب" />
                </div>
                <div className="grid gap-2">
                  <Label>وسائل الدفع</Label>
                  <Textarea value={formData.payment_methods} onChange={(event) => setFormData((current) => ({ ...current, payment_methods: event.target.value }))} placeholder="cash, card, check" dir="ltr" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>التأمينات المقبولة</Label>
                  <Textarea value={formData.insurance_providers} onChange={(event) => setFormData((current) => ({ ...current, insurance_providers: event.target.value }))} placeholder="CNAS, CASNOS, Military" />
                </div>
                <div className="grid gap-2">
                  <Label>الميزات</Label>
                  <Textarea value={formData.features} onChange={(event) => setFormData((current) => ({ ...current, features: event.target.value }))} placeholder="emergency, online_consult, direct_booking" dir="ltr" />
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                  <Checkbox checked={formData.is_active} onCheckedChange={(checked) => setFormData((current) => ({ ...current, is_active: Boolean(checked) }))} />
                  <span className="text-sm font-medium">إظهار المستشفى في الموقع</span>
                </label>
              </div>

              <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">حفظ المستشفى</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">الولاية</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">الهاتف</TableHead>
              <TableHead className="text-right">التقييم</TableHead>
              <TableHead className="text-right">الموقع</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center">تحميل...</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center text-slate-500">لا توجد مستشفيات محفوظة بعد.</TableCell></TableRow>
            ) : items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.name}</TableCell>
                <TableCell>{getWilayaName(item.wilaya_id)}{item.city ? ` - ${item.city}` : ''}</TableCell>
                <TableCell>{getTypeLabel(item.type)}</TableCell>
                <TableCell dir="ltr">{item.phone}</TableCell>
                <TableCell>{item.rating} / 5</TableCell>
                <TableCell>
                  {item.website ? (
                    <a href={`https://${item.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800">
                      <Globe2 className="h-4 w-4" />
                      فتح
                    </a>
                  ) : <span className="text-xs text-slate-400">بدون</span>}
                </TableCell>
                <TableCell>
                  {item.is_active ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">ظاهر</span> : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">مخفي</span>}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4 text-blue-600" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash className="h-4 w-4 text-red-600" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HospitalsManager;