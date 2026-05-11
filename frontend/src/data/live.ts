import type { ProgramCategory } from './programs';

/** Mirrors legacy `settings.live_player` shape for future API wiring. */
export type LivePlayerSettingsMock = {
  /** Progressive MP4 or HLS URL (admin-controlled in production). */
  streamUrl: string;
  /** Poster before play — local asset preferred. */
  posterUrl: string;
  /** Display-only until analytics API exists */
  viewerCountLabel: string;
  /** `live` | `offline` — offline shows slate + CTA to programs */
  broadcastState: 'live' | 'offline';
};

export const livePlayerSettingsMock: LivePlayerSettingsMock = {
  // Same public sample as legacy `VideoPlayer` default (replace with HLS/RTMP bridge later).
  streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  posterUrl: '/home/hero.jpg',
  viewerCountLabel: '2.4K',
  broadcastState: 'live',
};

export type LiveRecordedItemMock = {
  id: string;
  programKey: string;
  category: ProgramCategory;
  durationMin: number;
  videoUrl: string;
};

export const liveRecordedMock: LiveRecordedItemMock[] = [
  {
    id: 'vod-1',
    programKey: 'nutritionBasics',
    category: 'nutrition',
    durationMin: 40,
    videoUrl: livePlayerSettingsMock.streamUrl,
  },
  {
    id: 'vod-2',
    programKey: 'stressRelief',
    category: 'mental-health',
    durationMin: 45,
    videoUrl: livePlayerSettingsMock.streamUrl,
  },
  {
    id: 'vod-3',
    programKey: 'firstAid',
    category: 'emergency',
    durationMin: 30,
    videoUrl: livePlayerSettingsMock.streamUrl,
  },
  {
    id: 'vod-4',
    programKey: 'heartHealth',
    category: 'chronic-care',
    durationMin: 45,
    videoUrl: livePlayerSettingsMock.streamUrl,
  },
];

export type LiveUpNextMock = {
  id: string;
  programKey: string;
  startTime: string;
};

export const liveUpNextMock: LiveUpNextMock[] = [
  { id: 'up-1', programKey: 'familyHealth', startTime: '19:00' },
  { id: 'up-2', programKey: 'diabetesCare', startTime: '21:00' },
  { id: 'up-3', programKey: 'healthyMorning', startTime: '09:00' },
];
