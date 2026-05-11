import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { contentApi } from '@/lib/localApi';
import { Bus as Ambulance, Locate, Map as MapIcon, Navigation, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { ambulanceMapIcon, userLocationIcon } from '@/lib/leafletMap';

// Fix Leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

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

const HealthMapViewport = ({ userLocation, ambulancePoints, focusedAmbulance }) => {
  const map = useMap();

  useEffect(() => {
    if (focusedAmbulance?.latitudeNumber && focusedAmbulance?.longitudeNumber) {
      map.flyTo([focusedAmbulance.latitudeNumber, focusedAmbulance.longitudeNumber], 14, {
        animate: true,
        duration: 1,
      });
      return;
    }

    const points = ambulancePoints
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
  }, [ambulancePoints, focusedAmbulance, map, userLocation]);

  return null;
};

const HealthMap = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [focusedAmbulanceId, setFocusedAmbulanceId] = useState(null);
  const markerRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      const ambulancesResponse = await contentApi.listAmbulances();
      setAmbulances(ambulancesResponse.items || []);
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

  const ambulancePoints = useMemo(() => ambulances
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
    .filter((item) => Number.isFinite(item.latitudeNumber) && Number.isFinite(item.longitudeNumber)), [ambulances, userLocation]);

  const sortedAmbulancePoints = useMemo(() => [...ambulancePoints].sort((firstItem, secondItem) => {
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
  }), [ambulancePoints]);

  const nearestAmbulance = useMemo(() => sortedAmbulancePoints.find((item) => item.distance != null) || null, [sortedAmbulancePoints]);

  const focusedAmbulance = useMemo(
    () => ambulancePoints.find((item) => item.id === focusedAmbulanceId) || null,
    [ambulancePoints, focusedAmbulanceId],
  );

  const handleNearestAmbulance = () => {
    if (!userLocation || !nearestAmbulance) {
      return;
    }

    setFocusedAmbulanceId(nearestAmbulance.id);

    window.setTimeout(() => {
      markerRefs.current[nearestAmbulance.id]?.openPopup?.();
    }, 200);
  };

  const focusAmbulance = (ambulanceId) => {
    setFocusedAmbulanceId(ambulanceId);

    window.setTimeout(() => {
      markerRefs.current[ambulanceId]?.openPopup?.();
    }, 200);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <MapIcon className="w-6 h-6 text-green-600" />
              خريطة سيارات الإسعاف
            </h2>
            <p className="text-gray-500 text-sm mt-1">تصفح مواقع سيارات الإسعاف داخل الجزائر واعثر على الأقرب إلى موقعك</p>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              variant="outline"
              className="text-sky-700 border-sky-200 hover:bg-sky-50"
              onClick={handleNearestAmbulance}
              disabled={!userLocation || !nearestAmbulance}
            >
              <Locate className="w-4 h-4 mr-2" />
              أقرب سيارة إسعاف لي
            </Button>
          </div>
        </div>

        <div className="px-6 py-3 border-b bg-slate-50 text-sm text-slate-600 flex flex-wrap items-center gap-3">
          {locationStatus === 'loading' && <span>جاري تحديد موقعك الحالي...</span>}
          {locationStatus === 'success' && <span>تم تحديد موقعك الحالي وإظهار النقطة الزرقاء على الخريطة.</span>}
          {locationStatus === 'denied' && <span>تعذر الوصول إلى موقعك الحالي. فعّل إذن الموقع لاستخدام أقرب سيارة إسعاف.</span>}
          {locationStatus === 'unsupported' && <span>المتصفح لا يدعم تحديد الموقع الجغرافي.</span>}
          {nearestAmbulance && userLocation && <span className="font-semibold text-red-700">أقرب سيارة إسعاف تبعد {formatDistance(nearestAmbulance.distance)}</span>}
        </div>

        <div className="h-[500px] w-full z-0 relative">
           <MapContainer center={ALGERIA_CENTER} zoom={6} minZoom={6} maxBounds={ALGERIA_BOUNDS} maxBoundsViscosity={1} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 1 }}>
            <HealthMapViewport userLocation={userLocation} ambulancePoints={ambulancePoints} focusedAmbulance={focusedAmbulance} />
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
                      <p className="text-sm mt-1">من هذه النقطة يتم حساب أقرب سيارة إسعاف.</p>
                    </div>
                  </Popup>
                </Marker>
              </>
            )}
            
            {ambulancePoints.map((item) => (
              item.latitude && item.longitude ? (
                <Marker 
                  key={`amb-${item.id}`} 
                  ref={(element) => {
                    if (element) {
                      markerRefs.current[item.id] = element;
                    }
                  }}
                  position={[item.latitudeNumber, item.longitudeNumber]} 
                  icon={ambulanceMapIcon}
                  eventHandlers={{
                    click: () => setFocusedAmbulanceId(item.id),
                  }}
                >
                  <Popup>
                    <div className="text-right" dir="rtl">
                      <h3 className="font-bold text-red-700">{item.owner_name}</h3>
                      <p className="text-sm">{item.city}</p>
                      <p className="text-sm font-mono mt-1">{item.phone}</p>
                      {item.distance != null && (
                        <p className="text-xs mt-2 text-sky-700 font-semibold">تبعد عنك {formatDistance(item.distance)}</p>
                      )}
                      <Badge variant={item.is_free ? "success" : "secondary"} className="mt-2">
                        {item.is_free ? "مجاني" : "مدفوع"}
                      </Badge>
                      <div className="mt-3">
                        <a
                          href={buildGoogleMapsDirectionsUrl(item.latitudeNumber, item.longitudeNumber)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          الاتجاهات
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
        </div>
        <div className="border-t bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-gray-800">قائمة سيارات الإسعاف</h3>
            <span className="text-sm text-gray-500">مرتبة من الأقرب إلى الأبعد عند توفر موقعك</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sortedAmbulancePoints.length > 0 ? (
              sortedAmbulancePoints.map((item) => (
                <button
                  key={`ambulance-card-${item.id}`}
                  type="button"
                  onClick={() => focusAmbulance(item.id)}
                  className={`rounded-2xl border p-4 text-right transition hover:shadow-md ${focusedAmbulanceId === item.id ? 'border-red-300 bg-red-50 shadow-sm' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{item.owner_name}</h4>
                      <p className="mt-1 text-sm text-gray-500">{item.city || 'بدون مدينة محددة'}</p>
                    </div>
                    <div className="rounded-full bg-red-100 p-2 text-red-600">
                      <Ambulance className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600" dir="ltr">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{item.phone}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                      {userLocation ? `تبعد ${formatDistance(item.distance)}` : 'فعّل الموقع لمعرفة المسافة'}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.is_free ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {item.is_free ? 'مجاني' : 'مدفوع'}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center text-gray-500">
                لا توجد سيارات إسعاف تحتوي على إحداثيات لعرضها في الخريطة.
              </div>
            )}
          </div>
        </div>
        <div className="p-3 bg-yellow-50 text-yellow-800 text-xs text-center border-t border-yellow-100">
           ملاحظة: يتم عرض العناصر التي تتوفر على إحداثيات جغرافية فقط.
        </div>
      </div>
    </div>
  );
};

export default HealthMap;