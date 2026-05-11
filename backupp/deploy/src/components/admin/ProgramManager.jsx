import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Tv, Plus, Trash, Edit, Video } from 'lucide-react';
import { adminApi } from '@/lib/localApi';
import { formatDurationLabel } from '@/lib/programSchedule';

const DAYS = [
  { value: '0', label: 'الأحد' },
  { value: '1', label: 'الإثنين' },
  { value: '2', label: 'الثلاثاء' },
  { value: '3', label: 'الأربعاء' },
  { value: '4', label: 'الخميس' },
  { value: '5', label: 'الجمعة' },
  { value: '6', label: 'السبت' },
];

const initialForm = {
  title: '',
  time_slot: '08:00',
  days_of_week: ['0'],
  day_type: 'weekly',
  category: 'general',
  description: '',
  video_url: '',
  image_url: '',
  video_duration_seconds: '',
  video_duration_label: '',
};

const buildCoverName = (title) => {
  const safeTitle = String(title || 'program-cover')
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return safeTitle || 'program-cover';
};

const createCoverFromVideo = (source, title) => new Promise((resolve, reject) => {
  const video = document.createElement('video');
  let objectUrl = '';
  let finished = false;

  const cleanup = () => {
    video.pause?.();
    video.removeAttribute('src');
    video.load?.();

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = '';
    }
  };

  const fail = (message) => {
    if (finished) {
      return;
    }

    finished = true;
    cleanup();
    reject(new Error(message));
  };

  const capture = () => {
    if (finished) {
      return;
    }

    const width = video.videoWidth || 0;
    const height = video.videoHeight || 0;

    if (!width || !height) {
      fail('تعذر قراءة أبعاد الفيديو لاستخراج الغلاف.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      fail('تعذر إنشاء صورة الغلاف من الفيديو.');
      return;
    }

    try {
      context.drawImage(video, 0, 0, width, height);
    } catch (error) {
      fail('تعذر التقاط صورة من الفيديو.');
      return;
    }

    canvas.toBlob((blob) => {
      if (finished) {
        return;
      }

      if (!blob) {
        fail('تعذر حفظ صورة الغلاف.');
        return;
      }

      finished = true;
      cleanup();
      resolve(new File([blob], `${buildCoverName(title)}.jpg`, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.9);
  };

  video.preload = 'metadata';
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = 'anonymous';
  video.addEventListener('error', () => fail('تعذر استخراج صورة من الفيديو.'), { once: true });
  video.addEventListener('loadedmetadata', () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const targetTime = duration > 1 ? Math.min(1, duration / 4) : 0;

    if (targetTime <= 0) {
      window.setTimeout(capture, 150);
      return;
    }

    const handleSeeked = () => capture();
    video.addEventListener('seeked', handleSeeked, { once: true });

    try {
      video.currentTime = targetTime;
    } catch (error) {
      video.removeEventListener('seeked', handleSeeked);
      window.setTimeout(capture, 150);
    }
  }, { once: true });

  if (source instanceof File) {
    objectUrl = URL.createObjectURL(source);
    video.src = objectUrl;
  } else {
    video.src = source;
  }

  video.load();
});

const readVideoDuration = (file) => new Promise((resolve, reject) => {
  if (!(file instanceof File)) {
    reject(new Error('ملف الفيديو غير صالح.'));
    return;
  }

  const video = document.createElement('video');
  const objectUrl = URL.createObjectURL(file);
  let settled = false;

  const cleanup = () => {
    video.removeAttribute('src');
    video.load?.();
    URL.revokeObjectURL(objectUrl);
  };

  const fail = (message) => {
    if (settled) {
      return;
    }

    settled = true;
    cleanup();
    reject(new Error(message));
  };

  video.preload = 'metadata';
  video.addEventListener('error', () => fail('تعذر قراءة مدة الفيديو.'), { once: true });
  video.addEventListener('loadedmetadata', () => {
    if (settled) {
      return;
    }

    const durationSeconds = Math.max(0, Math.round(Number(video.duration) || 0));
    settled = true;
    cleanup();
    resolve({
      seconds: durationSeconds,
      label: formatDurationLabel(durationSeconds),
    });
  }, { once: true });

  video.src = objectUrl;
  video.load();
});

const ProgramManager = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [isReadingVideoDuration, setIsReadingVideoDuration] = useState(false);
  const { toast } = useToast();

  const fetchPrograms = async () => {
    setLoading(true);

    try {
      const { items } = await adminApi.listPrograms();
      setPrograms(items || []);
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (!videoFile) {
      setVideoPreviewUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(videoFile);
    setVideoPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [videoFile]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setVideoFile(null);
    setImageFile(null);
    setIsGeneratingCover(false);
    setIsReadingVideoDuration(false);
  };

  const handleVideoFileChange = async (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setVideoFile(selectedFile);

    if (!selectedFile) {
      setIsReadingVideoDuration(false);
      setFormData((current) => ({
        ...current,
        video_duration_seconds: '',
        video_duration_label: '',
      }));
      return;
    }

    try {
      setIsReadingVideoDuration(true);
      const duration = await readVideoDuration(selectedFile);
      setFormData((current) => ({
        ...current,
        video_duration_seconds: duration.seconds > 0 ? String(duration.seconds) : '',
        video_duration_label: duration.label,
      }));
    } catch (error) {
      setFormData((current) => ({
        ...current,
        video_duration_seconds: '',
        video_duration_label: '',
      }));
      toast({
        title: 'تنبيه',
        description: 'تعذر استخراج مدة الفيديو تلقائيًا من الملف المختار.',
      });
    } finally {
      setIsReadingVideoDuration(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.time_slot) {
      toast({ title: 'خطأ', description: 'يرجى إدخال اسم البرنامج والتوقيت', variant: 'destructive' });
      return;
    }

    if (formData.day_type === 'weekly' && formData.days_of_week.length === 0) {
      toast({ title: 'خطأ', description: 'اختر يومًا واحدًا على الأقل لعرض البرنامج', variant: 'destructive' });
      return;
    }

    try {
      let coverFile = imageFile;

      if (!coverFile && !formData.image_url && (videoFile || formData.video_url)) {
        setIsGeneratingCover(true);

        try {
          coverFile = await createCoverFromVideo(videoFile || formData.video_url, formData.title);
        } catch (error) {
          toast({
            title: 'تنبيه',
            description: 'تعذر توليد صورة تلقائية من الفيديو. يمكنك رفع صورة يدويًا إذا رغبت.',
          });
        } finally {
          setIsGeneratingCover(false);
        }
      }

      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('time_slot', formData.time_slot);
      payload.append('day_type', formData.day_type);
      payload.append('category', formData.category);
      payload.append('description', formData.description);
      payload.append('video_url', formData.video_url || '');
      payload.append('image_url', formData.image_url || '');
      payload.append('video_duration_seconds', formData.video_duration_seconds || '');
      payload.append('video_duration_label', formData.video_duration_label || '');
      payload.append('days_of_week', formData.days_of_week.join(','));

      if (videoFile) {
        payload.append('video_file', videoFile);
      }

      if (coverFile) {
        payload.append('image_file', coverFile);
      }

      if (editingId) {
        await adminApi.updateProgram(editingId, payload);
      } else {
        await adminApi.createProgram(payload);
      }

      toast({ title: 'نجاح', description: editingId ? 'تم تحديث البرنامج' : 'تم إضافة البرنامج للجدول' });
      setIsDialogOpen(false);
      resetForm();
      fetchPrograms();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (program) => {
    const rawDays = String(program.days_of_week || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    setEditingId(program.id);
    setFormData({
      title: program.title || '',
      time_slot: String(program.time_slot || '08:00').slice(0, 5),
      days_of_week: rawDays.length > 0
        ? rawDays
        : (program.day_of_week === null || program.day_of_week === undefined ? ['0'] : [String(program.day_of_week)]),
      day_type: program.day_type || 'weekly',
      category: program.category || 'general',
      description: program.description || '',
      video_url: program.video_url || '',
      image_url: program.image_url || '',
      video_duration_seconds: program.video_duration_seconds ? String(program.video_duration_seconds) : '',
      video_duration_label: program.video_duration_label || '',
    });
    setVideoFile(null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const toggleDay = (dayValue) => {
    setFormData((current) => {
      const exists = current.days_of_week.includes(dayValue);
      return {
        ...current,
        days_of_week: exists
          ? current.days_of_week.filter((value) => value !== dayValue)
          : [...current.days_of_week, dayValue].sort(),
      };
    });
  };

  const getProgramDaysLabel = (program) => {
    if (program.day_type === 'daily') {
      return 'يومي';
    }

    if (program.day_type === 'weekend') {
      return 'نهاية الأسبوع';
    }

    const days = String(program.days_of_week || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => DAYS.find((day) => day.value === value)?.label || value);

    if (days.length > 0) {
      return days.join('، ');
    }

    return DAYS.find((day) => day.value === String(program.day_of_week ?? ''))?.label || 'غير محدد';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('حذف البرنامج؟')) {
      return;
    }

    try {
      await adminApi.deleteProgram(id);
      toast({ title: 'تم الحذف', description: 'تم حذف البرنامج' });
      fetchPrograms();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const clearSelectedVideo = () => {
    setVideoFile(null);
    setFormData((current) => ({
      ...current,
      video_url: '',
      video_duration_seconds: '',
      video_duration_label: '',
    }));
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    setFormData((current) => ({ ...current, image_url: '' }));
  };

  const activeVideoPreview = videoPreviewUrl || formData.video_url;
  const activeImagePreview = imagePreviewUrl || formData.image_url;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Tv className="w-6 h-6 text-orange-600" />
          إدارة البرامج اليومية
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2 bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              إضافة برنامج
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[780px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل البرنامج' : 'إضافة برنامج جديد'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <label>اسم البرنامج</label>
                <Input value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label>التوقيت</label>
                  <Input type="time" value={formData.time_slot} onChange={(event) => setFormData({ ...formData, time_slot: event.target.value })} />
                </div>
                <div className="grid gap-2">
                  <label>نوع الجدولة</label>
                  <Select value={formData.day_type} onValueChange={(value) => setFormData({ ...formData, day_type: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">حسب أيام محددة</SelectItem>
                      <SelectItem value="daily">يومي</SelectItem>
                      <SelectItem value="weekend">نهاية الأسبوع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label>التصنيف</label>
                  <Input value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <label>ملف الفيديو</label>
                    {(videoFile || formData.video_url) && (
                      <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-600 hover:text-red-700" onClick={clearSelectedVideo}>
                        مسح الفيديو
                      </Button>
                    )}
                  </div>
                  <Input type="file" accept="video/*,.mp4,.webm,.mov,.m4v" onChange={handleVideoFileChange} />
                </div>
              </div>
              {isReadingVideoDuration && (
                <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                  جاري استخراج مدة الفيديو الأصلية...
                </div>
              )}
              {(formData.video_duration_label || formData.video_duration_seconds) && (
                <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-800">
                  مدة الفيديو المستخرجة تلقائيًا: <span className="font-bold">{formData.video_duration_label || formatDurationLabel(formData.video_duration_seconds)}</span>
                </div>
              )}
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-2">
                  <label>صورة البرنامج</label>
                  {(imageFile || formData.image_url) && (
                    <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-600 hover:text-red-700" onClick={clearSelectedImage}>
                      مسح الصورة
                    </Button>
                  )}
                </div>
                <Input type="file" accept="image/*,.jpg,.jpeg,.png,.webp" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
                <p className="text-xs text-slate-500">
                  إذا لم ترفع صورة، سنحاول اختيار غلاف تلقائي من الفيديو.
                </p>
              </div>
              {(activeImagePreview || activeVideoPreview) && (
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label>معاينة الصورة</label>
                    <div className="overflow-hidden rounded-xl border bg-slate-50">
                      {activeImagePreview ? (
                        <img
                          src={activeImagePreview}
                          alt="معاينة صورة البرنامج"
                          className="aspect-[4/3] w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-[4/3] items-center justify-center text-sm text-slate-400">
                          لا توجد صورة للمعاينة بعد
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label>معاينة الفيديو</label>
                    <div className="overflow-hidden rounded-xl border bg-black">
                      {activeVideoPreview ? (
                        <video
                          src={activeVideoPreview}
                          controls
                          className="aspect-[4/3] w-full"
                        />
                      ) : (
                        <div className="flex aspect-[4/3] items-center justify-center bg-slate-950 text-sm text-slate-400">
                          لا يوجد فيديو للمعاينة بعد
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {formData.day_type === 'weekly' && (
                <div className="grid gap-2">
                  <label>أيام العرض</label>
                  <div className="grid grid-cols-2 gap-2 rounded-lg border p-3 sm:grid-cols-3 md:grid-cols-4">
                    {DAYS.map((day) => {
                      const isSelected = formData.days_of_week.includes(day.value);
                      return (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDay(day.value)}
                          className={`rounded-md border px-3 py-2 text-sm transition-colors ${isSelected ? 'bg-orange-100 text-orange-800 border-orange-300' : 'bg-white hover:bg-slate-50'}`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <label>وصف مختصر</label>
                <Input value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
              </div>
              {formData.video_url && (
                <div className="text-xs text-slate-500 break-all">
                  الفيديو الحالي: {formData.video_url}
                </div>
              )}
              {formData.image_url && !imageFile && (
                <div className="text-xs text-slate-500 break-all">
                  صورة البرنامج الحالية: {formData.image_url}
                </div>
              )}
              {imageFile && (
                <div className="text-xs text-slate-500 break-all">
                  الصورة المختارة: {imageFile.name}
                </div>
              )}
              <Button onClick={handleSave} className="w-full bg-orange-600 hover:bg-orange-700" disabled={isGeneratingCover || isReadingVideoDuration}>
                {isReadingVideoDuration ? 'جاري قراءة مدة الفيديو...' : isGeneratingCover ? 'جاري تجهيز صورة البرنامج...' : 'حفظ البرنامج'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[980px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">البرنامج</TableHead>
              <TableHead className="text-right">التوقيت</TableHead>
              <TableHead className="text-right">اليوم</TableHead>
              <TableHead className="text-right">الصورة</TableHead>
              <TableHead className="text-right">فيديو</TableHead>
              <TableHead className="text-right">المدة</TableHead>
              <TableHead className="text-right">حذف</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center">تحميل...</TableCell></TableRow>
            ) : programs.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-gray-500">لا توجد برامج محفوظة</TableCell></TableRow>
            ) : programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell className="font-bold">{program.title}</TableCell>
                <TableCell>{String(program.time_slot || '').slice(0, 5)}</TableCell>
                <TableCell>{getProgramDaysLabel(program)}</TableCell>
                <TableCell>
                  {program.image_url ? <span className="text-xs text-emerald-600">موجودة</span> : <span className="text-xs text-gray-400">بدون</span>}
                </TableCell>
                <TableCell>
                  {program.video_url ? <Video className="w-4 h-4 text-orange-600" /> : <span className="text-xs text-gray-400">بدون</span>}
                </TableCell>
                <TableCell>{program.video_duration_label || <span className="text-xs text-gray-400">غير محددة</span>}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(program)}>
                      <Edit className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(program.id)}>
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
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

export default ProgramManager;
