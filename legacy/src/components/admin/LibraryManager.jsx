import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, Plus, Trash, Edit } from 'lucide-react';
import { adminApi } from '@/lib/localApi';

const initialForm = {
  title: '',
  author: '',
  category: '',
  book_type: 'standard',
  file_path: '',
  image_url: '',
  pages: '',
};

const LibraryManager = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const { toast } = useToast();

  const fetchBooks = async () => {
    setLoading(true);

    try {
      const { items } = await adminApi.listBooks();
      setBooks(items || []);
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setPdfFile(null);
    setCoverFile(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.author) {
      toast({ title: 'خطأ', description: 'يرجى إدخال العنوان والمؤلف', variant: 'destructive' });
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('author', formData.author);
    payload.append('category', formData.category);
    payload.append('book_type', formData.book_type || 'standard');
    payload.append('file_path', formData.file_path || '');
    payload.append('image_url', formData.image_url || '');
    payload.append('pages', formData.pages ? String(Number(formData.pages)) : '');

    if (pdfFile) {
      payload.append('pdf_file', pdfFile);
    }

    if (coverFile) {
      payload.append('cover_file', coverFile);
    }

    try {
      if (editingId) {
        await adminApi.updateBook(editingId, payload);
      } else {
        await adminApi.createBook(payload);
      }

      toast({ title: 'نجاح', description: editingId ? 'تم تحديث الكتاب' : 'تم إضافة الكتاب للمكتبة' });
      setIsDialogOpen(false);
      resetForm();
      fetchBooks();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      category: book.category || '',
      book_type: book.book_type || 'standard',
      file_path: book.file_path || '',
      image_url: book.image_url || '',
      pages: book.pages || '',
    });
    setPdfFile(null);
    setCoverFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('حذف هذا الكتاب؟')) {
      return;
    }

    try {
      await adminApi.deleteBook(id);
      toast({ title: 'تم الحذف', description: 'تم إزالة الكتاب' });
      fetchBooks();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600" />
          إدارة المكتبة الصحية
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2 bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              إضافة كتاب
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل الكتاب' : 'إضافة كتاب جديد للمكتبة'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <label>عنوان الكتاب</label>
                <Input value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} />
              </div>
              <div className="grid gap-2">
                <label>المؤلف</label>
                <Input value={formData.author} onChange={(event) => setFormData({ ...formData, author: event.target.value })} />
              </div>
              <div className="grid gap-2">
                <label>التصنيف</label>
                <Input value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} placeholder="مثال: تغذية، طب أطفال..." />
              </div>
              <div className="grid gap-2">
                <label>نوعية الكتاب</label>
                <Select value={formData.book_type} onValueChange={(value) => setFormData({ ...formData, book_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الكتاب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ebook">كتاب إلكتروني</SelectItem>
                    <SelectItem value="standard">كتاب عادي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>ملف PDF</label>
                <Input type="file" accept="application/pdf,.pdf" onChange={(event) => setPdfFile(event.target.files?.[0] || null)} />
                {formData.file_path && (
                  <p className="text-xs text-gray-500 break-all">
                    الملف الحالي: {formData.file_path}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label>صورة الغلاف</label>
                <Input type="file" accept="image/*" onChange={(event) => setCoverFile(event.target.files?.[0] || null)} />
                <p className="text-xs text-gray-500">
                  إذا لم ترفع صورة، سيُستخدم غلاف من أول صفحة PDF تلقائيًا عند الإمكان.
                </p>
                {formData.image_url && (
                  <p className="text-xs text-gray-500 break-all">
                    الغلاف الحالي: {formData.image_url}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label>عدد الصفحات</label>
                  <Input type="number" value={formData.pages} onChange={(event) => setFormData({ ...formData, pages: event.target.value })} />
                </div>
                <div className="grid gap-2">
                  <label>طريقة الاستخدام</label>
                  <div className="h-10 rounded-md border bg-slate-50 px-3 flex items-center text-sm text-slate-600">
                    {formData.book_type === 'ebook' ? 'قراءة مباشرة من الموقع' : 'تحميل فقط'}
                  </div>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full bg-purple-600 hover:bg-purple-700">
                حفظ الكتاب
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الكتاب</TableHead>
              <TableHead className="text-right">المؤلف</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center">تحميل...</TableCell></TableRow>
            ) : books.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-gray-500">المكتبة فارغة</TableCell></TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-bold">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell><span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">{book.category || 'عام'}</span></TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${book.book_type === 'ebook' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {book.book_type === 'ebook' ? 'إلكتروني' : 'عادي'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(book)}>
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(book.id)}>
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default LibraryManager;
