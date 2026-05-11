export type LangText = { ar: string; fr: string; en: string };

export type NewsArticleMock = {
  id: number;
  /** Mirrors legacy detail URLs */
  slug: string;
  /** Maps to `news_articles.source` today; used for “wire” filtering */
  sourceKey: 'local' | 'aps' | 'afp' | 'reuters' | 'spa' | 'aljazeera' | 'bbc';
  /** Maps to `news_articles.tag` today; becomes a controlled vocabulary in CMS */
  tagKey: 'national' | 'public_health' | 'hospitals' | 'awareness' | 'emergency' | 'research';
  date: string; // ISO (YYYY-MM-DD) — maps to `news_articles.date`
  isArchived: boolean; // maps to `news_articles.is_archived`
  featured: boolean;
  breaking: boolean;
  readingMinutes: number;
  /** Editorial byline label (not a person name in mocks) */
  bylineKey: 'desk' | 'health_unit' | 'field';
  title: LangText;
  lead: LangText;
  /** Long-form body paragraphs */
  body: { ar: string[]; fr: string[]; en: string[] };
};

export const newsDeskPrinciplesMock: { title: LangText; desc: LangText }[] = [
  {
    title: {
      ar: 'تدقيق قبل النشر',
      fr: 'Vérification avant publication',
      en: 'Verification before publish',
    },
    desc: {
      ar: 'مسار واضح: مصدر، مراجعة، تصحيح، وتحديث عند تغير المعلومات.',
      fr: 'Un flux clair : source, relecture, correction, mise à jour si l’info évolue.',
      en: 'A clear flow: source, review, correction, and updates when facts change.',
    },
  },
  {
    title: {
      ar: 'الصحة أولاً',
      fr: 'La santé d’abord',
      en: 'Health-first framing',
    },
    desc: {
      ar: 'نميّز بين الخبر الإعلامي والإرشاد الطبي، ونوجّه للطوارئ عند الحاجة.',
      fr: 'On distingue l’info médias du conseil médical, et on oriente vers l’urgence si besoin.',
      en: 'We separate news from medical advice and signpost emergencies when needed.',
    },
  },
  {
    title: {
      ar: 'شفافية المصدر',
      fr: 'Transparence des sources',
      en: 'Source transparency',
    },
    desc: {
      ar: 'كل مادة تعرض المصدر والوسم والتاريخ — جاهزة للوحة تحرير احترافية.',
      fr: 'Chaque article affiche source, tag et date — prêt pour une rédaction pro.',
      en: 'Every story shows source, tag, and date — ready for a professional newsroom CMS.',
    },
  },
];

export const newsArticlesMock: NewsArticleMock[] = [
  {
    id: 601,
    slug: 'national-digital-health-roadmap-2026',
    sourceKey: 'local',
    tagKey: 'national',
    date: '2026-04-28',
    isArchived: false,
    featured: true,
    breaking: true,
    readingMinutes: 6,
    bylineKey: 'desk',
    title: {
      ar: 'مشافي: خارطة طريق رقمية للمعلومة الصحية الموثوقة في 2026',
      fr: 'Machafi : feuille de route 2026 pour une information de santé fiable',
      en: 'Machafi: a 2026 roadmap for trustworthy health information',
    },
    lead: {
      ar: 'تجربة أخبار مصممة للجمهور والمهنيين: وضوح، سرعة، ومسؤولية — مع قابلية كاملة للإدارة من لوحة تحرير.',
      fr: 'Une expérience “newsroom” pensée pour le public et les pros : clarté, rapidité, responsabilité — entièrement pilotable par un CMS.',
      en: 'A newsroom-grade experience for the public and professionals: clarity, speed, responsibility — fully CMS-driven.',
    },
    body: {
      ar: [
        'تهدف منصة مشافي إلى أن تكون مرجعاً سريعاً للمعلومة الصحية المرتبطة بالخدمات العملية: مستشفيات، صيدليات، إسعاف، واستشارات.',
        'في مرحلة الإطلاق، نعرض نماذج محتوى متعددة اللغات لضمان جودة العرض قبل ربط قاعدة الأخبار بالكامل.',
        'عند الربط مع الـ API، ستُدار العناوين والمقدمات والنصوص من لوحة إدارية مع صلاحيات (كاتب/محرر/مدير نشر).',
      ],
      fr: [
        'Machafi vise à devenir une référence rapide pour l’information santé liée aux services concrets : hôpitaux, pharmacies, ambulances, consultations.',
        'En phase UI-first, nous affichons des contenus multilingues pour valider la qualité d’affichage avant le branchement complet.',
        'Une fois l’API branchée, titres, chapô et corps seront gérés par un back-office avec rôles (rédacteur / éditeur / publication).',
      ],
      en: [
        'Machafi aims to be a fast reference for health information tied to real services: hospitals, pharmacies, ambulances, consultations.',
        'In the UI-first phase, we show multilingual sample stories to validate presentation before full database wiring.',
        'Once the API is connected, headline, lead, and body will be managed in an admin panel with roles (writer / editor / publisher).',
      ],
    },
  },
  {
    id: 602,
    slug: 'hospital-throughput-and-patient-flow',
    sourceKey: 'aps',
    tagKey: 'hospitals',
    date: '2026-04-26',
    isArchived: false,
    featured: true,
    breaking: false,
    readingMinutes: 5,
    bylineKey: 'health_unit',
    title: {
      ar: 'مستشفيات: تحسين مسار المريض دون ضجيج إعلامي',
      fr: 'Hôpitaux : améliorer le parcours patient sans bruit médiatique',
      en: 'Hospitals: improving patient flow without noisy headlines',
    },
    lead: {
      ar: 'ملف يشرح كيف تساعد الإجراءات التنظيمية البسيطة على تقليل الانتظار — مع روابط عملية لصفحات الخدمات.',
      fr: 'Un dossier qui explique comment de petits réglages organisationnels réduisent l’attente — avec des liens utiles vers les pages services.',
      en: 'A brief that explains how small operational fixes reduce wait times — with practical links to service pages.',
    },
    body: {
      ar: [
        'الفكرة الأساسية: المعلومة الصحية المفيدة هي التي تربط الزائر بإجراء واضح (اتصال، عنوان، تنسيق).',
        'لذلك صممنا بطاقات الأخبار لتظهر المصدر والتاريخ وزمن القراءة التقريبي.',
        'لاحقاً، يمكن ربط هذا النوع من الأخبار بجدول برامج أو نشرات رسمية عند توفرها.',
      ],
      fr: [
        'L’idée : une info santé utile relie le lecteur à une action claire (appel, adresse, coordination).',
        'C’est pourquoi les cartes affichent source, date et temps de lecture estimé.',
        'Plus tard, ce format pourra être relié à des communiqués officiels ou à une grille de programmes.',
      ],
      en: [
        'The idea: useful health news connects readers to a clear action (call, address, coordination).',
        'That is why cards show source, date, and estimated reading time.',
        'Later, this format can link to official bulletins or a program schedule when available.',
      ],
    },
  },
  {
    id: 603,
    slug: 'heatwave-planning-checklist',
    sourceKey: 'afp',
    tagKey: 'public_health',
    date: '2026-04-22',
    isArchived: false,
    featured: false,
    breaking: false,
    readingMinutes: 4,
    bylineKey: 'field',
    title: {
      ar: 'موجات الحر: قائمة تحقق قصيرة للأسر والمسافرين للعلاج',
      fr: 'Canicule : une checklist courte pour les familles (et les voyageurs soins)',
      en: 'Heatwaves: a short checklist for households (and treatment travelers)',
    },
    lead: {
      ar: 'نصائح عملية قابلة للمراجعة السريعة: ماء، أدوية، مواعيد، ومتى يكون التوجه للطوارئ ضرورياً.',
      fr: 'Conseils actionnables : hydratation, médicaments, rendez-vous, et quand aller aux urgences.',
      en: 'Actionable tips: hydration, medicines, appointments, and when to seek emergency care.',
    },
    body: {
      ar: [
        'هذا النموذج يمثل “خبر إرشادي” يتميز بأن له قيمة مباشرة للقارئ.',
        'في النظام الكامل، يمكن إضافة تنبيهات موسمية تلقائية من لوحة التحرير.',
        'يمكن أيضاً ربط المادة بمكتبة الوعي عند وجود ملفات PDF أو فيديوهات تعليمية.',
      ],
      fr: [
        'Ce modèle illustre une “actualité utile” avec valeur immédiate.',
        'Dans la version complète, la rédaction pourra publier des alertes saisonnières.',
        'On pourra lier l’article à la bibliothèque si des supports PDF/vidéo existent.',
      ],
      en: [
        'This sample illustrates “useful news” with immediate reader value.',
        'In the full system, editors can publish seasonal alerts.',
        'The story can link to the library when PDF/video materials exist.',
      ],
    },
  },
  {
    id: 604,
    slug: 'pharmacy-shortages-what-to-verify',
    sourceKey: 'reuters',
    tagKey: 'awareness',
    date: '2026-04-18',
    isArchived: false,
    featured: false,
    breaking: false,
    readingMinutes: 5,
    bylineKey: 'desk',
    title: {
      ar: 'نقص مستحضر: ماذا تتحقق منه قبل الاتصال بأكثر من صيدلية؟',
      fr: 'Pénurie de médicament : que vérifier avant d’appeler plusieurs pharmacies ?',
      en: 'Drug shortages: what to verify before calling multiple pharmacies',
    },
    lead: {
      ar: 'إطار هادئ يساعد على تقليل الذعر: التحقق من الوصفة، البدائل الآمنة، ومسار التنسيق مع الطبيب.',
      fr: 'Un cadre posé pour réduire la panique : ordonnance, alternatives sûres, coordination médicale.',
      en: 'A calm framework to reduce panic: prescription checks, safe alternatives, clinician coordination.',
    },
    body: {
      ar: [
        'الهدف: خبر يخدم الجمهور ويربطه بأدوات المنصة (دليل صيدليات).',
        'في الإدارة، يمكن وسم المادة كـ “تحديث مستمر” مع سجل تعديلات.',
        'يمكن إضافة تنبيه قانوني قصير بعدم استبدال العلاج دون استشارة طبية.',
      ],
      fr: [
        'Objectif : informer et renvoyer vers l’annuaire pharmacies.',
        'Côté admin, l’article peut être marqué “mise à jour continue” avec historique.',
        'Un encadré léger peut rappeler de ne pas changer un traitement sans avis médical.',
      ],
      en: [
        'Goal: inform the public and point to the pharmacies directory.',
        'On the admin side, the story can be flagged “continuously updated” with a changelog.',
        'A short disclaimer can remind readers not to change treatment without medical advice.',
      ],
    },
  },
  {
    id: 605,
    slug: 'ambulance-response-myths',
    sourceKey: 'bbc',
    tagKey: 'emergency',
    date: '2026-04-12',
    isArchived: false,
    featured: false,
    breaking: false,
    readingMinutes: 4,
    bylineKey: 'health_unit',
    title: {
      ar: 'إسعاف: تصحيح 5 مفاهيم شائعة حول زمن الوصول',
      fr: 'Ambulances : corriger 5 idées reçues sur le temps d’arrivée',
      en: 'Ambulances: correcting 5 common myths about response time',
    },
    lead: {
      ar: 'مادة توعوية سريعة تربط القارئ بصفحة الإسعاف عند الحاجة — دون إثارة غير ضرورية.',
      fr: 'Une sensibilisation courte qui renvoie vers la page ambulances quand nécessaire.',
      en: 'A quick awareness piece that routes to the ambulances page when needed.',
    },
    body: {
      ar: [
        'نموذج “تصحيح مفاهيم” مفيد للقنوات الصحية لأنه يقلل الضغط على الخطوط.',
        'يمكن لاحقاً إرفاق خريطة أو أرقام محدثة من الإدارة.',
        'يمكن أيضاً ربط المادة ببث مباشر عند وجود ندوة توعية.',
      ],
      fr: [
        'Le format “mythes/faits” réduit la pression sur les lignes d’urgence.',
        'On pourra ajouter carte et numéros mis à jour par l’admin.',
        'Possibilité de lier à un live lors d’une table ronde.',
      ],
      en: [
        'Myth/fact formats reduce pressure on emergency phone lines.',
        'Admins can later attach updated numbers and a map.',
        'Editors can link to a live town-hall when available.',
      ],
    },
  },
  {
    id: 606,
    slug: 'research-spotlight-sleep-and-recovery',
    sourceKey: 'spa',
    tagKey: 'research',
    date: '2026-04-08',
    isArchived: false,
    featured: false,
    breaking: false,
    readingMinutes: 7,
    bylineKey: 'desk',
    title: {
      ar: 'البحث والمجتمع: النوم والتعافي… كيف نقرأ العناوين دون مبالغة؟',
      fr: 'Recherche & société : sommeil et récupération… lire les titres sans sur-interpréter',
      en: 'Research & society: sleep and recovery… how to read headlines without overclaiming',
    },
    lead: {
      ar: 'ملف يشرح الفرق بين “دراسة أولية” و“توصية سريرية” — مع روابط لمكتبة الوعي.',
      fr: 'Un dossier qui distingue “résultat préliminaire” et “recommandation clinique” — lien vers la bibliothèque.',
      en: 'A brief that separates preliminary findings from clinical guidance — with library links.',
    },
    body: {
      ar: [
        'هذا النوع من المحتوى يعزز مصداقية القناة ويخدم التعليم الصحي.',
        'في لوحة التحرير، يُفضّل وسم المادة كـ “تفسير” وليس “خبر عاجل”.',
        'يمكن إضافة ملاحظة مراجعة طبية عند الحاجة.',
      ],
      fr: [
        'Ce type de contenu renforce la crédibilité et sert l’éducation santé.',
        'En rédaction, le tag “analyse” évite la confusion avec “breaking”.',
        'Une relecture médicale peut être ajoutée si nécessaire.',
      ],
      en: [
        'This content builds credibility and supports health literacy.',
        'In the CMS, an “analysis” tag avoids confusion with breaking news.',
        'Medical review notes can be attached when needed.',
      ],
    },
  },
];

export function getNewsArticleById(id: number | string | undefined) {
  if (id === undefined || id === null) return undefined;
  const n = typeof id === 'string' ? Number(id) : id;
  if (!Number.isFinite(n)) return undefined;
  return newsArticlesMock.find((a) => a.id === n);
}
