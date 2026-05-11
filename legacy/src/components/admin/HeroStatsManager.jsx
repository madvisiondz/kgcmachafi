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

  const fieldClass =
    'bg-[#0b1020]/40 border-white/10 text-slate-100 placeholder:text-slate-500';

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-slate-300" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">إحصاءات Hero</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="gap-2 border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
              variant="outline"
            >
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
              <Input
                className={fieldClass}
                value={formData.label}
                onChange={(event) => setFormData({ ...formData, label: event.target.value })}
                placeholder="العنوان"
              />
              <Input
                className={fieldClass}
                value={formData.value}
                onChange={(event) => setFormData({ ...formData, value: event.target.value })}
                placeholder="القيمة"
              />
              <Select value={formData.color_class} onValueChange={(value) => setFormData({ ...formData, color_class: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {heroColorOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                className={fieldClass}
                value={formData.sort_order}
                onChange={(event) => setFormData({ ...formData, sort_order: Number(event.target.value) })}
                placeholder="الترتيب"
              />
              <Button onClick={saveItem} className="w-full bg-emerald-600 hover:bg-emerald-700">
                حفظ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <Table className="text-slate-100">
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-right text-slate-300">العنوان</TableHead>
              <TableHead className="text-right text-slate-300">القيمة</TableHead>
              <TableHead className="text-right text-slate-300">الأيقونة</TableHead>
              <TableHead className="text-right text-slate-300">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="text-slate-100">{item.label}</TableCell>
                <TableCell className="text-slate-100">{item.value}</TableCell>
                <TableCell className="text-slate-200">{item.icon_key}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-100 hover:bg-white/10 hover:text-cyan-300"
                    onClick={() => { setEditingId(item.id); setFormData({ ...item }); setIsDialogOpen(true); }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-100 hover:bg-white/10 hover:text-rose-300"
                    onClick={async () => { await adminApi.deleteHeroStat(item.id); loadItems(); }}
                  >
                    <Trash className="w-4 h-4" />
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
