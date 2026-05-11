export type HospitalType = 'public' | 'private' | 'clinic' | 'specialized';

export type HospitalFeature =
  | 'emergency'
  | 'icu'
  | 'online_consult'
  | 'direct_booking'
  | 'insurance'
  | 'card_payment';

export type HospitalListing = {
  id: string;
  name: string;
  wilayaCode: string; // "16"
  communeId: string; // from `getCommunes`
  address?: string;
  phone?: string;
  website?: string;
  type: HospitalType;
  specialtyTags: string[]; // i18n keys later; for now plain tags
  hoursLabel?: string; // "24/7" or "08:00–16:00"
  isVerified: boolean;
  rating?: number; // 0..5
  reviewsCount?: number;
  features: HospitalFeature[];
  latitude?: number;
  longitude?: number;
  isActive: boolean;
};

export type InternationalHospitalListing = {
  id: string;
  name: string;
  countryKey: string; // e.g. "turkey"
  specialtyKey: string; // e.g. "oncology"
  city?: string;
  phone?: string;
  website?: string;
  isVerified: boolean;
  rating?: number;
  reviewsCount?: number;
  features: HospitalFeature[];
  isActive: boolean;
};

export const hospitalsAlgeriaMock: HospitalListing[] = [
  {
    id: 'hos-16-1',
    name: 'CHU Mustapha Pacha',
    wilayaCode: '16',
    communeId: 'alger-centre',
    address: 'Alger Centre',
    phone: '+213 555 111 016',
    type: 'public',
    specialtyTags: ['cardiology', 'oncology', 'emergency'],
    hoursLabel: '24/7',
    isVerified: true,
    rating: 4.2,
    reviewsCount: 320,
    features: ['emergency', 'icu', 'insurance'],
    latitude: 36.7675,
    longitude: 3.0536,
    isActive: true,
  },
  {
    id: 'hos-16-2',
    name: 'Clinique El Hayat',
    wilayaCode: '16',
    communeId: 'bab-ezzouar',
    address: 'Bab Ezzouar',
    phone: '+213 555 222 016',
    type: 'private',
    specialtyTags: ['imaging', 'surgery'],
    hoursLabel: '08:00–20:00',
    isVerified: false,
    rating: 4.0,
    reviewsCount: 88,
    features: ['card_payment', 'online_consult'],
    latitude: 36.7167,
    longitude: 3.1833,
    isActive: true,
  },
  {
    id: 'hos-31-1',
    name: 'EHU 1er Novembre — Oran',
    wilayaCode: '31',
    communeId: 'oran',
    address: 'Oran',
    phone: '+213 555 111 031',
    type: 'public',
    specialtyTags: ['pediatrics', 'emergency'],
    hoursLabel: '24/7',
    isVerified: true,
    rating: 4.1,
    reviewsCount: 210,
    features: ['emergency', 'icu', 'insurance'],
    latitude: 35.6971,
    longitude: -0.6308,
    isActive: true,
  },
  {
    id: 'hos-25-1',
    name: 'CHU Constantine',
    wilayaCode: '25',
    communeId: 'constantine',
    address: 'Constantine',
    phone: '+213 555 111 025',
    type: 'public',
    specialtyTags: ['neurology', 'emergency'],
    hoursLabel: '24/7',
    isVerified: false,
    rating: 3.8,
    reviewsCount: 150,
    features: ['emergency', 'insurance'],
    latitude: 36.365,
    longitude: 6.6147,
    isActive: true,
  },
];

export const hospitalsInternationalMock: InternationalHospitalListing[] = [
  {
    id: 'ih-1',
    name: 'Istanbul Oncology Center',
    countryKey: 'turkey',
    specialtyKey: 'oncology',
    city: 'Istanbul',
    phone: '+90 555 000 111',
    website: 'example.com',
    isVerified: true,
    rating: 4.6,
    reviewsCount: 540,
    features: ['online_consult', 'direct_booking', 'card_payment'],
    isActive: true,
  },
  {
    id: 'ih-2',
    name: 'Tunis Cardiology Clinic',
    countryKey: 'tunisia',
    specialtyKey: 'cardiology',
    city: 'Tunis',
    phone: '+216 55 000 222',
    isVerified: false,
    rating: 4.3,
    reviewsCount: 120,
    features: ['direct_booking', 'card_payment'],
    isActive: true,
  },
];

