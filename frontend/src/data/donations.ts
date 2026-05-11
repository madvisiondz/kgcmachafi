export type TranslatedText = { ar: string; fr: string; en: string };

export type CurrencyCode = 'EUR' | 'DZD' | 'USD';

export type CurrencyConfig = {
  code: CurrencyCode;
  label: TranslatedText;
  symbol: string;
  presets: number[];
  subPresets: number[];
  max: number;
  step: number;
};

export const currenciesMock: Record<CurrencyCode, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    label: { ar: 'يورو', fr: 'Euro', en: 'Euro' },
    symbol: '€',
    presets: [10, 20, 50, 100],
    subPresets: [5, 10, 20],
    max: 500,
    step: 5,
  },
  DZD: {
    code: 'DZD',
    label: { ar: 'دينار جزائري', fr: 'Dinar algérien', en: 'Algerian dinar' },
    symbol: 'د.ج',
    presets: [1000, 2000, 5000, 10000],
    subPresets: [500, 1000, 2000],
    max: 50000,
    step: 500,
  },
  USD: {
    code: 'USD',
    label: { ar: 'دولار أمريكي', fr: 'Dollar US', en: 'US dollar' },
    symbol: '$',
    presets: [10, 25, 50, 100],
    subPresets: [5, 10, 20],
    max: 500,
    step: 5,
  },
};

export type DonationStats = {
  helpedLabel: TranslatedText;
  helpedValue: string;
  totalLabel: TranslatedText;
  totalValueEur: string;
  donorsLabel: TranslatedText;
  donorsValue: string;
  successLabel: TranslatedText;
  successValue: string;
};

export const donationStatsMock: DonationStats = {
  helpedLabel: { ar: 'حالة تم مساعدتها', fr: 'Cas aidés', en: 'Cases helped' },
  helpedValue: '1,234',
  totalLabel: { ar: 'إجمالي التبرعات', fr: 'Total des dons', en: 'Total donations' },
  totalValueEur: '25,000',
  donorsLabel: { ar: 'متبرع نشط', fr: 'Donateurs actifs', en: 'Active donors' },
  donorsValue: '5,678',
  successLabel: { ar: 'معدل النجاح', fr: 'Taux de réussite', en: 'Success rate' },
  successValue: '94%',
};

export type DonationCampaign = {
  id: string;
  title: TranslatedText;
  description: TranslatedText;
  raisedEur: number;
  goalEur: number;
  donors: number;
  theme: 'red' | 'purple' | 'blue';
};

export const campaignsMock: DonationCampaign[] = [
  {
    id: 'cmp-1',
    title: {
      ar: 'علاج طفلة تعاني من مرض القلب',
      fr: 'Opération cardiaque urgente (enfant)',
      en: 'Urgent heart surgery (child)',
    },
    description: {
      ar: 'تحتاج لعملية جراحية عاجلة. نغطي الفحوصات، الإقامة، وتكاليف التدخل حسب الملف الطبي.',
      fr: "Intervention urgente. Couverture: examens, séjour, coûts selon dossier médical.",
      en: 'Urgent procedure. Coverage: tests, stay, and intervention costs based on medical file.',
    },
    raisedEur: 4500,
    goalEur: 8000,
    donors: 156,
    theme: 'red',
  },
  {
    id: 'cmp-2',
    title: {
      ar: 'توفير أدوية لمرضى السرطان',
      fr: 'Médicaments pour patients cancéreux',
      en: 'Cancer medication support',
    },
    description: {
      ar: 'مساعدة المرضى العاجزين عن توفير الأدوية الأساسية والمتابعة.',
      fr: "Aider les patients à obtenir les médicaments essentiels et le suivi.",
      en: 'Help patients access essential medication and follow-up.',
    },
    raisedEur: 3200,
    goalEur: 5000,
    donors: 98,
    theme: 'purple',
  },
  {
    id: 'cmp-3',
    title: {
      ar: 'جهاز غسيل كلى لمركز صحي',
      fr: 'Appareil de dialyse pour centre',
      en: 'Dialysis machine for a clinic',
    },
    description: {
      ar: 'توفير جهاز حديث لتحسين جودة العلاج وتقليل الضغط على المستشفيات.',
      fr: "Financer un appareil moderne pour améliorer les soins et réduire la pression.",
      en: 'Fund a modern device to improve care and reduce hospital pressure.',
    },
    raisedEur: 6500,
    goalEur: 10000,
    donors: 234,
    theme: 'blue',
  },
];

export type DonationsSectionContent = {
  title: TranslatedText;
  subtitle: TranslatedText;
};

export const donationsSectionMock: DonationsSectionContent = {
  title: {
    ar: 'باب التبرعات والاشتراكات والدعم',
    fr: 'Dons, abonnements et soutien',
    en: 'Donations, subscriptions & support',
  },
  subtitle: {
    ar: 'ساهم معنا في تغيير حياة المرضى وصناعة الأمل — بشفافية وخطوات واضحة.',
    fr: "Aidez à changer des vies — avec transparence et des étapes claires.",
    en: 'Help change lives — with transparency and clear steps.',
  },
};

