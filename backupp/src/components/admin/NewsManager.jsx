import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Plus, RefreshCw, Edit, Trash, Newspaper } from 'lucide-react';
import { adminApi } from '@/lib/localApi';

const initialForm = {
  title: '',
  description: '',
  content: '',
  tag: 'وطني',
  source: 'وزارة الصحة',
  date: new Date().toISOString().split('T')[0],
  is_archived: false,
};

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();

  const fetchNews = async () => {
    setLoading(true);

    try {
      const { items } = await adminApi.listNews();
      setNews(items);
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.date) {
      toast({ title: 'تنبيه', description: 'يرجى ملء الحقول المطلوبة', variant: 'destructive' });
      return;
    }

    try {
      if (editingId) {
        await adminApi.updateNews(editingId, formData);
      } else {
        await adminApi.createNews(formData);
      }

      toast({ title: 'تم بنجاح', description: editingId ? 'تم تحديث الخبر' : 'تم إضافة الخبر' });
      setIsDialogOpen(false);
      resetForm();
      fetchNews();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || '',
      description: item.description || '',
      content: item.content || '',
      tag: item.tag || 'وطني',
      source: item.source || 'وزارة الصحة',
      date: item.date || new Date().toISOString().split('T')[0],
      is_archived: Boolean(item.is_archived),
    });
    setEditingId(item.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
      return;
    }

    try {
      await adminApi.deleteNews(id);
      toast({ title: 'تم الحذف', description: 'تم حذف الخبر بنجاح' });
      fetchNews();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-blue-600" />
          إدارة الأخبار
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchNews} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            تحديث القائمة
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="gap-2 bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4" />
                إضافة خبر
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'تعديل الخبر' : 'إضافة خبر جديد'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="news-title">العنوان</label>
                  <Input id="news-title" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="news-source">المصدر</label>
                    <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                      <SelectTrigger id="news-source">
                        <SelectValue placeholder="اختر المصدر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="وزارة الصحة">وزارة الصحة</SelectItem>
                        <SelectItem value="APS">APS</SelectItem>
                        <SelectItem value="Reuters">Reuters</SelectItem>
                        <SelectItem value="AFP">AFP</SelectItem>
                        <SelectItem value="محلي">محلي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="news-tag">التصنيف</label>
                    <Select value={formData.tag} onValueChange={(value) => setFormData({ ...formData, tag: value })}>
                      <SelectTrigger id="news-tag">
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="وطني">وطني</SelectItem>
                        <SelectItem value="توعية">توعية</SelectItem>
                        <SelectItem value="إفريقيا">إفريقيا</SelectItem>
                        <SelectItem value="دولي">دولي</SelectItem>
                        <SelectItem value="تقارير">تقارير</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="news-description">الوصف المختصر</label>
                  <Textarea id="news-description" value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="news-content">محتوى الخبر</label>
                  <Textarea
                    id="news-content"
                    value={formData.content}
                    onChange={(event) => setFormData({ ...formData, content: event.target.value })}
                    className="min-h-[160px]"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="news-date">التاريخ</label>
                  <Input id="news-date" type="date" value={formData.date} onChange={(event) => setFormData({ ...formData, date: event.target.value })} />
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="news-archived"
                    checked={formData.is_archived}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_archived: Boolean(checked) })}
                  />
                  <label htmlFor="news-archived">نقل الخبر إلى الأرشيف</label>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">حفظ</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">العنوان</TableHead>
              <TableHead className="text-right">المصدر</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">جاري التحميل...</TableCell>
              </TableRow>
            ) : news.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">لا توجد أخبار حالياً</TableCell>
              </TableRow>
            ) : (
              news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.is_archived ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {item.is_archived ? 'مؤرشف' : 'منشور'}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash className="w-4 h-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default NewsManager;
