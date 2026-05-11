export type ProgramCategory = 'awareness' | 'nutrition' | 'mental-health' | 'family' | 'emergency' | 'chronic-care';

export type ProgramDayKey = 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

/**
 * Schedule row. Content strings (title/desc/host) come from i18n keys:
 * - programs.items.<programKey>.title
 * - programs.items.<programKey>.desc
 * - programs.hosts.<hostKey>
 */
export type ProgramScheduleItem = {
  id: string;
  programKey: string;
  hostKey: string;
  category: ProgramCategory;
  day: ProgramDayKey;
  startTime: string; // "18:30"
  durationMin: number;
  isLive: boolean;
  isReplayAvailable: boolean;
};

export const programScheduleMock: ProgramScheduleItem[] = [
  {
    id: 'ps-sat-1',
    programKey: 'healthyMorning',
    hostKey: 'drBenali',
    category: 'awareness',
    day: 'sat',
    startTime: '09:00',
    durationMin: 35,
    isLive: false,
    isReplayAvailable: true,
  },
  {
    id: 'ps-sat-2',
    programKey: 'nutritionBasics',
    hostKey: 'coachLina',
    category: 'nutrition',
    day: 'sat',
    startTime: '18:00',
    durationMin: 40,
    isLive: true,
    isReplayAvailable: true,
  },
  {
    id: 'ps-sun-1',
    programKey: 'stressRelief',
    hostKey: 'drHadj',
    category: 'mental-health',
    day: 'sun',
    startTime: '20:00',
    durationMin: 45,
    isLive: true,
    isReplayAvailable: true,
  },
  {
    id: 'ps-mon-1',
    programKey: 'familyHealth',
    hostKey: 'drSamira',
    category: 'family',
    day: 'mon',
    startTime: '19:00',
    durationMin: 50,
    isLive: true,
    isReplayAvailable: true,
  },
  {
    id: 'ps-tue-1',
    programKey: 'firstAid',
    hostKey: 'civilProtection',
    category: 'emergency',
    day: 'tue',
    startTime: '18:30',
    durationMin: 30,
    isLive: false,
    isReplayAvailable: true,
  },
  {
    id: 'ps-wed-1',
    programKey: 'diabetesCare',
    hostKey: 'drNadia',
    category: 'chronic-care',
    day: 'wed',
    startTime: '21:00',
    durationMin: 35,
    isLive: true,
    isReplayAvailable: true,
  },
  {
    id: 'ps-thu-1',
    programKey: 'heartHealth',
    hostKey: 'drKarim',
    category: 'chronic-care',
    day: 'thu',
    startTime: '19:30',
    durationMin: 45,
    isLive: false,
    isReplayAvailable: true,
  },
  {
    id: 'ps-fri-1',
    programKey: 'kidsFever',
    hostKey: 'pedsCollective',
    category: 'family',
    day: 'fri',
    startTime: '17:00',
    durationMin: 35,
    isLive: false,
    isReplayAvailable: true,
  },
];

