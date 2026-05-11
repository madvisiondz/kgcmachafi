import React, { useEffect, useState } from 'react';
import { Edit, Plus, Stethoscope, Trash, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/localApi';

const specialtyInitial = {
  name: '',
  icon_emoji: '🏥',
  color_class: 'from-green-500 to-emerald-600',
  sort_order: 0,
};

const doctorInitial = {
  specialty_id: '',
  name: '',
  hospital: '',
  experience_years: 0,
  rating: 4.5,
  price: 30,
  currency: 'EUR',
  sort_order: 0,
};

const ConsultationsManager = () => {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specialtyForm, setSpecialtyForm] = useState(specialtyInitial);
  const [doctorForm, setDoctorForm] = useState(doctorInitial);
  const [editingSpecialtyId, setEditingSpecialtyId] = useState(null);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [specialtyDialogOpen, setSpecialtyDialogOpen] = useState(false);
  const [doctorDialogOpen, setDoctorDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const [specialtiesResponse, doctorsResponse] = await Promise.all([
        adminApi.listConsultationSpecialties(),
        adminApi.listConsultationDoctors(),
      ]);
      setSpecialties(specialtiesResponse.items || []);
      setDoctors(doctorsResponse.items || []);
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveSpecialty = async () => {
    try {
      if (editingSpecialtyId) {
        await adminApi.updateConsultationSpecialty(editingSpecialtyId, specialtyForm);
      } else {
        await adminApi.createConsultationSpecialty(specialtyForm);
      }
      setSpecialtyDialogOpen(false);
      setEditingSpecialtyId(null);
      setSpecialtyForm(specialtyInitial);
      loadData();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const saveDoctor = async () => {
    try {
      if (editingDoctorId) {
        await adminApi.updateConsultationDoctor(editingDoctorId, doctorForm);
      } else {
        await adminApi.createConsultationDoctor(doctorForm);
      }
      setDoctorDialogOpen(false);
      setEditingDoctorId(null);
      setDoctorForm(doctorInitial);
      loadData();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-green-600" />
            تخصصات الاستشارات
          </h2>
          <Dialog open={specialtyDialogOpen} onOpenChange={setSpecialtyDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setSpecialtyForm(specialtyInitial); setEditingSpecialtyId(null); }} className="gap-2">
                <Plus className="w-4 h-4" />
                إضافة تخصص
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingSpecialtyId ? 'تعديل التخصص' : 'إضافة تخصص'}</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <Input value={specialtyForm.name} onChange={(event) => setSpecialtyForm({ ...specialtyForm, name: event.target.value })} placeholder="اسم التخصص" />
                <Input value={specialtyForm.icon_emoji} onChange={(event) => setSpecialtyForm({ ...specialtyForm, icon_emoji: event.target.value })} placeholder="أيقونة Emoji" />
                <Input value={specialtyForm.color_class} onChange={(event) => setSpecialtyForm({ ...specialtyForm, color_class: event.target.value })} placeholder="ألوان Tailwind" />
                <Input type="number" value={specialtyForm.sort_order} onChange={(event) => setSpecialtyForm({ ...specialtyForm, sort_order: Number(event.target.value) })} placeholder="الترتيب" />
                <Button onClick={saveSpecialty} className="w-full">حفظ</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">التخصص</TableHead>
                <TableHead className="text-right">الأيقونة</TableHead>
                <TableHead className="text-right">الأطباء</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialties.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.icon_emoji}</TableCell>
                  <TableCell>{item.doctors_count}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingSpecialtyId(item.id); setSpecialtyForm({ ...item }); setSpecialtyDialogOpen(true); }}>
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={async () => { await adminApi.deleteConsultationSpecialty(item.id); loadData(); }}>
                      <Trash className="w-4 h-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            الأطباء
          </h2>
          <Dialog open={doctorDialogOpen} onOpenChange={setDoctorDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setDoctorForm(doctorInitial); setEditingDoctorId(null); }} className="gap-2">
                <Plus className="w-4 h-4" />
                إضافة طبيب
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingDoctorId ? 'تعديل الطبيب' : 'إضافة طبيب'}</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <Select value={String(doctorForm.specialty_id)} onValueChange={(value) => setDoctorForm({ ...doctorForm, specialty_id: Number(value) })}>
                  <SelectTrigger><SelectValue placeholder="اختر التخصص" /></SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.id} value={String(specialty.id)}>{specialty.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input value={doctorForm.name} onChange={(event) => setDoctorForm({ ...doctorForm, name: event.target.value })} placeholder="اسم الطبيب" />
                <Input value={doctorForm.hospital} onChange={(event) => setDoctorForm({ ...doctorForm, hospital: event.target.value })} placeholder="المستشفى/العيادة" />
                <div className="grid md:grid-cols-3 gap-4">
                  <Input type="number" value={doctorForm.experience_years} onChange={(event) => setDoctorForm({ ...doctorForm, experience_years: Number(event.target.value) })} placeholder="سنوات الخبرة" />
                  <Input type="number" step="0.1" value={doctorForm.rating} onChange={(event) => setDoctorForm({ ...doctorForm, rating: Number(event.target.value) })} placeholder="التقييم" />
                  <Input type="number" step="0.01" value={doctorForm.price} onChange={(event) => setDoctorForm({ ...doctorForm, price: Number(event.target.value) })} placeholder="السعر" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input value={doctorForm.currency} onChange={(event) => setDoctorForm({ ...doctorForm, currency: event.target.value })} placeholder="العملة" />
                  <Input type="number" value={doctorForm.sort_order} onChange={(event) => setDoctorForm({ ...doctorForm, sort_order: Number(event.target.value) })} placeholder="الترتيب" />
                </div>
                <Button onClick={saveDoctor} className="w-full">حفظ</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الطبيب</TableHead>
                <TableHead className="text-right">التخصص</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.specialty_name}</TableCell>
                  <TableCell>{item.price} {item.currency}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingDoctorId(item.id); setDoctorForm({ ...item, specialty_id: Number(item.specialty_id) }); setDoctorDialogOpen(true); }}>
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={async () => { await adminApi.deleteConsultationDoctor(item.id); loadData(); }}>
                      <Trash className="w-4 h-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ConsultationsManager;
