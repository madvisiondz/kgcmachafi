import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Filter, Locate, MapPin, Moon, Navigation, Phone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { contentApi } from '@/lib/localApi';
import { getCommunes, wilayas } from '@/lib/algeria-data';
import { pharmacyDayIcon, pharmacyNightIcon, setupLeafletDefaultIcons, userLocationIcon } from '@/lib/leafletMap';
import { getBestMatchingWilaya, getFilteredWilayas } from '@/lib/wilayaSearch';

setupLeafletDefaultIcons();

const ALGERIA_CENTER = [28.2167, 2.2167];
const ALGERIA_BOUNDS = [
  [18.0, -8.7],
  [37.3, 12.2],
];

const formatDistance = (distanceInKm) => {
  if (distanceInKm == null) {
    return 'المسافة غير متاحة';
  }

  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} متر`;
  }

  return `${distanceInKm.toFixed(1)} كم`;
};

const calculateDistance = (from, to) => {
  const earthRadiusKm = 6371;
  const latitudeDelta = ((to.lat - from.lat) * Math.PI) / 180;
  const longitudeDelta = ((to.lng - from.lng) * Math.PI) / 180;
  const fromLatitude = (from.lat * Math.PI) / 180;
  const toLatitude = (to.lat * Math.PI) / 180;
  const haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2) * Math.cos(fromLatitude) * Math.cos(toLatitude);

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)));
};

const buildGoogleMapsDirectionsUrl = (latitude, longitude) => `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

const PharmacyMapViewport = ({ userLocation, pharmacies, focusedPharmacy }) => {
  const map = useMap();

  useEffect(() => {
    if (focusedPharmacy?.latitudeNumber && focusedPharmacy?.longitudeNumber) {
      map.flyTo([focusedPharmacy.latitudeNumber, focusedPharmacy.longitudeNumber], 15, {
        animate: true,
        duration: 1,
      });
      return;
    }

    const points = pharmacies
      .map((pharmacy) => [Number(pharmacy.latitude), Number(pharmacy.longitude)])
      .filter(([latitude, longitude]) => Number.isFinite(latitude) && Number.isFinite(longitude));

    if (userLocation) {
      points.unshift([userLocation.lat, userLocation.lng]);
    }

    if (points.length === 0) {
      map.setView(ALGERIA_CENTER, 5, { animate: true });
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], userLocation ? 12 : 10, { animate: true });
      return;
    }

    map.fitBounds(points, { padding: [40, 40] });
  }, [focusedPharmacy, map, pharmacies, userLocation]);

  return null;
};

const AlgeriaPharmacies = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedBaladiya, setSelectedBaladiya] = useState('');
  const [isNightOnly, setIsNightOnly] = useState(false);
  const [wilayaSearch, setWilayaSearch] = useState('');
  const [communeSearch, setCommuneSearch] = useState('');
  const [isWilayaSuggestionsOpen, setIsWilayaSuggestionsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [activePharmacyId, setActivePharmacyId] = useState(null);
  const [focusedPharmacy, setFocusedPharmacy] = useState(null);
  const [isNearestOnly, setIsNearestOnly] = useState(false);
  const markerRefs = useRef({});
  const cardRefs = useRef({});

  useEffect(() => {
    const loadPharmacies = async () => {
      try {
        const response = await contentApi.listPharmacies();
        setPharmacies(response.items || []);
      } catch (error) {
        console.error(error);
        toast({
          title: 'تعذر تحميل الصيدليات',
          description: 'حدث خطأ أثناء جلب بيانات الصيدليات.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadPharmacies();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }

    setLocationStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus('success');
      },
      () => {
        setLocationStatus('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, []);

  const filteredWilayas = useMemo(() => {
    return getFilteredWilayas(wilayas, wilayaSearch);
  }, [wilayaSearch]);

  const availableCommunes = useMemo(() => {
    if (!selectedWilaya) {
      return [];
    }

    const communes = getCommunes(selectedWilaya);
    const query = communeSearch.trim().toLowerCase();

    if (!query) {
      return communes;
    }

    return communes.filter((commune) =>
      commune.ar_name.toLowerCase().includes(query) ||
      commune.name.toLowerCase().includes(query) ||
      commune.id.includes(query),
    );
  }, [communeSearch, selectedWilaya]);

  const filteredPharmacies = useMemo(() => pharmacies.filter((pharmacy) => {
    const matchWilaya = !selectedWilaya || pharmacy.wilaya === selectedWilaya;
    const matchBaladiya = !selectedBaladiya || pharmacy.commune === selectedBaladiya;
    const matchNight = !isNightOnly || Boolean(pharmacy.is_night_duty);

    return matchWilaya && matchBaladiya && matchNight;
  }), [isNightOnly, pharmacies, selectedBaladiya, selectedWilaya]);

  const sortedFilteredPharmacies = useMemo(() => filteredPharmacies
    .map((pharmacy) => {
      const latitude = Number(pharmacy.latitude);
      const longitude = Number(pharmacy.longitude);
      const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
      const distance = userLocation && hasCoordinates
        ? calculateDistance(userLocation, { lat: latitude, lng: longitude })
        : null;

      return {
        ...pharmacy,
        latitudeNumber: latitude,
        longitudeNumber: longitude,
        distance,
      };
    })
    .sort((firstPharmacy, secondPharmacy) => {
      if (firstPharmacy.distance == null && secondPharmacy.distance == null) {
        return 0;
      }
      if (firstPharmacy.distance == null) {
        return 1;
      }
      if (secondPharmacy.distance == null) {
        return -1;
      }
      return firstPharmacy.distance - secondPharmacy.distance;
    }), [filteredPharmacies, userLocation]);

  const nearestPharmacy = useMemo(
    () => sortedFilteredPharmacies.find((pharmacy) => pharmacy.distance != null) || null,
    [sortedFilteredPharmacies],
  );

  const visiblePharmacies = useMemo(() => {
    if (isNearestOnly && nearestPharmacy) {
      return [nearestPharmacy];
    }

    return sortedFilteredPharmacies;
  }, [isNearestOnly, nearestPharmacy, sortedFilteredPharmacies]);

  const mappablePharmacies = useMemo(
    () => visiblePharmacies.filter((pharmacy) => Number.isFinite(pharmacy.latitudeNumber) && Number.isFinite(pharmacy.longitudeNumber)),
    [visiblePharmacies],
  );

  const getWilayaLabel = (wilaya) => `${wilaya.id} - ${isRTL ? wilaya.ar_name : wilaya.name}`;

  const updateWilayaSelection = (nextWilayaId) => {
    if (selectedWilaya === nextWilayaId) {
      return;
    }

    setSelectedWilaya(nextWilayaId);
    setSelectedBaladiya('');
    setCommuneSearch('');
  };

  const handleWilayaSelect = (wilaya) => {
    updateWilayaSelection(wilaya.id);
    setWilayaSearch(getWilayaLabel(wilaya));
    setIsWilayaSuggestionsOpen(false);
  };

  const handleSearch = () => {
    const resultsElement = document.getElementById('pharmacy-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }

    toast({
      title: t('common.searchStarted') || 'تم تحديث النتائج',
      description: `تم العثور على ${filteredPharmacies.length} صيدلية`,
    });
  };

  const focusPharmacy = (pharmacy) => {
    if (!Number.isFinite(pharmacy.latitudeNumber) || !Number.isFinite(pharmacy.longitudeNumber)) {
      toast({
        title: 'موقع الصيدلية غير متوفر',
        description: 'هذه الصيدلية لا تحتوي على إحداثيات كافية للتركيز عليها في الخريطة.',
        variant: 'destructive',
      });
      return;
    }

    setActivePharmacyId(pharmacy.id);
    setFocusedPharmacy({
      id: pharmacy.id,
      latitudeNumber: pharmacy.latitudeNumber,
      longitudeNumber: pharmacy.longitudeNumber,
      timestamp: Date.now(),
    });

    const resultsElement = document.getElementById('pharmacy-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.setTimeout(() => {
      markerRefs.current[pharmacy.id]?.openPopup?.();
    }, 250);
  };

  const focusPharmacyCard = (pharmacyId) => {
    setActivePharmacyId(pharmacyId);

    window.setTimeout(() => {
      cardRefs.current[pharmacyId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 150);
  };

  const handleNearestToggle = () => {
    if (!userLocation) {
      toast({
        title: 'تعذر تحديد أقرب صيدلية',
        description: 'فعّل إذن الموقع أولاً لمعرفة أقرب صيدلية إليك.',
        variant: 'destructive',
      });
      return;
    }

    if (!isNearestOnly && !nearestPharmacy) {
      toast({
        title: 'لا توجد صيدلية قريبة',
        description: 'لا توجد نتائج تحتوي على موقع جغرافي ضمن الفلاتر الحالية.',
        variant: 'destructive',
      });
      return;
    }

    const nextNearestOnly = !isNearestOnly;
    setIsNearestOnly(nextNearestOnly);

    if (nextNearestOnly && nearestPharmacy) {
      focusPharmacy(nearestPharmacy);
      toast({
        title: 'تم تحديد أقرب صيدلية',
        description: `${nearestPharmacy.name} تبعد عنك ${formatDistance(nearestPharmacy.distance)}.`,
      });
      return;
    }

    setActivePharmacyId(null);
    setFocusedPharmacy(null);
  };

  const getWilayaName = (wilayaId) => wilayas.find((item) => item.id === wilayaId)?.ar_name || wilayaId;
  const getCommuneName = (wilayaId, communeId) => getCommunes(wilayaId).find((item) => item.id === communeId)?.ar_name || communeId;

  return (
    <section id="pharmacies" className="border-y border-gray-100 bg-gradient-to-b from-emerald-50/50 to-white py-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8 lg:flex-row lg:items-start"
        >
          <div className="sticky top-24 w-full rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg lg:w-1/3 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('pharmacies.title')}</h2>
                <p className="text-sm text-emerald-700">{t('pharmacies.subtitle')}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="flex justify-between text-sm font-bold text-gray-700">
                  {t('pharmacies.selectWilaya')}
                  <span className="text-xs font-normal text-gray-400">58 ولاية</span>
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500"
                    value={wilayaSearch}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      const bestMatch = getBestMatchingWilaya(wilayas, nextValue);

                      setWilayaSearch(nextValue);
                      setIsWilayaSuggestionsOpen(true);

                      if (bestMatch) {
                        updateWilayaSelection(bestMatch.id);
                        return;
                      }

                      setSelectedWilaya('');
                      setSelectedBaladiya('');
                      setCommuneSearch('');
                    }}
                    onFocus={() => setIsWilayaSuggestionsOpen(true)}
                    onBlur={() => {
                      window.setTimeout(() => setIsWilayaSuggestionsOpen(false), 150);
                    }}
                    placeholder="ابحث عن الولاية"
                  />
                  {isWilayaSuggestionsOpen && (
                    <div className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-2 shadow-lg">
                      {filteredWilayas.length > 0 ? (
                        filteredWilayas.map((wilaya) => (
                          <button
                            key={wilaya.id}
                            type="button"
                            className="flex w-full items-center rounded-xl px-3 py-2 text-sm text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                            onMouseDown={() => handleWilayaSelect(wilaya)}
                          >
                            {getWilayaLabel(wilaya)}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">لا توجد ولاية مطابقة</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    onChange={(event) => {
                      const nextWilaya = wilayas.find((wilaya) => wilaya.id === event.target.value);
                      if (nextWilaya) {
                        handleWilayaSelect(nextWilaya);
                        return;
                      }

                      setSelectedWilaya('');
                      setSelectedBaladiya('');
                      setCommuneSearch('');
                      setWilayaSearch('');
                    }}
                    value={selectedWilaya}
                  >
                    <option value="" hidden />
                    {filteredWilayas.map((wilaya) => (
                      <option key={wilaya.id} value={wilaya.id}>
                        {wilaya.id} - {isRTL ? wilaya.ar_name : wilaya.name}
                      </option>
                    ))}
                  </select>
                  <MapPin className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 ${isRTL ? 'left-3' : 'right-3'}`} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">{t('pharmacies.selectBaladiya')}</label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                  value={communeSearch}
                  onChange={(event) => setCommuneSearch(event.target.value)}
                  placeholder={selectedWilaya ? 'ابحث عن البلدية' : 'اختر الولاية أولاً'}
                  disabled={!selectedWilaya}
                />
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(event) => setSelectedBaladiya(event.target.value)}
                    value={selectedBaladiya}
                    disabled={!selectedWilaya}
                  >
                    {availableCommunes.length > 0 ? <option value="" hidden /> : <option value="">{selectedWilaya ? 'لا توجد بيانات' : 'اختر الولاية أولاً'}</option>}
                    {availableCommunes.map((commune) => (
                      <option key={commune.id} value={commune.id}>
                        {isRTL ? commune.ar_name : commune.name}
                      </option>
                    ))}
                  </select>
                  <Filter className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 ${isRTL ? 'left-3' : 'right-3'}`} />
                </div>
              </div>

              <div
                className="flex cursor-pointer items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 p-3"
                onClick={() => setIsNightOnly((current) => !current)}
              >
                <div className="flex items-center gap-2">
                  <div className={`rounded-full p-1.5 ${isNightOnly ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-400'}`}>
                    <Moon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-indigo-900">{t('pharmacies.night') || 'صيدليات المناوبة'}</span>
                </div>
                <div className={`relative h-5 w-10 rounded-full transition-colors ${isNightOnly ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${isNightOnly ? (isRTL ? 'left-1' : 'right-1') : (isRTL ? 'right-1' : 'left-1')}`} />
                </div>
              </div>

              <Button onClick={handleSearch} className="mt-4 w-full bg-emerald-600 py-6 text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700">
                <Search className="mr-2 h-5 w-5" />
                {t('pharmacies.search')}
              </Button>

              <Button
                type="button"
                variant={isNearestOnly ? 'default' : 'outline'}
                onClick={handleNearestToggle}
                className={`w-full py-6 text-base ${isNearestOnly ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-200 text-blue-700 hover:bg-blue-50'}`}
              >
                <Locate className="mr-2 h-5 w-5" />
                {isNearestOnly ? 'عرض كل الصيدليات' : 'أقرب صيدلية إلي'}
              </Button>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-900">
                <p className="font-bold">عدد النتائج الحالية: {visiblePharmacies.length}</p>
                <p className="mt-1 text-emerald-700">
                  {locationStatus === 'loading' && 'جاري تحديد موقعك لعرض أقرب الصيدليات...'}
                  {locationStatus === 'success' && 'تم تحديد موقعك وعرض المسافات إلى الصيدليات.'}
                  {locationStatus === 'denied' && 'تعذر الوصول إلى موقعك. فعّل إذن الموقع لعرض المسافات والاتجاهات بدقة.'}
                  {locationStatus === 'unsupported' && 'المتصفح لا يدعم تحديد الموقع الجغرافي.'}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full space-y-6 lg:w-2/3" id="pharmacy-results">
            <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b bg-emerald-50/70 px-5 py-4">
                <h3 className="text-lg font-bold text-gray-800">خريطة الصيدليات</h3>
                <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-500">
                  {mappablePharmacies.length} صيدلية على الخريطة
                </span>
              </div>
              <div className="h-[420px] w-full">
                <MapContainer
                  center={ALGERIA_CENTER}
                  zoom={5}
                  minZoom={6}
                  maxBounds={ALGERIA_BOUNDS}
                  maxBoundsViscosity={1}
                  scrollWheelZoom
                  style={{ height: '100%', width: '100%' }}
                >
                  <PharmacyMapViewport userLocation={userLocation} pharmacies={mappablePharmacies} focusedPharmacy={focusedPharmacy} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {userLocation && (
                    <>
                      <Circle
                        center={userLocation}
                        radius={450}
                        pathOptions={{ color: '#2563eb', fillColor: '#60a5fa', fillOpacity: 0.12 }}
                      />
                      <Marker position={userLocation} icon={userLocationIcon}>
                        <Popup>
                          <div className="space-y-1 text-right" dir="rtl">
                            <h4 className="flex items-center gap-2 font-bold text-blue-700">
                              <Locate className="h-4 w-4" />
                              موقعك الحالي
                            </h4>
                            <p className="text-sm text-gray-600">يتم حساب المسافة من هذا الموقع إلى كل صيدلية.</p>
                          </div>
                        </Popup>
                      </Marker>
                    </>
                  )}
                  {mappablePharmacies.map((pharmacy) => (
                    <Marker
                      key={pharmacy.id}
                      ref={(element) => {
                        if (element) {
                          markerRefs.current[pharmacy.id] = element;
                        }
                      }}
                      position={[Number(pharmacy.latitude), Number(pharmacy.longitude)]}
                      icon={pharmacy.is_night_duty ? pharmacyNightIcon : pharmacyDayIcon}
                      eventHandlers={{
                        click: () => focusPharmacyCard(pharmacy.id),
                      }}
                    >
                      <Popup>
                        <div className="space-y-2 text-right" dir="rtl">
                          <h4 className="font-bold text-emerald-700">{pharmacy.name}</h4>
                          <p className="text-sm">{getWilayaName(pharmacy.wilaya)} - {getCommuneName(pharmacy.wilaya, pharmacy.commune)}</p>
                          <p className="text-sm" dir="ltr">{pharmacy.phone || 'لا يوجد رقم هاتف'}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${pharmacy.is_night_duty ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                              <Moon className="h-3 w-3" />
                              {pharmacy.is_night_duty ? 'صيدلية مناوبة' : 'ليست مناوبة الآن'}
                            </span>
                            {userLocation && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                                تبعد {formatDistance(calculateDistance(userLocation, { lat: Number(pharmacy.latitude), lng: Number(pharmacy.longitude) }))}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 pt-1">
                            {pharmacy.phone && (
                              <a
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
                                href={`tel:${pharmacy.phone}`}
                              >
                                <Phone className="h-3.5 w-3.5" />
                                اتصال
                              </a>
                            )}
                            <a
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700"
                              href={buildGoogleMapsDirectionsUrl(pharmacy.latitude, pharmacy.longitude)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Navigation className="h-3.5 w-3.5" />
                              الاتجاهات
                            </a>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            <div className="grid gap-4">
              {loading ? (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center text-gray-500">
                  جاري تحميل الصيدليات...
                </div>
              ) : visiblePharmacies.length > 0 ? (
                visiblePharmacies.map((pharmacy) => (
                  <motion.div
                    key={pharmacy.id}
                    ref={(element) => {
                      if (element) {
                        cardRefs.current[pharmacy.id] = element;
                      }
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    onClick={() => focusPharmacy(pharmacy)}
                    className={`group flex cursor-pointer flex-col items-start justify-between gap-4 rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center ${activePharmacyId === pharmacy.id ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-100'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                        <h3 className="text-xl font-bold">💊</h3>
                      </div>
                      <div>
                        <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 transition-colors group-hover:text-emerald-700">
                          {pharmacy.name}
                          {pharmacy.is_night_duty && (
                            <span className="flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-100 px-2 py-1 text-xs text-indigo-700">
                              <Moon className="h-3 w-3" />
                              {t('pharmacies.night') || 'مناوبة'}
                            </span>
                          )}
                        </h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {getWilayaName(pharmacy.wilaya)} - {getCommuneName(pharmacy.wilaya, pharmacy.commune)}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500" dir="ltr">
                          <Phone className="h-3.5 w-3.5" />
                          {pharmacy.phone || 'لا يوجد رقم هاتف'}
                        </p>
                        <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          <Locate className="h-3.5 w-3.5" />
                          {userLocation ? `تبعد عنك ${formatDistance(pharmacy.distance)}` : 'فعّل الموقع لمعرفة المسافة'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex w-full gap-2 sm:mt-0 sm:w-auto">
                      {pharmacy.latitude && pharmacy.longitude && (
                        <Button asChild variant="outline" size="icon" className="rounded-xl border-gray-200 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600">
                          <a href={buildGoogleMapsDirectionsUrl(pharmacy.latitude, pharmacy.longitude)} target="_blank" rel="noreferrer" aria-label="Open map directions" onClick={(event) => event.stopPropagation()}>
                            <Navigation className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {pharmacy.phone ? (
                        <Button asChild className="flex-1 rounded-xl bg-emerald-600 shadow-md shadow-emerald-100 hover:bg-emerald-700 sm:flex-none">
                          <a href={`tel:${pharmacy.phone}`} onClick={(event) => event.stopPropagation()}>
                            <Phone className="mr-2 h-4 w-4" />
                            {t('pharmacies.call')}
                          </a>
                        </Button>
                      ) : (
                        <div className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm text-gray-400 sm:flex-none">
                          لا يوجد رقم هاتف
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-600">لا توجد صيدليات مطابقة</h3>
                  <p className="mt-2 text-sm text-gray-400">جرب تغيير الولاية أو البلدية أو إيقاف فلتر المناوبة الليلية</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AlgeriaPharmacies;
