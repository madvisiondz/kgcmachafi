import React, { useEffect, useState } from 'react';
import { Edit, Globe2, Plane, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/localApi';
import {
  getInternationalHospitalCountryLabel,
  getInternationalHospitalSpecialtyLabel,
  INTERNATIONAL_HOSPITAL_COUNTRIES,
  INTERNATIONAL_HOSPITAL_SPECIALTIES,
} from '@/lib/hospitalOptions';

const initialForm = {
  name: '',
  country: 'turkey',
  city: '',
  specialty: 'oncology',
  description: '',
  rating: '4.8',
  reviews_count: '0',
  hours: '24/7',
  phone: '',
  website: '',
  payment_methods: 'cash, card',
  insurance_providers: 'International',
  features: 'online_consult, direct_booking',
  sort_order: '0',
  is_active: true,
};

const InternationalHospitalsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const { toast } = useToast();

  const loadItems = async () => {
    setLoading(true);

    try {
      const response = await adminApi.listInternationalHospitals();
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
  };

  const normalizeTextList = (value) => value.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);

  const buildPayload = () => ({
    ...formData,
    payment_methods: normalizeTextList(formData.payment_methods),
    insurance_providers: normalizeTextList(formData.insurance_providers),
    features: normalizeTextList(formData.features),
    rating: Number(formData.rating || 0),
    reviews_count: Number(formData.reviews_count || 0),
    sort_order: Number(formData.sort_order || 0),
  });

  const handleSave = async () => {
    if (!formData.name || !formData.country || !formData.city || !formData.specialty || !formData.phone) {
      toast({
        title: 'بيانات ناقصة',
        description: 'أدخل اسم المستشفى والدولة والمدينة والتخصص والهاتف.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const payload = buildPayload();

      if (editingId) {
        await adminApi.updateInternationalHospital(editingId, payload);
      } else {
        await adminApi.createInternationalHospital(payload);
      }

      toast({
        title: 'تم الحفظ',
        description: editingId ? 'تم تحديث المستشفى الخارجي.' : 'تمت إضافة المستشفى الخارجي.',
      });
      setIsDialogOpen(false);
      resetForm();
      loadItems();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      country: item.country || 'turkey',
      city: item.city || '',
      specialty: item.specialty || 'oncology',
      description: item.description || '',
      rating: item.rating != null ? String(item.rating) : '4.8',
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
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('حذف هذا المستشفى الخارجي؟')) {
      return;
    }

    try {
      await adminApi.deleteInternationalHospital(id);
      toast({ title: 'تم الحذف', description: 'تم حذف المستشفى الخارجي.' });
      loadItems();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const getCountryLabel = getInternationalHospitalCountryLabel;
  const getSpecialtyLabel = getInternationalHospitalSpecialtyLabel;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Plane className="h-6 w-6 text-indigo-600" />
          إدارة العلاج بالخارج
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
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              إضافة مستشفى خارجي
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل مستشفى خارجي' : 'إضافة مستشفى خارجي جديد'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>اسم المستشفى</Label>
                  <Input value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>رقم الهاتف</Label>
                  <Input value={formData.phone} onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))} dir="ltr" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>الدولة</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData((current) => ({ ...current, country: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {INTERNATIONAL_HOSPITAL_COUNTRIES.map((country) => (
                        <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>المدينة</Label>
                  <Input value={formData.city} onChange={(event) => setFormData((current) => ({ ...current, city: event.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>التخصص</Label>
                  <Select value={formData.specialty} onValueChange={(value) => setFormData((current) => ({ ...current, specialty: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {INTERNATIONAL_HOSPITAL_SPECIALTIES.map((specialty) => (
                        <SelectItem key={specialty.value} value={specialty.value}>{specialty.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>الوصف</Label>
                <Textarea value={formData.description} onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))} placeholder="وصف مختصر عن المستشفى أو التخصص المتاح..." />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>ساعات العمل</Label>
                  <Input value={formData.hours} onChange={(event) => setFormData((current) => ({ ...current, hours: event.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>الموقع الإلكتروني</Label>
                  <Input value={formData.website} onChange={(event) => setFormData((current) => ({ ...current, website: event.target.value }))} dir="ltr" />
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
                  <Label>وسائل الدفع</Label>
                  <Textarea value={formData.payment_methods} onChange={(event) => setFormData((current) => ({ ...current, payment_methods: event.target.value }))} placeholder="cash, card, transfer" dir="ltr" />
                </div>
                <div className="grid gap-2">
                  <Label>التأمينات المقبولة</Label>
                  <Textarea value={formData.insurance_providers} onChange={(event) => setFormData((current) => ({ ...current, insurance_providers: event.target.value }))} placeholder="International, Allianz, Bupa" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>الميزات</Label>
                <Textarea value={formData.features} onChange={(event) => setFormData((current) => ({ ...current, features: event.target.value }))} placeholder="online_consult, direct_booking, translator" dir="ltr" />
              </div>

              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                  <Checkbox checked={formData.is_active} onCheckedChange={(checked) => setFormData((current) => ({ ...current, is_active: Boolean(checked) }))} />
                  <span className="text-sm font-medium">إظهار المستشفى الخارجي في الموقع</span>
                </label>
              </div>

              <Button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700">حفظ المستشفى الخارجي</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">الدولة / المدينة</TableHead>
              <TableHead className="text-right">التخصص</TableHead>
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
              <TableRow><TableCell colSpan={8} className="text-center text-slate-500">لا توجد مستشفيات خارجية محفوظة بعد.</TableCell></TableRow>
            ) : items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.name}</TableCell>
                <TableCell>{getCountryLabel(item.country)} - {item.city}</TableCell>
                <TableCell>{getSpecialtyLabel(item.specialty)}</TableCell>
                <TableCell dir="ltr">{item.phone}</TableCell>
                <TableCell>{item.rating} / 5</TableCell>
                <TableCell>
                  {item.website ? (
                    <a href={`https://${item.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-700 hover:text-indigo-800">
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

export default InternationalHospitalsManager;