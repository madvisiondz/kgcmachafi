import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Edit, Home, MapPin, Plus, Trash, Users } from 'lucide-react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { getCommunes, wilayas } from '@/lib/algeria-data';
import { geocodeAdministrativeSelection, getBestMatchingCommune, getFilteredCommunes, getWilayaLabel, reverseGeocodeAdministrativeSelection } from '@/lib/algeriaLocation';
import { setupLeafletDefaultIcons } from '@/lib/leafletMap';
import { adminApi } from '@/lib/localApi';
import { getBestMatchingWilaya, getFilteredWilayas } from '@/lib/wilayaSearch';

setupLeafletDefaultIcons();

const ALGERIA_CENTER = [28.2167, 2.2167];

const initialForm = {
  title: '',
  owner_name: '',
  phone: '',
  wilaya_id: '',
  city: '',
  address: '',
  is_free: false,
  price_per_night: '',
  capacity: '1',
  description: '',
  latitude: '',
  longitude: '',
  is_active: true,
};

const MapClickHandler = ({ onPick }) => {
  const map = useMapEvents({
    click(event) {
      map.panTo(event.latlng, {
        animate: true,
        duration: 0.8,
      });
      onPick(event.latlng);
    },
  });

  return null;
};

const MapViewportSync = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (!position) {
      return;
    }

    map.panTo(position, {
      animate: true,
      duration: 0.8,
    });
  }, [map, position]);

  return null;
};

const AccommodationsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [wilayaSearch, setWilayaSearch] = useState('');
  const [communeSearch, setCommuneSearch] = useState('');
  const locationRequestRef = useRef(0);
  const { toast } = useToast();

  const filteredWilayas = useMemo(() => {
    return getFilteredWilayas(wilayas, wilayaSearch);
  }, [wilayaSearch]);

  const availableCommunes = useMemo(() => getFilteredCommunes(formData.wilaya_id, communeSearch), [communeSearch, formData.wilaya_id]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await adminApi.listAccommodations();
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
  };

  const handleSave = async () => {
    if (!formData.title || !formData.phone || !formData.wilaya_id || !formData.city) {
      toast({ title: 'بيانات ناقصة', description: 'أدخل اسم المكان والهاتف والولاية والبلدية.', variant: 'destructive' });
      return;
    }

    try {
      if (editingId) {
        await adminApi.updateAccommodation(editingId, formData);
      } else {
        await adminApi.createAccommodation(formData);
      }

      toast({ title: 'تم الحفظ', description: editingId ? 'تم تحديث مكان الإيواء.' : 'تمت إضافة مكان الإيواء.' });
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
      title: item.title || '',
      owner_name: item.owner_name || '',
      phone: item.phone || '',
      wilaya_id: item.wilaya_id || '',
      city: item.city || '',
      address: item.address || '',
      is_free: Boolean(item.is_free),
      price_per_night: item.price_per_night != null ? String(item.price_per_night) : '',
      capacity: item.capacity != null ? String(item.capacity) : '1',
      description: item.description || '',
      latitude: item.latitude != null ? String(item.latitude) : '',
      longitude: item.longitude != null ? String(item.longitude) : '',
      is_active: Boolean(item.is_active),
    });
    setWilayaSearch(activeWilaya ? `${activeWilaya.id} - ${activeWilaya.ar_name}` : '');
    setCommuneSearch(activeCommune?.ar_name || item.city || '');
    setIsDialogOpen(true);
  };

  const updateMarkerFromSelection = async (wilayaId, communeName) => {
    const requestId = ++locationRequestRef.current;

    try {
      const resolvedLocation = await geocodeAdministrativeSelection({ wilayaId, communeName });

      if (!resolvedLocation || requestId !== locationRequestRef.current) {
        return;
      }

      setFormData((current) => ({
        ...current,
        latitude: resolvedLocation.latitude.toFixed(6),
        longitude: resolvedLocation.longitude.toFixed(6),
      }));
    } catch (error) {
      console.error('Failed to geocode accommodation selection', error);
    }
  };

  const handleMapPick = async (latlng) => {
    const latitude = latlng.lat.toFixed(6);
    const longitude = latlng.lng.toFixed(6);

    setFormData((current) => ({
      ...current,
      latitude,
      longitude,
    }));

    try {
      const resolvedLocation = await reverseGeocodeAdministrativeSelection(latitude, longitude);
      if (!resolvedLocation) {
        return;
      }

      setFormData((current) => ({
        ...current,
        latitude,
        longitude,
        wilaya_id: resolvedLocation.wilaya.id,
        city: resolvedLocation.commune?.ar_name || '',
      }));
      setWilayaSearch(getWilayaLabel(resolvedLocation.wilaya.id));
      setCommuneSearch(resolvedLocation.commune?.ar_name || '');
    } catch (error) {
      console.error('Failed to reverse geocode accommodation location', error);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'الموقع غير مدعوم',
        description: 'المتصفح الحالي لا يدعم تحديد الموقع الجغرافي.',
        variant: 'destructive',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleMapPick({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        toast({
          title: 'تعذر تحديد الموقع',
          description: 'اسمح بالوصول إلى الموقع ثم أعد المحاولة.',
          variant: 'destructive',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm('حذف مكان الإيواء هذا؟')) {
      return;
    }

    try {
      await adminApi.deleteAccommodation(id);
      toast({ title: 'تم الحذف', description: 'تم حذف مكان الإيواء.' });
      loadItems();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const markerPosition = formData.latitude !== '' && formData.longitude !== ''
    ? [Number(formData.latitude), Number(formData.longitude)]
    : null;

  const getWilayaName = (wilayaId) => wilayas.find((item) => item.id === String(wilayaId))?.ar_name || wilayaId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Home className="h-6 w-6 text-blue-600" />
          إدارة إيواء المرضى
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
              إضافة مكان إيواء
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل مكان الإيواء' : 'إضافة مكان إيواء جديد'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>اسم المكان</Label>
                  <Input value={formData.title} onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))} placeholder="مثال: بيت الرحمة" />
                </div>
                <div className="grid gap-2">
                  <Label>اسم المسؤول</Label>
                  <Input value={formData.owner_name} onChange={(event) => setFormData((current) => ({ ...current, owner_name: event.target.value }))} placeholder="اسم المالك أو المسؤول" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>رقم الهاتف</Label>
                  <Input value={formData.phone} onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))} placeholder="0550 00 00 00" dir="ltr" />
                </div>
                <div className="grid gap-2">
                  <Label>الولاية</Label>
                  <Input
                    value={wilayaSearch}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      const bestMatch = getBestMatchingWilaya(wilayas, nextValue);

                      setWilayaSearch(nextValue);

                      if (bestMatch) {
                        setFormData((current) => ({
                          ...current,
                          wilaya_id: bestMatch.id,
                          city: current.wilaya_id === bestMatch.id ? current.city : '',
                        }));

                        if (formData.wilaya_id !== bestMatch.id) {
                          setCommuneSearch('');
                        }

                        return;
                      }

                      setFormData((current) => ({ ...current, wilaya_id: '', city: '' }));
                      setCommuneSearch('');
                    }}
                    placeholder="ابحث عن الولاية"
                  />
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.wilaya_id}
                    onChange={(event) => {
                      setFormData((current) => ({ ...current, wilaya_id: event.target.value, city: '' }));
                      setWilayaSearch(getWilayaLabel(event.target.value));
                      setCommuneSearch('');
                      updateMarkerFromSelection(event.target.value, null);
                    }}
                  >
                    <option value="">اختر الولاية</option>
                    {filteredWilayas.map((wilaya) => (
                      <option key={wilaya.id} value={wilaya.id}>{wilaya.id} - {wilaya.ar_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>البلدية</Label>
                  <Input
                    value={communeSearch}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      const bestMatch = getBestMatchingCommune(formData.wilaya_id, nextValue);

                      setCommuneSearch(nextValue);

                      if (bestMatch) {
                        setFormData((current) => ({ ...current, city: bestMatch.ar_name }));
                        return;
                      }

                      setFormData((current) => ({ ...current, city: '' }));
                    }}
                    placeholder={formData.wilaya_id ? 'ابحث عن البلدية' : 'اختر الولاية أولاً'}
                    disabled={!formData.wilaya_id}
                  />
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.city}
                    onChange={(event) => {
                      setFormData((current) => ({ ...current, city: event.target.value }));
                      setCommuneSearch(event.target.value);
                      updateMarkerFromSelection(formData.wilaya_id, event.target.value);
                    }}
                    disabled={!formData.wilaya_id}
                  >
                    <option value="">{formData.wilaya_id ? 'اختر البلدية' : 'اختر الولاية أولاً'}</option>
                    {availableCommunes.map((commune) => (
                      <option key={commune.id} value={commune.ar_name}>{commune.ar_name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>العنوان التفصيلي</Label>
                  <Input value={formData.address} onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>السعة</Label>
                  <Input type="number" value={formData.capacity} onChange={(event) => setFormData((current) => ({ ...current, capacity: event.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>السعر لليلة</Label>
                  <Input type="number" value={formData.price_per_night} onChange={(event) => setFormData((current) => ({ ...current, price_per_night: event.target.value }))} disabled={formData.is_free} />
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                  <Checkbox checked={formData.is_free} onCheckedChange={(checked) => setFormData((current) => ({ ...current, is_free: Boolean(checked) }))} />
                  <span className="text-sm font-medium">إيواء مجاني</span>
                </label>
                <label className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                  <Checkbox checked={formData.is_active} onCheckedChange={(checked) => setFormData((current) => ({ ...current, is_active: Boolean(checked) }))} />
                  <span className="text-sm font-medium">إظهار المكان في الموقع</span>
                </label>
              </div>

              <div className="grid gap-2">
                <Label>الوصف</Label>
                <Textarea value={formData.description} onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))} placeholder="الخدمات المتاحة، قرب المكان من المستشفى، ملاحظات مهمة..." />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>الموقع على الخريطة</Label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                      onClick={handleUseCurrentLocation}
                    >
                      تحديد موقعي الحالي
                    </button>
                    <span className="text-xs text-slate-500">انقر على الخريطة لتحديد موقع المكان</span>
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="h-[360px] w-full">
                    <MapContainer center={markerPosition || ALGERIA_CENTER} zoom={markerPosition ? 12 : 5} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
                      <MapViewportSync position={markerPosition} />
                      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <MapClickHandler onPick={handleMapPick} />
                      {markerPosition && (
                        <Marker
                          position={markerPosition}
                          draggable
                          eventHandlers={{
                            dragend: (event) => {
                              handleMapPick(event.target.getLatLng());
                            },
                          }}
                        />
                      )}
                    </MapContainer>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>خط العرض</Label>
                  <Input value={formData.latitude} onChange={(event) => setFormData((current) => ({ ...current, latitude: event.target.value }))} dir="ltr" />
                </div>
                <div className="grid gap-2">
                  <Label>خط الطول</Label>
                  <Input value={formData.longitude} onChange={(event) => setFormData((current) => ({ ...current, longitude: event.target.value }))} dir="ltr" />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">حفظ مكان الإيواء</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المكان</TableHead>
              <TableHead className="text-right">الولاية / المدينة</TableHead>
              <TableHead className="text-right">الهاتف</TableHead>
              <TableHead className="text-right">السعة</TableHead>
              <TableHead className="text-right">السعر</TableHead>
              <TableHead className="text-right">الموقع</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center">تحميل...</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center text-slate-500">لا توجد أماكن إيواء محفوظة بعد.</TableCell></TableRow>
            ) : items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.title}</TableCell>
                <TableCell>{getWilayaName(item.wilaya_id)}{item.city ? ` - ${item.city}` : ''}</TableCell>
                <TableCell dir="ltr">{item.phone}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1"><Users className="h-4 w-4 text-slate-400" />{item.capacity}</span>
                </TableCell>
                <TableCell>{item.is_free ? 'مجاني' : `${item.price_per_night} دج/ليلة`}</TableCell>
                <TableCell>
                  {item.latitude && item.longitude ? (
                    <a href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800">
                      <MapPin className="h-4 w-4" />فتح
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

export default AccommodationsManager;