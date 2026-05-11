export const INTERNATIONAL_HOSPITAL_COUNTRIES = [
  { value: 'turkey', label: 'تركيا' },
  { value: 'tunisia', label: 'تونس' },
  { value: 'france', label: 'فرنسا' },
  { value: 'germany', label: 'ألمانيا' },
  { value: 'jordan', label: 'الأردن' },
  { value: 'egypt', label: 'مصر' },
  { value: 'saudi-arabia', label: 'السعودية' },
  { value: 'uae', label: 'الإمارات' },
  { value: 'spain', label: 'إسبانيا' },
  { value: 'india', label: 'الهند' },
];

export const INTERNATIONAL_HOSPITAL_SPECIALTIES = [
  { value: 'oncology', label: 'الأورام' },
  { value: 'cardiology', label: 'القلب' },
  { value: 'neurology', label: 'المخ والأعصاب' },
  { value: 'transplants', label: 'زراعة الأعضاء' },
  { value: 'fertility', label: 'الخصوبة' },
  { value: 'orthopedics', label: 'العظام والمفاصل' },
  { value: 'ophthalmology', label: 'طب العيون' },
  { value: 'rehabilitation', label: 'التأهيل الطبي' },
  { value: 'pediatrics', label: 'طب الأطفال' },
  { value: 'neurosurgery', label: 'جراحة الأعصاب' },
];

export const getInternationalHospitalCountryLabel = (country) =>
  INTERNATIONAL_HOSPITAL_COUNTRIES.find((item) => item.value === country)?.label || country;

export const getInternationalHospitalSpecialtyLabel = (specialty) =>
  INTERNATIONAL_HOSPITAL_SPECIALTIES.find((item) => item.value === specialty)?.label || specialty;