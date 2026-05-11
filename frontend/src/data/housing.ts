export type HousingType = 'volunteer-home' | 'association' | 'guesthouse';

export type HousingListing = {
  id: string;
  title: string;
  hostName: string;
  phone: string;
  wilayaCode: string; // "16"
  communeId: string;
  address?: string;
  housingType: HousingType;
  capacity: number; // people
  isFree: boolean;
  pricePerNightDzd?: number;
  description?: string;
  /**
   * Trust/safety flags – UI-only now, enforced by admin later.
   */
  isVerified: boolean;
  acceptsCompanion: boolean;
  suitableForLongStay: boolean;
  isActive: boolean;
  latitude?: number;
  longitude?: number;
};

export const housingListingsMock: HousingListing[] = [
  {
    id: 'h-16-1',
    title: 'بيت إيواء للمرضى ومرافقيهم',
    hostName: 'جمعية الدعم الصحي',
    phone: '+213 555 310 016',
    wilayaCode: '16',
    communeId: 'alger-centre',
    address: 'قرب محطة المترو',
    housingType: 'association',
    capacity: 4,
    isFree: true,
    description: 'إيواء مؤقت للحالات القادمة للعلاج. الأولوية للحالات الاستعجالية.',
    isVerified: true,
    acceptsCompanion: true,
    suitableForLongStay: false,
    isActive: true,
    latitude: 36.7539,
    longitude: 3.0586,
  },
  {
    id: 'h-16-2',
    title: 'سكن مرافقين (قريب من المستشفى)',
    hostName: 'متطوعون — عائلة كريمة',
    phone: '+213 555 320 016',
    wilayaCode: '16',
    communeId: 'bab-ezzouar',
    housingType: 'volunteer-home',
    capacity: 2,
    isFree: true,
    description: 'مكان بسيط ونظيف لمرافقي المرضى. يرجى الاتصال قبل القدوم.',
    isVerified: false,
    acceptsCompanion: true,
    suitableForLongStay: true,
    isActive: true,
    latitude: 36.7167,
    longitude: 3.1833,
  },
  {
    id: 'h-31-1',
    title: 'نُزُل مخصص للمرضى',
    hostName: 'دار الضيافة — وهران',
    phone: '+213 555 310 031',
    wilayaCode: '31',
    communeId: 'oran',
    housingType: 'guesthouse',
    capacity: 6,
    isFree: false,
    pricePerNightDzd: 2500,
    description: 'أسعار مخفضة للمرضى القادمين من ولايات بعيدة.',
    isVerified: true,
    acceptsCompanion: true,
    suitableForLongStay: true,
    isActive: true,
    latitude: 35.6971,
    longitude: -0.6308,
  },
  {
    id: 'h-25-1',
    title: 'إيواء قريب من مركز العلاج',
    hostName: 'نادي خيري محلي',
    phone: '+213 555 310 025',
    wilayaCode: '25',
    communeId: 'constantine',
    housingType: 'association',
    capacity: 3,
    isFree: true,
    description: 'يتم التنسيق عبر الهاتف حسب القدرة الاستيعابية.',
    isVerified: true,
    acceptsCompanion: false,
    suitableForLongStay: false,
    isActive: true,
    latitude: 36.365,
    longitude: 6.6147,
  },
];

