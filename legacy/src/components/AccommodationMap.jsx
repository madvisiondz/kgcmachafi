import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BedDouble, Locate, MapPin, Navigation, Phone, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { contentApi } from '@/lib/localApi';
import { accommodationMapIcon, setupLeafletDefaultIcons, userLocationIcon } from '@/lib/leafletMap';
import { wilayas } from '@/lib/algeria-data';

setupLeafletDefaultIcons();

const ALGERIA_CENTER = [28.2167, 2.2167];
const ALGERIA_BOUNDS = [
  [18.0, -8.7],
  [37.3, 12.2],
];

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

const formatDistance = (distanceInKm) => {
  if (distanceInKm == null) {
    return 'المسافة غير متاحة';
  }

  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} متر`;
  }

  return `${distanceInKm.toFixed(1)} كم`;
};

const buildGoogleMapsDirectionsUrl = (latitude, longitude) => `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

const AccommodationMapViewport = ({ userLocation, accommodationPoints, focusedAccommodation }) => {
  const map = useMap();

  useEffect(() => {
    if (focusedAccommodation?.latitudeNumber && focusedAccommodation?.longitudeNumber) {
      map.flyTo([focusedAccommodation.latitudeNumber, focusedAccommodation.longitudeNumber], 14, {
        animate: true,
        duration: 1,
      });
      return;
    }

    const points = accommodationPoints
      .map((item) => [item.latitudeNumber, item.longitudeNumber])
      .filter(([latitude, longitude]) => Number.isFinite(latitude) && Number.isFinite(longitude));

    if (userLocation) {
      points.unshift([userLocation.lat, userLocation.lng]);
    }

    if (points.length === 0) {
      map.setView(ALGERIA_CENTER, 6, { animate: true });
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 12, { animate: true });
      return;
    }

    map.fitBounds(points, { padding: [40, 40] });
  }, [accommodationPoints, focusedAccommodation, map, userLocation]);

  return null;
};

const AccommodationMap = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [focusedAccommodationId, setFocusedAccommodationId] = useState(null);
  const markerRefs = useRef({});
  const cardRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await contentApi.listAccommodations();
      setAccommodations(response.items || []);
    };

    fetchData();
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

  const accommodationPoints = useMemo(() => accommodations
    .map((item) => {
      const latitude = Number(item.latitude);
      const longitude = Number(item.longitude);
      const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
      const distance = userLocation && hasCoordinates
        ? calculateDistance(userLocation, { lat: latitude, lng: longitude })
        : null;

      return {
        ...item,
        latitudeNumber: latitude,
        longitudeNumber: longitude,
        distance,
      };
    })
    .filter((item) => Number.isFinite(item.latitudeNumber) && Number.isFinite(item.longitudeNumber)), [accommodations, userLocation]);

  const sortedAccommodationPoints = useMemo(() => [...accommodationPoints].sort((firstItem, secondItem) => {
    if (firstItem.distance == null && secondItem.distance == null) {
      return 0;
    }
    if (firstItem.distance == null) {
      return 1;
    }
    if (secondItem.distance == null) {
      return -1;
    }

    return firstItem.distance - secondItem.distance;
  }), [accommodationPoints]);

  const nearestAccommodation = useMemo(
    () => sortedAccommodationPoints.find((item) => item.distance != null) || null,
    [sortedAccommodationPoints],
  );

  const focusedAccommodation = useMemo(
    () => accommodationPoints.find((item) => item.id === focusedAccommodationId) || null,
    [accommodationPoints, focusedAccommodationId],
  );

  const handleNearestAccommodation = () => {
    if (!userLocation || !nearestAccommodation) {
      return;
    }

    setFocusedAccommodationId(nearestAccommodation.id);

    window.setTimeout(() => {
      markerRefs.current[nearestAccommodation.id]?.openPopup?.();
    }, 200);
  };

  const focusAccommodation = (accommodationId) => {
    setFocusedAccommodationId(accommodationId);

    window.setTimeout(() => {
      markerRefs.current[accommodationId]?.openPopup?.();
    }, 200);
  };

  const focusAccommodationCard = (accommodationId) => {
    setFocusedAccommodationId(accommodationId);

    window.setTimeout(() => {
      cardRefs.current[accommodationId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 150);
  };

  const getWilayaName = (wilayaId) => wilayas.find((item) => item.id === String(wilayaId))?.ar_name || wilayaId;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="flex flex-col items-start justify-between gap-4 border-b bg-slate-50 p-6 md:flex-row md:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <MapPin className="h-6 w-6 text-blue-600" />
              خريطة إيواء المرضى
            </h2>
            <p className="mt-1 text-sm text-gray-500">تصفح أماكن الإيواء داخل الجزائر واعثر على الأقرب إلى موقعك</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              variant="outline"
              className="border-sky-200 text-sky-700 hover:bg-sky-50"
              onClick={handleNearestAccommodation}
              disabled={!userLocation || !nearestAccommodation}
            >
              <Locate className="mr-2 h-4 w-4" />
              أقرب مكان إيواء لي
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b bg-slate-50 px-6 py-3 text-sm text-slate-600">
          {locationStatus === 'loading' && <span>جاري تحديد موقعك الحالي...</span>}
          {locationStatus === 'success' && <span>تم تحديد موقعك الحالي وإظهار النقطة الزرقاء على الخريطة.</span>}
          {locationStatus === 'denied' && <span>تعذر الوصول إلى موقعك الحالي. فعّل إذن الموقع لاستخدام أقرب مكان إيواء.</span>}
          {locationStatus === 'unsupported' && <span>المتصفح لا يدعم تحديد الموقع الجغرافي.</span>}
          {nearestAccommodation && userLocation && <span className="font-semibold text-blue-700">أقرب مكان إيواء يبعد {formatDistance(nearestAccommodation.distance)}</span>}
        </div>

        <div className="relative h-[500px] w-full">
          <MapContainer center={ALGERIA_CENTER} zoom={6} minZoom={6} maxBounds={ALGERIA_BOUNDS} maxBoundsViscosity={1} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <AccommodationMapViewport userLocation={userLocation} accommodationPoints={accommodationPoints} focusedAccommodation={focusedAccommodation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userLocation && (
              <>
                <Circle
                  center={userLocation}
                  radius={400}
                  pathOptions={{ color: '#2563eb', fillColor: '#60a5fa', fillOpacity: 0.14 }}
                />
                <Marker position={userLocation} icon={userLocationIcon}>
                  <Popup>
                    <div className="text-right" dir="rtl">
                      <h3 className="font-bold text-sky-700">موقعك الحالي</h3>
                      <p className="mt-1 text-sm">من هذه النقطة يتم حساب أقرب مكان إيواء.</p>
                    </div>
                  </Popup>
                </Marker>
              </>
            )}

            {accommodationPoints.map((item) => (
              <Marker
                key={`acc-${item.id}`}
                ref={(element) => {
                  if (element) {
                    markerRefs.current[item.id] = element;
                  }
                }}
                position={[item.latitudeNumber, item.longitudeNumber]}
                icon={accommodationMapIcon}
                eventHandlers={{
                  click: () => focusAccommodationCard(item.id),
                }}
              >
                <Popup>
                  <div className="space-y-2 text-right" dir="rtl">
                    <h3 className="font-bold text-blue-700">{item.title}</h3>
                    <p className="text-sm">{getWilayaName(item.wilaya_id)}{item.city ? ` - ${item.city}` : ''}</p>
                    <p className="text-sm font-mono" dir="ltr">{item.phone}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={item.is_free ? 'success' : 'secondary'}>
                        {item.is_free ? 'مجاني' : `${item.price_per_night} دج/ليلة`}
                      </Badge>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">السعة: {item.capacity}</span>
                    </div>
                    {item.distance != null && (
                      <p className="text-xs font-semibold text-sky-700">يبعد عنك {formatDistance(item.distance)}</p>
                    )}
                    <div className="flex gap-2 pt-1">
                      <a
                        href={`tel:${item.phone}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        اتصال
                      </a>
                      <a
                        href={buildGoogleMapsDirectionsUrl(item.latitudeNumber, item.longitudeNumber)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700"
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

        <div className="border-t bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-gray-800">قائمة أماكن الإيواء</h3>
            <span className="text-sm text-gray-500">مرتبة من الأقرب إلى الأبعد عند توفر موقعك</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sortedAccommodationPoints.length > 0 ? (
              sortedAccommodationPoints.map((item) => (
                <button
                  key={`accommodation-card-${item.id}`}
                  type="button"
                  ref={(element) => {
                    if (element) {
                      cardRefs.current[item.id] = element;
                    }
                  }}
                  onClick={() => focusAccommodation(item.id)}
                  className={`rounded-2xl border p-4 text-right transition hover:shadow-md ${focusedAccommodationId === item.id ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="mt-1 text-sm text-gray-500">{getWilayaName(item.wilaya_id)}{item.city ? ` - ${item.city}` : ''}</p>
                    </div>
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                      <BedDouble className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600" dir="ltr">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{item.phone}</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>السعة: {item.capacity} أشخاص</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                      {userLocation ? `يبعد ${formatDistance(item.distance)}` : 'فعّل الموقع لمعرفة المسافة'}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.is_free ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {item.is_free ? 'مجاني' : `${item.price_per_night} دج/ليلة`}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${item.phone}`}
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700"
                    >
                      <Phone className="h-4 w-4" />
                      اتصال
                    </a>
                    <a
                      href={buildGoogleMapsDirectionsUrl(item.latitudeNumber, item.longitudeNumber)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50"
                    >
                      <Navigation className="h-4 w-4" />
                      الاتجاهات
                    </a>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center text-gray-500">
                لا توجد أماكن إيواء تحتوي على إحداثيات لعرضها في الخريطة.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationMap;