import React, { useEffect, useState } from 'react';
import { BarChart3, Edit, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/localApi';
import { heroColorOptions } from '@/lib/siteContentIcons';

const initialForm = {
  icon_key: 'users',
  label: '',
  value: '',
  color_class: heroColorOptions[0],
  sort_order: 0,
};

const HeroStatsManager = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadItems = async () => {
    try {
      const response = await adminApi.listHeroStats();
      setItems(response.items || []);
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const saveItem = async () => {
    try {
      if (editingId) {
        await adminApi.updateHeroStat(editingId, formData);
      } else {
        await adminApi.createHeroStat(formData);
      }
      toast({ title: 'تم الحفظ', description: 'تم حفظ الإحصائية.' });
      setIsDialogOpen(false);
      resetForm();
      loadItems();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-600" />
          إحصاءات Hero
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة إحصائية
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل الإحصائية' : 'إضافة إحصائية'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Select value={formData.icon_key} onValueChange={(value) => setFormData({ ...formData, icon_key: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                  <SelectItem value="heart">Heart</SelectItem>
                </SelectContent>
              </Select>
              <Input value={formData.label} onChange={(event) => setFormData({ ...formData, label: event.target.value })} placeholder="العنوان" />
              <Input value={formData.value} onChange={(event) => setFormData({ ...formData, value: event.target.value })} placeholder="القيمة" />
              <Select value={formData.color_class} onValueChange={(value) => setFormData({ ...formData, color_class: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {heroColorOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
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
              <TableHead className="text-right">العنوان</TableHead>
              <TableHead className="text-right">القيمة</TableHead>
              <TableHead className="text-right">الأيقونة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.label}</TableCell>
                <TableCell>{item.value}</TableCell>
                <TableCell>{item.icon_key}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingId(item.id); setFormData({ ...item }); setIsDialogOpen(true); }}>
                    <Edit className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={async () => { await adminApi.deleteHeroStat(item.id); loadItems(); }}>
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

export default HeroStatsManager;
