export type AmbulanceVehicleType = 'standard' | 'icu' | 'medical-transport';

export type AmbulanceListing = {
  id: string;
  ownerName: string;
  phone: string;
  wilayaCode: string; // "16"
  communeId: string; // slug/id from `getCommunes`
  isFree: boolean;
  priceDescription?: string;
  vehicleType: AmbulanceVehicleType;
  isActive: boolean;
  /**
   * Optional: used later for “closest” computations.
   */
  latitude?: number;
  longitude?: number;
};

export const ambulanceListingsMock: AmbulanceListing[] = [
  {
    id: 'a-16-1',
    ownerName: 'Ambulance Al Amal',
    phone: '+213 555 210 016',
    wilayaCode: '16',
    communeId: 'alger-centre',
    isFree: false,
    priceDescription: 'حسب المسافة / حسب الحالة',
    vehicleType: 'standard',
    isActive: true,
    latitude: 36.7539,
    longitude: 3.0586,
  },
  {
    id: 'a-16-2',
    ownerName: 'ICU Ambulance — El Hayat',
    phone: '+213 555 220 016',
    wilayaCode: '16',
    communeId: 'bab-ezzouar',
    isFree: false,
    priceDescription: 'خدمة إنعاش (ICU) — 24/7',
    vehicleType: 'icu',
    isActive: true,
    latitude: 36.7167,
    longitude: 3.1833,
  },
  {
    id: 'a-31-1',
    ownerName: 'Oran Medical Transport',
    phone: '+213 555 210 031',
    wilayaCode: '31',
    communeId: 'oran',
    isFree: true,
    vehicleType: 'medical-transport',
    isActive: true,
    latitude: 35.6971,
    longitude: -0.6308,
  },
  {
    id: 'a-25-1',
    ownerName: 'Constantine Ambulance Service',
    phone: '+213 555 210 025',
    wilayaCode: '25',
    communeId: 'constantine',
    isFree: false,
    priceDescription: 'تنقل داخل الولاية وخارجها',
    vehicleType: 'standard',
    isActive: true,
    latitude: 36.2637,
    longitude: 6.6932,
  },
  {
    id: 'a-19-1',
    ownerName: 'Sétif Rapid Response',
    phone: '+213 555 210 019',
    wilayaCode: '19',
    communeId: 'setif',
    isFree: false,
    priceDescription: 'استجابة سريعة داخل المدينة',
    vehicleType: 'standard',
    isActive: true,
    latitude: 36.19,
    longitude: 5.41,
  },
];

