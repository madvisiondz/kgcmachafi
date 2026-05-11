import React, { useEffect, useState } from 'react';
import { Edit, Film, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/localApi';

const initialForm = {
  title: '',
  duration: '',
  specialty: 'general',
  image_url: '',
  video_url: '',
  sort_order: 0,
};

const VideoProgramsManager = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadItems = async () => {
    try {
      const response = await adminApi.listVideoPrograms();
      setItems(response.items || []);
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const saveItem = async () => {
    try {
      if (editingId) {
        await adminApi.updateVideoProgram(editingId, formData);
      } else {
        await adminApi.createVideoProgram(formData);
      }
      toast({ title: 'تم الحفظ', description: 'تم حفظ الحلقة.' });
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
          <Film className="w-6 h-6 text-rose-600" />
          البرامج المسجلة
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) { setFormData(initialForm); setEditingId(null); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة حلقة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? 'تعديل الحلقة' : 'إضافة حلقة'}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <Input value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} placeholder="العنوان" />
              <Input value={formData.duration} onChange={(event) => setFormData({ ...formData, duration: event.target.value })} placeholder="المدة" />
              <Input value={formData.specialty} onChange={(event) => setFormData({ ...formData, specialty: event.target.value })} placeholder="التخصص" />
              <Input value={formData.image_url} onChange={(event) => setFormData({ ...formData, image_url: event.target.value })} placeholder="رابط الصورة" />
              <Input value={formData.video_url} onChange={(event) => setFormData({ ...formData, video_url: event.target.value })} placeholder="رابط الفيديو" />
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
              <TableHead className="text-right">المدة</TableHead>
              <TableHead className="text-right">التخصص</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>{item.specialty}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingId(item.id); setFormData({ ...item }); setIsDialogOpen(true); }}>
                    <Edit className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={async () => { await adminApi.deleteVideoProgram(item.id); loadItems(); }}>
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

export default VideoProgramsManager;
