import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

let defaultIconsConfigured = false;

export const setupLeafletDefaultIcons = () => {
  if (defaultIconsConfigured) {
    return;
  }

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  });

  defaultIconsConfigured = true;
};

export const pharmacyDayIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="54" viewBox="0 0 42 54">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#064e3b" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M21 2C11.61 2 4 9.61 4 19c0 13.75 17 31 17 31s17-17.25 17-31C38 9.61 30.39 2 21 2z" fill="#10b981"/>
        <circle cx="21" cy="19" r="10" fill="#ecfdf5"/>
        <path d="M19 13h4v4h4v4h-4v4h-4v-4h-4v-4h4z" fill="#047857"/>
      </g>
    </svg>
  `)}`,
  iconSize: [42, 54],
  iconAnchor: [21, 54],
  popupAnchor: [0, -42],
  shadowSize: [0, 0],
});

export const pharmacyNightIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="54" viewBox="0 0 42 54">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#7c2d12" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M21 2C11.61 2 4 9.61 4 19c0 13.75 17 31 17 31s17-17.25 17-31C38 9.61 30.39 2 21 2z" fill="#f97316"/>
        <circle cx="21" cy="19" r="10" fill="#fff7ed"/>
        <path d="M23.25 11.5a7.5 7.5 0 1 0 6.25 11.66A8.5 8.5 0 1 1 23.25 11.5z" fill="#9a3412"/>
      </g>
    </svg>
  `)}`,
  iconSize: [42, 54],
  iconAnchor: [21, 54],
  popupAnchor: [0, -42],
  shadowSize: [0, 0],
});

export const userLocationIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
      <circle cx="17" cy="17" r="15" fill="#2563eb" fill-opacity="0.18"/>
      <circle cx="17" cy="17" r="9" fill="#2563eb"/>
      <circle cx="17" cy="17" r="4" fill="#ffffff"/>
    </svg>
  `)}`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -12],
  shadowSize: [0, 0],
});

export const ambulanceMapIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="58" viewBox="0 0 46 58">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#7f1d1d" flood-opacity="0.28"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M23 2C12.507 2 4 10.507 4 21c0 15.356 19 34 19 34s19-18.644 19-34C42 10.507 33.493 2 23 2z" fill="#dc2626"/>
        <circle cx="23" cy="21" r="11" fill="#fff1f2"/>
        <path d="M15.5 23.5v-5.3c0-.663.537-1.2 1.2-1.2h2.2l1.7-3.1c.21-.383.612-.62 1.05-.62h4.7c.438 0 .84.237 1.05.62l1.7 3.1h1.2c1.215 0 2.2.985 2.2 2.2v4.3c0 .663-.537 1.2-1.2 1.2h-.8a2.4 2.4 0 0 1-4.8 0h-5.4a2.4 2.4 0 0 1-4.8 0h-.75c-.663 0-1.2-.537-1.2-1.2zm5.7-6.5-.9 1.7h7.4l-.9-1.7h-5.6zm.35 8.2a.95.95 0 1 0 0-1.9.95.95 0 0 0 0 1.9zm8.9 0a.95.95 0 1 0 0-1.9.95.95 0 0 0 0 1.9z" fill="#b91c1c"/>
        <path d="M22 16h2v2h2v2h-2v2h-2v-2h-2v-2h2z" fill="#dc2626"/>
      </g>
    </svg>
  `)}`,
  iconSize: [46, 58],
  iconAnchor: [23, 58],
  popupAnchor: [0, -45],
  shadowSize: [0, 0],
});

export const accommodationMapIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="58" viewBox="0 0 46 58">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#1e3a8a" flood-opacity="0.28"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M23 2C12.507 2 4 10.507 4 21c0 15.356 19 34 19 34s19-18.644 19-34C42 10.507 33.493 2 23 2z" fill="#2563eb"/>
        <circle cx="23" cy="21" r="11" fill="#eff6ff"/>
        <path d="M16.5 26V18.9c0-.497.403-.9.9-.9h11.2c.497 0 .9.403.9.9V26h-2.2v-4.1h-8.6V26h-2.2zm3-5.9h2.4v-2.2h-2.4v2.2zm5.1 0H27v-2.2h-2.4v2.2z" fill="#1d4ed8"/>
        <path d="M21.8 13h2.4v3h3v2.2h-3v3h-2.4v-3h-3V16h3z" fill="#2563eb"/>
      </g>
    </svg>
  `)}`,
  iconSize: [46, 58],
  iconAnchor: [23, 58],
  popupAnchor: [0, -45],
  shadowSize: [0, 0],
});
