export type LanguageCode = 'ar' | 'fr' | 'en';

export type TranslatedText = {
  ar: string;
  fr: string;
  en: string;
};

export type ServiceItem = {
  id: string;
  icon_key:
    | 'heart'
    | 'home-care'
    | 'lab'
    | 'nurse'
    | 'rehab'
    | 'oxygen'
    | 'transport'
    | 'support';
  color_class: string; // legacy-compatible (gradient tokens)
  bg_class: string; // legacy-compatible
  sort_order: number;
  is_active: boolean;
  title: TranslatedText;
  description: TranslatedText;
  details: TranslatedText;
  features: TranslatedText[];
};

export type ServicesSectionContent = {
  section_title: TranslatedText;
  section_subtitle: TranslatedText;
};

export const servicesSectionMock: ServicesSectionContent = {
  section_title: {
    ar: 'الخدمات والمساعدات الصحية',
    fr: 'Services et aides de santé',
    en: 'Health services & support',
  },
  section_subtitle: {
    ar: 'خدمات عملية وموثوقة للبيت والمستشفى، مع توجيه واضح: اتصل أولاً لتأكيد التوفر والتكلفة ووقت التدخل.',
    fr: "Des services concrets à domicile et à l'hôpital, avec une règle simple: appelez d’abord pour confirmer la disponibilité, le coût et le délai.",
    en: 'Practical services for home and hospital, with one rule: call first to confirm availability, cost, and response time.',
  },
};

export const servicesMock: ServiceItem[] = [
  {
    id: 'srv-1',
    icon_key: 'home-care',
    color_class: 'from-emerald-500 to-green-600',
    bg_class: 'bg-emerald-50',
    sort_order: 10,
    is_active: true,
    title: {
      ar: 'رعاية منزلية',
      fr: 'Soins à domicile',
      en: 'Home care',
    },
    description: {
      ar: 'زيارة تمريضية، متابعة، قياس ضغط/سكر، ورعاية بعد العمليات داخل المنزل.',
      fr: 'Visite infirmière, suivi, tension/glycémie, soins post-opératoires à domicile.',
      en: 'Nursing visits, follow-up, vitals checks, and post-op care at home.',
    },
    details: {
      ar: 'هذا القسم يساعد العائلات على الحصول على رعاية منظمة في المنزل بدل التنقل المتكرر. اطلب الخدمة ثم اتصل للتأكيد (المناطق، الساعات، والأجهزة المتاحة).',
      fr: "Ce service aide les familles à organiser des soins à domicile au lieu des déplacements répétés. Demandez puis appelez pour confirmer (zones, horaires, matériel).",
      en: 'This helps families organize at-home care instead of repeated travel. Request then call to confirm (coverage, hours, equipment).',
    },
    features: [
      { ar: 'تنسيق سريع حسب الولاية/المدينة', fr: 'Coordination rapide par wilaya/ville', en: 'Fast coordination by region' },
      { ar: 'رعاية بعد العمليات والمتابعة', fr: 'Soins post-opératoires et suivi', en: 'Post-op care & follow-up' },
      { ar: 'توجيه واضح لما يلزم إحضاره', fr: 'Checklist claire du nécessaire', en: 'Clear “what to prepare” checklist' },
    ],
  },
  {
    id: 'srv-2',
    icon_key: 'lab',
    color_class: 'from-indigo-500 to-violet-600',
    bg_class: 'bg-indigo-50',
    sort_order: 20,
    is_active: true,
    title: {
      ar: 'تحاليل مخبرية (في المنزل)',
      fr: 'Analyses (à domicile)',
      en: 'Lab tests (at home)',
    },
    description: {
      ar: 'سحب عينات وتحاليل أساسية مع إرسال النتائج حسب الاتفاق.',
      fr: "Prélèvements et analyses courantes, avec envoi des résultats selon l'accord.",
      en: 'Sample collection and common tests, with results delivered as agreed.',
    },
    details: {
      ar: 'مفيد لكبار السن أو الحالات التي يصعب تنقلها. اتصل لتأكيد نوع التحاليل، الصيام، ووقت النتائج.',
      fr: "Idéal pour les personnes âgées ou les cas difficiles à déplacer. Appelez pour confirmer les analyses, le jeûne et le délai.",
      en: 'Great for seniors or limited mobility. Call to confirm test types, fasting requirements, and turnaround time.',
    },
    features: [
      { ar: 'مواعيد مرنة', fr: 'Horaires flexibles', en: 'Flexible scheduling' },
      { ar: 'تنبيه بالصيام إن لزم', fr: 'Rappel de jeûne si nécessaire', en: 'Fasting reminders when needed' },
      { ar: 'نتائج رقمية أو ورقية', fr: 'Résultats numériques ou papier', en: 'Digital or paper results' },
    ],
  },
  {
    id: 'srv-3',
    icon_key: 'nurse',
    color_class: 'from-sky-500 to-blue-600',
    bg_class: 'bg-sky-50',
    sort_order: 30,
    is_active: true,
    title: {
      ar: 'تمريض وحقن',
      fr: 'Infirmier & injections',
      en: 'Nursing & injections',
    },
    description: {
      ar: 'حقن، مصل، عناية بالجروح، ومتابعة بروتوكول العلاج.',
      fr: 'Injections, perfusion, soins de plaies, suivi du protocole.',
      en: 'Injections, IV, wound care, and protocol follow-up.',
    },
    details: {
      ar: 'الخدمة مصممة لتقليل الأخطاء وتحسين الالتزام بالعلاج. تأكد من الوصفة الطبية ووقت التوفر.',
      fr: "Conçue pour réduire les erreurs et améliorer l’adhérence au traitement. Confirmez l’ordonnance et la disponibilité.",
      en: 'Designed to reduce errors and improve adherence. Confirm prescription and availability by phone.',
    },
    features: [
      { ar: 'زيارات منزلية عند الحاجة', fr: 'Visites à domicile si besoin', en: 'Home visits when needed' },
      { ar: 'تنبيهات السلامة (حساسية/جرعات)', fr: 'Rappels sécurité (allergies/doses)', en: 'Safety checks (allergies/doses)' },
      { ar: 'متابعة مختصرة وسهلة', fr: 'Suivi simple et clair', en: 'Simple follow-up notes' },
    ],
  },
  {
    id: 'srv-4',
    icon_key: 'rehab',
    color_class: 'from-amber-500 to-orange-600',
    bg_class: 'bg-amber-50',
    sort_order: 40,
    is_active: true,
    title: {
      ar: 'علاج طبيعي وإعادة تأهيل',
      fr: 'Kiné & rééducation',
      en: 'Physio & rehab',
    },
    description: {
      ar: 'جلسات علاج طبيعي، تمارين موجهة، وتأهيل بعد إصابة أو عملية.',
      fr: 'Séances de kiné, exercices guidés, rééducation post-trauma ou post-op.',
      en: 'Physio sessions, guided exercises, and rehab after injury or surgery.',
    },
    details: {
      ar: 'هدفنا خطة واضحة قابلة للقياس. اتصل لتأكيد عدد الجلسات، المدة، وإمكانية الزيارة المنزلية.',
      fr: 'Objectif: un plan clair et mesurable. Appelez pour confirmer le nombre de séances, durée et visites à domicile.',
      en: 'Goal: a clear measurable plan. Call to confirm session count, duration, and home-visit options.',
    },
    features: [
      { ar: 'خطة تمارين مرفقة', fr: "Plan d'exercices", en: 'Exercise plan included' },
      { ar: 'متابعة تطور أسبوعية', fr: 'Suivi hebdomadaire', en: 'Weekly progress check' },
      { ar: 'إرشادات آمنة لتجنب الانتكاس', fr: 'Conseils anti-rechute', en: 'Relapse-prevention guidance' },
    ],
  },
  {
    id: 'srv-5',
    icon_key: 'oxygen',
    color_class: 'from-rose-500 to-red-600',
    bg_class: 'bg-rose-50',
    sort_order: 50,
    is_active: true,
    title: {
      ar: 'أكسجين ومعدات تنفس',
      fr: 'Oxygène & respiratoire',
      en: 'Oxygen & respiratory',
    },
    description: {
      ar: 'تأجير/توفير أكسجين، نيبولايزر، ومستلزمات متابعة التنفس.',
      fr: "Location/fourniture d’oxygène, nébuliseur et accessoires respiratoires.",
      en: 'Oxygen supply/rental, nebulizer, and respiratory accessories.',
    },
    details: {
      ar: 'للحالات الحساسة، الأهم هو السرعة والتأكد من الملحقات المناسبة. اتصل لتأكيد الكميات والتسليم.',
      fr: 'Pour les cas sensibles: vitesse + accessoires adaptés. Appelez pour confirmer quantités et livraison.',
      en: 'For sensitive cases: speed and correct accessories matter. Call to confirm quantities and delivery.',
    },
    features: [
      { ar: 'توصيل (حسب المنطقة)', fr: 'Livraison (selon zone)', en: 'Delivery (region-based)' },
      { ar: 'تعليمات الاستخدام والسلامة', fr: "Consignes d'utilisation", en: 'Usage & safety instructions' },
      { ar: 'بدائل عند نفاد المخزون', fr: 'Solutions de remplacement', en: 'Fallback options if out-of-stock' },
    ],
  },
  {
    id: 'srv-6',
    icon_key: 'transport',
    color_class: 'from-slate-600 to-slate-800',
    bg_class: 'bg-slate-50',
    sort_order: 60,
    is_active: true,
    title: {
      ar: 'نقل صحي غير استعجالي',
      fr: 'Transport médical',
      en: 'Medical transport',
    },
    description: {
      ar: 'نقل بين المنزل/المستشفى للحالات التي تحتاج مرافقة دون طوارئ.',
      fr: 'Transfert domicile/hôpital pour cas nécessitant assistance sans urgence.',
      en: 'Home/hospital transfers for cases needing assistance (non-emergency).',
    },
    details: {
      ar: 'الحل الأنسب للمواعيد والفحوصات. اتصل لتأكيد الوقت، التجهيزات، وهل النقل مجاني/مدفوع.',
      fr: 'Idéal pour rendez-vous et examens. Appelez pour confirmer horaire, équipement, et gratuit/payant.',
      en: 'Best for appointments and exams. Call to confirm timing, equipment, and free/paid.',
    },
    features: [
      { ar: 'حجز مسبق', fr: 'Réservation', en: 'Pre-booking' },
      { ar: 'وضوح في السعر', fr: 'Tarifs clairs', en: 'Transparent pricing' },
      { ar: 'خيار سيارة مجهزة', fr: 'Véhicule équipé', en: 'Equipped vehicle option' },
    ],
  },
  {
    id: 'srv-7',
    icon_key: 'support',
    color_class: 'from-fuchsia-500 to-pink-600',
    bg_class: 'bg-fuchsia-50',
    sort_order: 70,
    is_active: true,
    title: {
      ar: 'توجيه اجتماعي ومساعدات',
      fr: 'Orientation & aides sociales',
      en: 'Guidance & social support',
    },
    description: {
      ar: 'مرافقة المريض لفهم الخيارات: سكن، تبرعات، ملفات، وجهات دعم.',
      fr: 'Accompagnement: logement, dons, dossiers, organismes de soutien.',
      en: 'Patient guidance: housing, donations, paperwork, and support organizations.',
    },
    details: {
      ar: 'قيمة هذا القسم هي تقليل الضياع بين الجهات. اتصل بنا لنوجهك للخطوات العملية حسب حالتك.',
      fr: "La valeur: réduire la confusion entre organismes. Appelez pour des étapes concrètes selon votre cas.",
      en: 'Value: reduce confusion across organizations. Call us for concrete next steps for your case.',
    },
    features: [
      { ar: 'توجيه بخطوات واضحة', fr: 'Étapes claires', en: 'Clear step-by-step guidance' },
      { ar: 'ربط بالجهات المناسبة', fr: 'Mise en relation', en: 'Connect to the right orgs' },
      { ar: 'نصائح لتسريع الإجراءات', fr: 'Conseils pour accélérer', en: 'Tips to speed up processes' },
    ],
  },
];

export type SupplierItem = {
  id: string;
  categoryKey: string; // stable tag for admin filters later
  title: TranslatedText;
  type: TranslatedText;
  desc: TranslatedText;
  location: TranslatedText;
  phone: string;
  tone: 'blue' | 'purple' | 'emerald' | 'orange';
};

export const suppliersMock: SupplierItem[] = [
  {
    id: 'sup-1',
    categoryKey: 'heavy-equipment',
    title: { ar: 'مؤسسة الشفاء للتجهيزات', fr: 'Al-Chifaa Équipements', en: 'Al-Shifa Equipment' },
    type: { ar: 'معدات طبية ثقيلة', fr: 'Équipements lourds', en: 'Heavy medical equipment' },
    desc: {
      ar: 'تجهيز غرف العمليات والإنعاش بمعدات موثوقة مع دعم فني.',
      fr: 'Équipement de blocs et réanimation avec support technique.',
      en: 'Operating room and ICU equipment with technical support.',
    },
    location: { ar: 'الجزائر العاصمة', fr: 'Alger', en: 'Algiers' },
    phone: '021 55 44 33',
    tone: 'blue',
  },
  {
    id: 'sup-2',
    categoryKey: 'lab',
    title: { ar: 'تكنو لاب', fr: 'TechnoLab', en: 'TechnoLab' },
    type: { ar: 'تجهيزات مخبرية', fr: 'Équipement de laboratoire', en: 'Lab equipment' },
    desc: {
      ar: 'أجهزة وكواشف للمخابر الطبية مع خيارات توريد مرنة.',
      fr: 'Appareils et réactifs avec options de fourniture flexibles.',
      en: 'Devices and reagents with flexible supply options.',
    },
    location: { ar: 'وهران', fr: 'Oran', en: 'Oran' },
    phone: '041 33 22 11',
    tone: 'purple',
  },
  {
    id: 'sup-3',
    categoryKey: 'consumables',
    title: { ar: 'بيو ميديكال', fr: 'BioMedical', en: 'BioMedical' },
    type: { ar: 'مستهلكات طبية', fr: 'Consommables', en: 'Consumables' },
    desc: {
      ar: 'توريد حقن وقفازات وضمادات للعيادات والمؤسسات.',
      fr: 'Fourniture: seringues, gants et pansements.',
      en: 'Supply: syringes, gloves, and dressings.',
    },
    location: { ar: 'قسنطينة', fr: 'Constantine', en: 'Constantine' },
    phone: '031 66 77 88',
    tone: 'emerald',
  },
  {
    id: 'sup-4',
    categoryKey: 'prosthetics',
    title: { ar: 'الأمل للأطراف الصناعية', fr: 'Al-Amal Prothèses', en: 'Al-Amal Prosthetics' },
    type: { ar: 'أجهزة تعويضية', fr: 'Prothèses', en: 'Prosthetics' },
    desc: {
      ar: 'تصنيع وتركيب أطراف صناعية ومعدات حركية حسب الحاجة.',
      fr: 'Fabrication et adaptation de prothèses et aides à la mobilité.',
      en: 'Custom prosthetics and mobility aids.',
    },
    location: { ar: 'سطيف', fr: 'Sétif', en: 'Setif' },
    phone: '036 99 88 77',
    tone: 'orange',
  },
];

export type ExhibitionRegion = 'algeria' | 'arab' | 'world';

export type ExhibitionItem = {
  id: string;
  region: ExhibitionRegion;
  title: TranslatedText;
  date: TranslatedText;
  location: TranslatedText;
  desc: TranslatedText;
};

export const exhibitionsMock: ExhibitionItem[] = [
  {
    id: 'evt-1',
    region: 'algeria',
    title: { ar: 'الصالون الدولي للصحة (SIPHAL)', fr: 'Salon SIPHAL', en: 'SIPHAL Expo' },
    date: { ar: '15-18 فيفري 2026', fr: '15-18 fév 2026', en: 'Feb 15–18, 2026' },
    location: { ar: 'قصر المعارض، الجزائر العاصمة', fr: 'Palais des expositions, Alger', en: 'Palace of Exhibitions, Algiers' },
    desc: {
      ar: 'ملتقى سنوي لمهنيي الصيدلة وشبه الصيدلة يجمع المصنعين والموزعين.',
      fr: 'Rendez-vous annuel pharma & para-pharma: fabricants et distributeurs.',
      en: 'Annual pharma/para-pharma gathering: manufacturers and distributors.',
    },
  },
  {
    id: 'evt-2',
    region: 'algeria',
    title: { ar: 'معرض SIMEM', fr: 'SIMEM', en: 'SIMEM' },
    date: { ar: '10-13 أفريل 2026', fr: '10-13 avr 2026', en: 'Apr 10–13, 2026' },
    location: { ar: 'مركز الاتفاقيات، وهران', fr: 'Centre des congrès, Oran', en: 'Convention Center, Oran' },
    desc: {
      ar: 'معرض متخصص في التجهيزات الطبية والاستشفائية ومعدات المخابر.',
      fr: 'Exposition: équipements médicaux, hospitaliers et laboratoires.',
      en: 'Expo: medical, hospital, and lab equipment.',
    },
  },
  {
    id: 'evt-3',
    region: 'arab',
    title: { ar: 'Arab Health', fr: 'Arab Health', en: 'Arab Health' },
    date: { ar: '27-30 جانفي 2026', fr: '27-30 jan 2026', en: 'Jan 27–30, 2026' },
    location: { ar: 'دبي، الإمارات', fr: 'Dubaï, EAU', en: 'Dubai, UAE' },
    desc: {
      ar: 'أكبر حدث للرعاية الصحية في الشرق الأوسط وشمال أفريقيا.',
      fr: 'Le plus grand événement santé MENA.',
      en: 'Largest healthcare event in MENA.',
    },
  },
  {
    id: 'evt-4',
    region: 'arab',
    title: { ar: 'المؤتمر الطبي السعودي الدولي', fr: 'Congrès médical saoudien', en: 'Saudi International Medical Conference' },
    date: { ar: '15-17 مارس 2026', fr: '15-17 mars 2026', en: 'Mar 15–17, 2026' },
    location: { ar: 'الرياض، السعودية', fr: 'Riyad, Arabie saoudite', en: 'Riyadh, Saudi Arabia' },
    desc: {
      ar: 'منصة لعرض الابتكار في الصحة الرقمية والذكاء الاصطناعي في الطب.',
      fr: "Plateforme d'innovation: santé digitale et IA médicale.",
      en: 'Innovation platform: digital health and medical AI.',
    },
  },
  {
    id: 'evt-5',
    region: 'world',
    title: { ar: 'MEDICA', fr: 'MEDICA', en: 'MEDICA' },
    date: { ar: '11-14 نوفمبر 2026', fr: '11-14 nov 2026', en: 'Nov 11–14, 2026' },
    location: { ar: 'دوسلدورف، ألمانيا', fr: 'Düsseldorf, Allemagne', en: 'Düsseldorf, Germany' },
    desc: {
      ar: 'المعرض التجاري الرائد عالمياً للتكنولوجيا الطبية.',
      fr: 'Le salon mondial de référence des technologies médicales.',
      en: 'Global leading trade fair for medical technology.',
    },
  },
  {
    id: 'evt-6',
    region: 'world',
    title: { ar: 'FIME', fr: 'FIME', en: 'FIME' },
    date: { ar: '23-25 جوان 2026', fr: '23-25 juin 2026', en: 'Jun 23–25, 2026' },
    location: { ar: 'ميامي، الولايات المتحدة', fr: 'Miami, États-Unis', en: 'Miami, USA' },
    desc: {
      ar: 'أكبر معرض للأجهزة والمعدات الطبية في الأمريكيتين.',
      fr: 'Grand salon dispositifs médicaux des Amériques.',
      en: 'Largest medical device trade show in the Americas.',
    },
  },
];

