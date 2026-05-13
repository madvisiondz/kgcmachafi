export type Pharmacy = {
  id: string;
  name: string;
  wilayaCode: string; // "16"
  wilayaNameAr: string;
  wilayaNameFr: string;
  cityAr: string;
  cityFr: string;
  addressAr?: string;
  addressFr?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  /**
   * "static" = part of the long-lived directory (80%).
   * "dynamic" = promoted through schedules/rotation (20%).
   */
  source: 'static' | 'dynamic';
  /** When set (e.g. from PHP `is_night_duty`), overrides mock-only night schedule for chips / filter. */
  isNightDuty?: boolean;
};

export const pharmaciesDirectoryMock: Pharmacy[] = [
  // Algiers (16)
  {
    id: 'p-16-1',
    name: 'Pharmacie El Amal',
    wilayaCode: '16',
    wilayaNameAr: 'الجزائر',
    wilayaNameFr: 'Alger',
    cityAr: 'سيدي أمحمد',
    cityFr: 'Sidi M’Hamed',
    addressAr: 'شارع بشير عطار، سيدي أمحمد',
    addressFr: 'Rue Bachir Attar, Sidi M’Hamed',
    phone: '+213 555 010 016',
    latitude: 36.7539,
    longitude: 3.0586,
    source: 'static',
  },
  {
    id: 'p-16-2',
    name: 'Pharmacie El Hayat',
    wilayaCode: '16',
    wilayaNameAr: 'الجزائر',
    wilayaNameFr: 'Alger',
    cityAr: 'باب الزوار',
    cityFr: 'Bab Ezzouar',
    addressAr: 'قرب المحطة، باب الزوار',
    addressFr: 'Près de la station, Bab Ezzouar',
    phone: '+213 555 020 016',
    latitude: 36.7167,
    longitude: 3.1833,
    source: 'static',
  },

  // Oran (31)
  {
    id: 'p-31-1',
    name: 'Pharmacie El Baraka',
    wilayaCode: '31',
    wilayaNameAr: 'وهران',
    wilayaNameFr: 'Oran',
    cityAr: 'وهران',
    cityFr: 'Oran',
    addressAr: 'حي السلام، وهران',
    addressFr: 'Hai Essalem, Oran',
    phone: '+213 555 010 031',
    latitude: 35.6971,
    longitude: -0.6308,
    source: 'static',
  },

  // Constantine (25)
  {
    id: 'p-25-1',
    name: 'Pharmacie Ennasr',
    wilayaCode: '25',
    wilayaNameAr: 'قسنطينة',
    wilayaNameFr: 'Constantine',
    cityAr: 'الخروب',
    cityFr: 'El Khroub',
    addressAr: 'وسط المدينة، الخروب',
    addressFr: 'Centre-ville, El Khroub',
    phone: '+213 555 010 025',
    latitude: 36.2637,
    longitude: 6.6932,
    source: 'static',
  },

  // Setif (19)
  {
    id: 'p-19-1',
    name: 'Pharmacie El Shifa',
    wilayaCode: '19',
    wilayaNameAr: 'سطيف',
    wilayaNameFr: 'Sétif',
    cityAr: 'سطيف',
    cityFr: 'Sétif',
    addressAr: 'شارع الاستقلال، سطيف',
    addressFr: "Rue de l'Indépendance, Sétif",
    phone: '+213 555 010 019',
    latitude: 36.19,
    longitude: 5.41,
    source: 'static',
  },

  // A few extra entries to make the UI feel like a real directory.
  {
    id: 'p-7-1',
    name: 'Pharmacie El Wifak',
    wilayaCode: '07',
    wilayaNameAr: 'بسكرة',
    wilayaNameFr: 'Biskra',
    cityAr: 'بسكرة',
    cityFr: 'Biskra',
    phone: '+213 555 010 007',
    source: 'static',
  },
  {
    id: 'p-42-1',
    name: 'Pharmacie El Izdihar',
    wilayaCode: '42',
    wilayaNameAr: 'تيبازة',
    wilayaNameFr: 'Tipaza',
    cityAr: 'شرشال',
    cityFr: 'Cherchell',
    phone: '+213 555 010 042',
    source: 'static',
  },
  {
    id: 'p-23-1',
    name: 'Pharmacie Ibn Sina',
    wilayaCode: '23',
    wilayaNameAr: 'عنابة',
    wilayaNameFr: 'Annaba',
    cityAr: 'عنابة',
    cityFr: 'Annaba',
    phone: '+213 555 010 023',
    source: 'static',
  },
  {
    id: 'p-9-1',
    name: 'Pharmacie El Nour',
    wilayaCode: '09',
    wilayaNameAr: 'البليدة',
    wilayaNameFr: 'Blida',
    cityAr: 'البليدة',
    cityFr: 'Blida',
    phone: '+213 555 010 009',
    source: 'static',
  },
];

/**
 * Night-shift is the "dynamic 20%": it changes weekly.
 *
 * We model it as a weekly schedule that "promotes" some pharmacies as on-duty.
 * In a real backend, this will be an API dataset with `weekStart` + assignments.
 */
export const nightShiftScheduleMock: Record<
  string, // weekStart ISO (YYYY-MM-DD) for Monday
  {
    nightDutyIds: string[];
  }
> = {
  '2026-04-27': {
    nightDutyIds: ['p-16-1', 'p-31-1', 'p-19-1'],
  },
  '2026-05-04': {
    nightDutyIds: ['p-16-2', 'p-25-1', 'p-23-1'],
  },
};

export function getWeekStartIso(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun,1=Mon,...6=Sat
  const diffToMonday = (day + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  return d.toISOString().slice(0, 10);
}

