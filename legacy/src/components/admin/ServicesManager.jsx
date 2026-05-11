import React, { useEffect, useState } from 'react';
import { Edit, Plus, Settings2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/localApi';
import { serviceColorOptions } from '@/lib/siteContentIcons';

const initialForm = {
  icon_key: 'heart',
  title: '',
  description: '',
  details: '',
  features_text: '',
  color_class: serviceColorOptions[0].color_class,
  bg_class: serviceColorOptions[0].bg_class,
  sort_order: 0,
};

const ServicesManager = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadItems = async () => {
    try {
      const response = await adminApi.listServicesContent();
      setItems(response.items || []);
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const saveItem = async () => {
    const payload = {
      ...formData,
      features: formData.features_text.split('\n').map((item) => item.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await adminApi.updateServiceContent(editingId, payload);
      } else {
        await adminApi.createServiceContent(payload);
      }
      toast({ title: 'تم الحفظ', description: 'تم حفظ الخدمة.' });
      setIsDialogOpen(false);
      setEditingId(null);
      setFormData(initialForm);
      loadItems();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-blue-600" />
          خدمات الموقع
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) { setFormData(initialForm); setEditingId(null); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة خدمة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? 'تعديل الخدمة' : 'إضافة خدمة'}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <Input value={formData.icon_key} onChange={(event) => setFormData({ ...formData, icon_key: event.target.value })} placeholder="اسم الأيقونة" />
              <Input value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} placeholder="العنوان" />
              <Textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} placeholder="الوصف المختصر" />
              <Textarea value={formData.details} onChange={(event) => setFormData({ ...formData, details: event.target.value })} placeholder="تفاصيل الخدمة" />
              <Textarea value={formData.features_text} onChange={(event) => setFormData({ ...formData, features_text: event.target.value })} placeholder="ميزة في كل سطر" />
              <Select value={`${formData.color_class}|${formData.bg_class}`} onValueChange={(value) => {
                const [color_class, bg_class] = value.split('|');
                setFormData({ ...formData, color_class, bg_class });
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {serviceColorOptions.map((option) => (
                    <SelectItem key={`${option.color_class}|${option.bg_class}`} value={`${option.color_class}|${option.bg_class}`}>
                      {option.color_class}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="number" value={formData.sort_order} onChange={(event) => setFormData({ ...formData, sort_order: Number(event.target.value) })} placeholder="الترتيب" />
              <Button onClick={saveItem} className="w-full">حفظ</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الخدمة</TableHead>
              <TableHead className="text-right">الأيقونة</TableHead>
              <TableHead className="text-right">الترتيب</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.icon_key}</TableCell>
                <TableCell>{item.sort_order}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingId(item.id);
                    setFormData({
                      ...item,
                      features_text: (item.features || []).join('\n'),
                    });
                    setIsDialogOpen(true);
                  }}>
                    <Edit className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={async () => { await adminApi.deleteServiceContent(item.id); loadItems(); }}>
                    <Trash className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ServicesManager;
