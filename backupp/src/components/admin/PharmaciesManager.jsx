import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Edit, MapPin, Moon, Phone, Pill, Plus, Trash } from 'lucide-react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { getCommunes, wilayas } from '@/lib/algeria-data';
import { geocodeAdministrativeSelection, getBestMatchingCommune, getFilteredCommunes, getWilayaLabel, reverseGeocodeAdministrativeSelection } from '@/lib/algeriaLocation';
import { setupLeafletDefaultIcons, pharmacyDayIcon, pharmacyNightIcon } from '@/lib/leafletMap';
import { adminApi } from '@/lib/localApi';
import { getBestMatchingWilaya, getFilteredWilayas } from '@/lib/wilayaSearch';

setupLeafletDefaultIcons();

const ALGERIA_CENTER = [28.2167, 2.2167];

const initialForm = {
  name: '',
  wilaya: '',
  commune: '',
  phone: '',
  latitude: '',
  longitude: '',
  is_night_duty: false,
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

    map.flyTo(position, 12, {
      animate: true,
      duration: 0.8,
    });
  }, [map, position]);

  return null;
};

const MapSelectionZoom = ({ position }) => {
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

const PharmaciesManager = () => {
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

  const availableCommunes = useMemo(() => {
    return getFilteredCommunes(formData.wilaya, communeSearch);
  }, [communeSearch, formData.wilaya]);

  const loadItems = async () => {
    setLoading(true);

    try {
      const response = await adminApi.listPharmacies();
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
    setCommuneSearch('');
  };

  const handleSave = async () => {
    if (!formData.name || !formData.wilaya || !formData.commune || !formData.phone) {
      toast({
        title: 'بيانات ناقصة',
        description: 'أدخل الاسم والولاية والبلدية ورقم الهاتف.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.latitude === '' || formData.longitude === '') {
      toast({
        title: 'الموقع مطلوب',
        description: 'اختر موقع الصيدلية بالنقر على الخريطة.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      if (editingId) {
        await adminApi.updatePharmacy(editingId, payload);
      } else {
        await adminApi.createPharmacy(payload);
      }

      toast({
        title: 'تم الحفظ',
        description: editingId ? 'تم تحديث الصيدلية.' : 'تمت إضافة الصيدلية.',
      });
      setIsDialogOpen(false);
      resetForm();
      loadItems();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (item) => {
    const activeWilaya = wilayas.find((wilaya) => wilaya.id === String(item.wilaya));
    const activeCommune = getCommunes(String(item.wilaya)).find((commune) => commune.id === String(item.commune));

    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      wilaya: item.wilaya || '',
      commune: item.commune || '',
      phone: item.phone || '',
      latitude: item.latitude !== null && item.latitude !== undefined ? String(item.latitude) : '',
      longitude: item.longitude !== null && item.longitude !== undefined ? String(item.longitude) : '',
      is_night_duty: Boolean(item.is_night_duty),
      is_active: Boolean(item.is_active),
    });
    setWilayaSearch(activeWilaya ? `${activeWilaya.id} - ${activeWilaya.ar_name}` : '');
    setCommuneSearch(activeCommune?.ar_name || '');
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
      console.error('Failed to geocode pharmacy selection', error);
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
        wilaya: resolvedLocation.wilaya.id,
        commune: resolvedLocation.commune?.id || '',
      }));
      setWilayaSearch(getWilayaLabel(resolvedLocation.wilaya.id));
      setCommuneSearch(resolvedLocation.commune?.ar_name || '');
    } catch (error) {
      console.error('Failed to reverse geocode pharmacy location', error);
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
    if (!window.confirm('حذف هذه الصيدلية؟')) {
      return;
    }

    try {
      await adminApi.deletePharmacy(id);
      toast({ title: 'تم الحذف', description: 'تم حذف الصيدلية.' });
      loadItems();
    } catch (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const markerPosition = formData.latitude !== '' && formData.longitude !== ''
    ? [Number(formData.latitude), Number(formData.longitude)]
    : null;

  const getWilayaName = (wilayaId) => wilayas.find((item) => item.id === String(wilayaId))?.ar_name || wilayaId;
  const getCommuneName = (wilayaId, communeId) => getCommunes(String(wilayaId)).find((item) => item.id === String(communeId))?.ar_name || communeId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Pill className="h-6 w-6 text-emerald-600" />
          إدارة الصيدليات
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
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              إضافة صيدلية
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل الصيدلية' : 'إضافة صيدلية جديدة'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>اسم الصيدلية</Label>
                  <Input
                    value={formData.name}
                    onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                    placeholder="مثال: صيدلية الشفاء"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>رقم الهاتف</Label>
                  <Input
                    value={formData.phone}
                    onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                    placeholder="مثال: 0550 00 00 00"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
                          wilaya: bestMatch.id,
                          commune: current.wilaya === bestMatch.id ? current.commune : '',
                        }));

                        if (formData.wilaya !== bestMatch.id) {
                          setCommuneSearch('');
                        }

                        return;
                      }

                      setFormData((current) => ({ ...current, wilaya: '', commune: '' }));
                      setCommuneSearch('');
                    }}
                    placeholder="ابحث عن الولاية"
                  />
                  <Select
                    value={formData.wilaya}
                    onValueChange={(value) => {
                      setFormData((current) => ({ ...current, wilaya: value, commune: '' }));
                      setWilayaSearch(getWilayaLabel(value));
                      setCommuneSearch('');
                      updateMarkerFromSelection(value, null);
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="اختر الولاية" /></SelectTrigger>
                    <SelectContent>
                      {filteredWilayas.map((wilaya) => (
                        <SelectItem key={wilaya.id} value={wilaya.id}>
                          {wilaya.id} - {wilaya.ar_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>البلدية</Label>
                  <Input
                    value={communeSearch}
                    onChange={(event) => setCommuneSearch(event.target.value)}
                    placeholder={formData.wilaya ? 'ابحث عن البلدية' : 'اختر الولاية أولاً'}
                    disabled={!formData.wilaya}
                  />
                  <Select
                    value={formData.commune}
                    onValueChange={(value) => {
                      const selectedCommune = getCommunes(formData.wilaya).find((commune) => commune.id === value);
                      setFormData((current) => ({ ...current, commune: value }));
                      setCommuneSearch(selectedCommune?.ar_name || '');
                      updateMarkerFromSelection(formData.wilaya, selectedCommune?.ar_name || selectedCommune?.name || null);
                    }}
                    disabled={!formData.wilaya}
                  >
                    <SelectTrigger><SelectValue placeholder={formData.wilaya ? 'اختر البلدية' : 'اختر الولاية أولاً'} /></SelectTrigger>
                    <SelectContent>
                      {availableCommunes.map((commune) => (
                        <SelectItem key={commune.id} value={commune.id}>
                          {commune.ar_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                  <Checkbox
                    checked={formData.is_night_duty}
                    onCheckedChange={(checked) => setFormData((current) => ({ ...current, is_night_duty: Boolean(checked) }))}
                  />
                  <span className="text-sm font-medium">هل لديه مناوبة ليلية اليوم؟</span>
                </label>

                <label className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                  <Checkbox
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData((current) => ({ ...current, is_active: Boolean(checked) }))}
                  />
                  <span className="text-sm font-medium">إظهار الصيدلية في الموقع</span>
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>الموقع على الخريطة</Label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                      onClick={handleUseCurrentLocation}
                    >
                      تحديد موقعي الحالي
                    </button>
                    <span className="text-xs text-slate-500">انقر على الخريطة لتحديد موقع الصيدلية</span>
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="h-[360px] w-full">
                    <MapContainer center={markerPosition || ALGERIA_CENTER} zoom={markerPosition ? 12 : 5} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
                      <MapSelectionZoom position={markerPosition} />
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapClickHandler onPick={handleMapPick} />
                      {markerPosition && (
                        <Marker
                          position={markerPosition}
                          icon={formData.is_night_duty ? pharmacyNightIcon : pharmacyDayIcon}
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
                  <Input
                    value={formData.latitude}
                    onChange={(event) => setFormData((current) => ({ ...current, latitude: event.target.value }))}
                    placeholder="36.753768"
                    dir="ltr"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>خط الطول</Label>
                  <Input
                    value={formData.longitude}
                    onChange={(event) => setFormData((current) => ({ ...current, longitude: event.target.value }))}
                    placeholder="3.058756"
                    dir="ltr"
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-700">
                حفظ الصيدلية
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">الولاية / البلدية</TableHead>
              <TableHead className="text-right">الهاتف</TableHead>
              <TableHead className="text-right">الموقع</TableHead>
              <TableHead className="text-right">المناوبة</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">تحميل...</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-500">لا توجد صيدليات محفوظة بعد.</TableCell>
              </TableRow>
            ) : items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.name}</TableCell>
                <TableCell>{getWilayaName(item.wilaya)} - {getCommuneName(item.wilaya, item.commune)}</TableCell>
                <TableCell dir="ltr">{item.phone}</TableCell>
                <TableCell>
                  {item.latitude && item.longitude ? (
                    <a
                      href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800"
                    >
                      <MapPin className="h-4 w-4" />
                      فتح
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">بدون</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.is_night_duty ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
                      <Moon className="h-3.5 w-3.5" />
                      ليلية
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">عادية</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.is_active ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">ظاهر</span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">مخفي</span>
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash className="h-4 w-4 text-red-600" />
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

export default PharmaciesManager;
