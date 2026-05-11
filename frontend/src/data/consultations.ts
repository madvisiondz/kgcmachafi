export type ConsultationSpecialty = {
  id: string;
  key: string;
  iconEmoji: string;
  colorClass: string; // tailwind gradient
};

export type ConsultationDoctor = {
  id: string;
  name: string;
  specialtyKey: string;
  wilayaCode: string; // "16"
  communeId: string;
  clinicName?: string;
  experienceYears: number;
  rating: number; // 0..5
  price: number;
  currency: string;
  phone: string;
  supportsRemote: boolean;
  supportsInPerson: boolean;
  isVerified: boolean;
  isActive: boolean;
};

export const consultationSpecialtiesMock: ConsultationSpecialty[] = [
  { id: 'sp-1', key: 'general', iconEmoji: '🩺', colorClass: 'from-emerald-500 to-green-600' },
  { id: 'sp-2', key: 'cardiology', iconEmoji: '❤️', colorClass: 'from-rose-500 to-red-600' },
  { id: 'sp-3', key: 'dermatology', iconEmoji: '🧴', colorClass: 'from-indigo-500 to-violet-600' },
  { id: 'sp-4', key: 'pediatrics', iconEmoji: '🧒', colorClass: 'from-sky-500 to-blue-600' },
  { id: 'sp-5', key: 'psychology', iconEmoji: '🧠', colorClass: 'from-amber-500 to-orange-600' },
];

export const consultationDoctorsMock: ConsultationDoctor[] = [
  {
    id: 'dr-16-1',
    name: 'Dr. Samira B.',
    specialtyKey: 'cardiology',
    wilayaCode: '16',
    communeId: 'alger-centre',
    clinicName: 'Clinique El Amal',
    experienceYears: 10,
    rating: 4.7,
    price: 2500,
    currency: 'DZD',
    phone: '+213 555 401 016',
    supportsRemote: true,
    supportsInPerson: true,
    isVerified: true,
    isActive: true,
  },
  {
    id: 'dr-16-2',
    name: 'Dr. Karim N.',
    specialtyKey: 'dermatology',
    wilayaCode: '16',
    communeId: 'bab-ezzouar',
    clinicName: 'Cabinet privé',
    experienceYears: 7,
    rating: 4.4,
    price: 2000,
    currency: 'DZD',
    phone: '+213 555 402 016',
    supportsRemote: true,
    supportsInPerson: false,
    isVerified: false,
    isActive: true,
  },
  {
    id: 'dr-31-1',
    name: 'Dr. Lina H.',
    specialtyKey: 'pediatrics',
    wilayaCode: '31',
    communeId: 'oran',
    clinicName: 'Cabinet pédiatrie',
    experienceYears: 12,
    rating: 4.6,
    price: 2200,
    currency: 'DZD',
    phone: '+213 555 401 031',
    supportsRemote: false,
    supportsInPerson: true,
    isVerified: true,
    isActive: true,
  },
  {
    id: 'dr-25-1',
    name: 'Dr. Nadia A.',
    specialtyKey: 'general',
    wilayaCode: '25',
    communeId: 'constantine',
    clinicName: 'Médecine générale',
    experienceYears: 6,
    rating: 4.2,
    price: 1500,
    currency: 'DZD',
    phone: '+213 555 401 025',
    supportsRemote: true,
    supportsInPerson: true,
    isVerified: false,
    isActive: true,
  },
  {
    id: 'dr-19-1',
    name: 'Dr. Yacine S.',
    specialtyKey: 'psychology',
    wilayaCode: '19',
    communeId: 'setif',
    clinicName: 'Cabinet psychologue',
    experienceYears: 9,
    rating: 4.5,
    price: 3000,
    currency: 'DZD',
    phone: '+213 555 401 019',
    supportsRemote: true,
    supportsInPerson: true,
    isVerified: true,
    isActive: true,
  },
];

