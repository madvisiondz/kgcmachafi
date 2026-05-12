import type { TvEdition } from '../routes/paths';

export type { TvEdition };

export type TvTopicId = 'health' | 'policy' | 'research' | 'community';

export interface TvLocalized {
  ar: string;
  fr: string;
  en: string;
}

export interface TvStory {
  slug: string;
  topic: TvTopicId;
  kicker: TvLocalized;
  title: TvLocalized;
  dek: TvLocalized;
  byline: TvLocalized;
  publishedAt: string;
  readingMinutes: number;
  heroTone: 'red' | 'amber' | 'emerald' | 'slate';
  breaking?: boolean;
  /** Optional multi-paragraph body; use `\n\n` between paragraphs. */
  body?: TvLocalized;
}

export interface TvWireLine {
  id: string;
  time: string;
  label: TvLocalized;
  body: TvLocalized;
  urgent?: boolean;
}

export interface TvScheduleSlot {
  id: string;
  start: string;
  end: string;
  title: TvLocalized;
  isLive?: boolean;
}

/** Edition-specific breaking ticker lines (separate editorial voice per tree). */
export const tvBreakingLines: Record<TvEdition, string[]> = {
  ar: [
    'تحديث: وزارة الصحة تنشر إرشادات موسمية جديدة',
    'مباشر: تغطية خاصة — ندوة الصحة العامة ١٤:٠٠',
    'عاجل: حملة تطعيم موسعة في عدة ولايات',
  ],
  fr: [
    'FLASH — Nouvelles recommandations saisonnières du ministère de la Santé',
    'EN DIRECT — Table ronde santé publique à 14h00',
    'URGENT — Campagne de vaccination élargie dans plusieurs wilayas',
  ],
  en: [
    'BREAKING — Ministry issues updated seasonal health guidance',
    'LIVE NOW — Public health roundtable at 14:00',
    'URGENT — Expanded vaccination drive across multiple wilayas',
  ],
};

const stories: TvStory[] = [
  {
    slug: 'hospital-capacity-winter-plan',
    topic: 'policy',
    kicker: { ar: 'سياسة صحية', fr: 'Politique', en: 'Policy' },
    title: {
      ar: 'خطة طوارئ الشتاء: أسرة العناية والتنسيق بين المستشفيات',
      fr: 'Plan hivernal: lits de réanimation et coordination hospitalière',
      en: 'Winter surge plan: ICU beds and hospital coordination',
    },
    dek: {
      ar: 'ملخص للقرار: أولويات القبول، خطوط الإحالة، ورسائل للعائلات.',
      fr: 'Synthèse des priorités d’admission, filières d’orientation et messages aux familles.',
      en: 'Admission priorities, referral pathways, and family-facing guidance in one place.',
    },
    byline: { ar: 'مكتب التحرير — سياسة', fr: 'Rédaction — Politique', en: 'Desk — Policy' },
    publishedAt: '2026-05-11',
    readingMinutes: 6,
    heroTone: 'red',
    breaking: true,
    body: {
      ar: 'في هذا الملف نلخص قرارات التنسيق بين المستشفيات العمومية وشبكات العناية المركزة.\n\nنؤكد أن الأرقام المعروضة رسمية إلى حين تحديث الوزارة. أي تصحيح يُنشر في شريط «آخر المستجدات».\n\nللطوارئ الطبية، اتصل بخدمات الإسعاف المحلية—لا تنتظر رداً عبر الموقع.',
      fr: 'Ce dossier résume les décisions de coordination entre hôpitaux publics et réseaux de réanimation.\n\nLes chiffres affichés sont officiels jusqu’à mise à jour du ministère. Toute correction apparaîtra dans le fil « dernières nouvelles ».\n\nEn urgence médicale, contactez les secours locaux—n’attendez pas une réponse via le site.',
      en: 'This file summarizes coordination decisions between public hospitals and critical-care networks.\n\nFigures shown are official until the ministry publishes an update. Corrections will appear in the “latest updates” wire.\n\nFor medical emergencies, call local emergency services—do not wait for a response through this site.',
    },
  },
  {
    slug: 'nutrition-guidelines-2026',
    topic: 'health',
    kicker: { ar: 'صحة عامة', fr: 'Santé publique', en: 'Public health' },
    title: {
      ar: 'دليل التغذية الموسمي: ما يتغير للعائلات وللأطفال',
      fr: 'Guide nutrition saisonnier: ce qui change pour familles et enfants',
      en: 'Seasonal nutrition guide: what changes for families and children',
    },
    dek: {
      ar: 'جداول بسيطة، علامات تحذير، وروابط إلى برامج التوعية.',
      fr: 'Tableaux simples, signaux d’alerte et liens vers programmes de sensibilisation.',
      en: 'Simple tables, warning signs, and links to awareness programmes.',
    },
    byline: { ar: 'د. ليلى بن عمر', fr: 'Dr Leïla Ben Omar', en: 'Dr Leïla Ben Omar' },
    publishedAt: '2026-05-10',
    readingMinutes: 5,
    heroTone: 'emerald',
  },
  {
    slug: 'clinical-trial-readout-cardiology',
    topic: 'research',
    kicker: { ar: 'أبحاث', fr: 'Recherche', en: 'Research' },
    title: {
      ar: 'قراءة أولية لتجربة سريرية في أمراض القلب — ماذا يعني للمرضى؟',
      fr: 'Première lecture d’un essai cardiovasculaire — qu’est-ce que cela change pour les patients ?',
      en: 'Early read on a cardiology trial — what it means for patients',
    },
    dek: {
      ar: 'سياق، حدود النتائج، والأسئلة التي يجب طرحها على الطبيب.',
      fr: 'Contexte, limites des résultats et questions à poser à votre médecin.',
      en: 'Context, limits of the data, and questions to ask your clinician.',
    },
    byline: { ar: 'مكتب العلوم', fr: 'Desk sciences', en: 'Science desk' },
    publishedAt: '2026-05-09',
    readingMinutes: 8,
    heroTone: 'slate',
  },
  {
    slug: 'community-health-volunteers',
    topic: 'community',
    kicker: { ar: 'مجتمع', fr: 'Communauté', en: 'Community' },
    title: {
      ar: 'متطوعو الصحة المحلية: خريطة المبادرات هذا الأسبوع',
      fr: 'Bénévoles santé: carte des initiatives cette semaine',
      en: 'Community health volunteers: this week’s initiative map',
    },
    dek: {
      ar: 'نقاط التجمع، أوقات التوعية، وقنوات المتابعة.',
      fr: 'Points de rassemblement, créneaux d’information et canaux de suivi.',
      en: 'Meet-up points, briefing windows, and follow-up channels.',
    },
    byline: { ar: 'فريق الميدان', fr: 'Équipe terrain', en: 'Field desk' },
    publishedAt: '2026-05-08',
    readingMinutes: 4,
    heroTone: 'amber',
  },
  {
    slug: 'editorial-standards-trust',
    topic: 'policy',
    kicker: { ar: 'المحرر', fr: 'Éditorial', en: 'Editorial' },
    title: {
      ar: 'معايير مشافي تي في: الشفافية، التصحيحات، والمصادر',
      fr: 'Charte Machafi TV: transparence, corrections et sources',
      en: 'Machafi TV standards: transparency, corrections, and sourcing',
    },
    dek: {
      ar: 'كيف نعمل، وكيف ترسل تصحيحاً أو بلاغاً.',
      fr: 'Comment nous travaillons et comment signaler une correction.',
      en: 'How we work and how to request a correction or file a report.',
    },
    byline: { ar: 'لجنة الجودة', fr: 'Comité qualité', en: 'Quality committee' },
    publishedAt: '2026-05-07',
    readingMinutes: 7,
    heroTone: 'slate',
  },
  {
    slug: 'telehealth-wait-times',
    topic: 'health',
    kicker: { ar: 'خدمات', fr: 'Services', en: 'Services' },
    title: {
      ar: 'الاستشارة عن بُعد: أوقات الانتظار ونصائح قبل الموعد',
      fr: 'Télésanté: délais et checklist avant la consultation',
      en: 'Telehealth: wait times and a pre-appointment checklist',
    },
    dek: {
      ar: 'تجهيز الملفات، جودة الاتصال، ومتى تتصل بالطوارئ.',
      fr: 'Préparer vos documents, qualité réseau et quand appeler les urgences.',
      en: 'Prepare documents, network quality, and when to call emergency services.',
    },
    byline: { ar: 'مكتب الخدمات', fr: 'Desk services', en: 'Services desk' },
    publishedAt: '2026-05-06',
    readingMinutes: 5,
    heroTone: 'emerald',
  },
];

export const tvWireActivity: TvWireLine[] = [
  {
    id: 'w1',
    time: '13:42',
    label: { ar: 'مباشر', fr: 'Fil', en: 'Wire' },
    body: {
      ar: 'المتحدث باسم الوزارة: مؤتمر صحفي خلال ٣٠ دقيقة.',
      fr: 'Porte-parole: conférence de presse dans 30 minutes.',
      en: 'Ministry spokesperson: press briefing in 30 minutes.',
    },
    urgent: true,
  },
  {
    id: 'w2',
    time: '13:10',
    label: { ar: 'تحقيق', fr: 'Vérif', en: 'Verify' },
    body: {
      ar: 'تأكيد الأرقام الرسمية لحملة التوعية قبل النشر.',
      fr: 'Vérification des chiffres officiels de la campagne avant publication.',
      en: 'Fact-checking official campaign figures before publish.',
    },
  },
  {
    id: 'w3',
    time: '12:55',
    label: { ar: 'جدول', fr: 'Grille', en: 'Schedule' },
    body: {
      ar: 'تحديث فقرة «صحة المجتمع» في البث المسائي.',
      fr: 'Mise à jour du segment « santé communautaire » au prime time.',
      en: 'Prime-time “community health” segment updated.',
    },
  },
  {
    id: 'w4',
    time: '12:20',
    label: { ar: 'ميدان', fr: 'Terrain', en: 'Field' },
    body: {
      ar: 'فريق ميداني في ولاية الجزائر — تغطية صباحية.',
      fr: 'Équipe terrain — Alger, couverture matinale.',
      en: 'Field team — Algiers, morning coverage.',
    },
  },
];

export const tvScheduleDay: TvScheduleSlot[] = [
  {
    id: 's1',
    start: '06:00',
    end: '08:30',
    title: { ar: 'صباح الصحة', fr: 'Matin santé', en: 'Morning Health' },
  },
  {
    id: 's2',
    start: '09:00',
    end: '11:00',
    title: { ar: 'ملفات', fr: 'Dossiers', en: 'Dossiers' },
    isLive: true,
  },
  {
    id: 's3',
    start: '12:00',
    end: '13:00',
    title: { ar: 'نشرة الظهيرة', fr: 'Journal de midi', en: 'Midday bulletin' },
    isLive: true,
  },
  {
    id: 's4',
    start: '15:00',
    end: '16:30',
    title: { ar: 'أسئلة المشاهدين', fr: 'Questions des téléspectateurs', en: 'Viewer questions' },
  },
  {
    id: 's5',
    start: '20:00',
    end: '21:30',
    title: { ar: 'برايم تايم صحي', fr: 'Prime santé', en: 'Prime-time health' },
    isLive: true,
  },
];

export function pick<T extends TvLocalized>(row: T, edition: TvEdition): string {
  return row[edition] ?? row.en;
}

export function getTvStories(edition: TvEdition): { story: TvStory; title: string; kicker: string; dek: string; byline: string }[] {
  return stories.map((story) => ({
    story,
    title: pick(story.title, edition),
    kicker: pick(story.kicker, edition),
    dek: pick(story.dek, edition),
    byline: pick(story.byline, edition),
  }));
}

export function getTvStoryBySlug(slug: string | undefined): TvStory | undefined {
  return stories.find((s) => s.slug === slug);
}

export function getTvStoriesByTopic(edition: TvEdition, topic: TvTopicId) {
  return getTvStories(edition).filter((s) => s.story.topic === topic);
}

export function searchTvStories(edition: TvEdition, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return getTvStories(edition).filter(({ title, dek, kicker }) =>
    [title, dek, kicker].some((x) => x.toLowerCase().includes(needle)),
  );
}

export function getLeadStories(edition: TvEdition, count = 4) {
  return getTvStories(edition).slice(0, count);
}
