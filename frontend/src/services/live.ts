import type { LivePlayerSettingsMock, LiveRecordedItemMock, LiveUpNextMock } from '../data/live'
import { livePlayerSettingsMock, liveRecordedMock, liveUpNextMock } from '../data/live'
import type { ProgramCategory } from '../data/programs'
import { apiUrl, getJson } from './http'
import { extractEnvelopeData } from './envelope'

const CATEGORIES: ReadonlySet<ProgramCategory> = new Set([
  'awareness',
  'nutrition',
  'mental-health',
  'family',
  'emergency',
  'chronic-care',
])

function pickCategory(raw: unknown): ProgramCategory {
  const s = String(raw ?? 'awareness').trim()
  return CATEGORIES.has(s as ProgramCategory) ? (s as ProgramCategory) : 'awareness'
}

export type LivePageBundle = {
  player: LivePlayerSettingsMock
  recorded: LiveRecordedItemMock[]
  upNext: LiveUpNextMock[]
}

function mapPlayer(row: Record<string, unknown>): LivePlayerSettingsMock {
  return {
    streamUrl: String(row.stream_url ?? '').trim(),
    posterUrl: String(row.poster_url ?? '/home/hero.jpg').trim() || '/home/hero.jpg',
    viewerCountLabel: String(row.viewer_count_label ?? '0'),
    broadcastState: String(row.broadcast_state ?? 'offline') === 'live' ? 'live' : 'offline',
  }
}

function mapRecorded(row: Record<string, unknown>): LiveRecordedItemMock {
  return {
    id: String(row.id ?? ''),
    programKey: String(row.program_key ?? 'nutritionBasics'),
    category: pickCategory(row.category),
    durationMin: Math.max(1, Number(row.duration_min ?? 30) || 30),
    videoUrl: String(row.video_url ?? '').trim(),
  }
}

function mapUpNext(row: Record<string, unknown>): LiveUpNextMock {
  return {
    id: String(row.id ?? ''),
    programKey: String(row.program_key ?? 'familyHealth'),
    startTime: normalizeTime(row.start_time),
  }
}

function normalizeTime(raw: unknown): string {
  const s = String(raw ?? '').trim()
  if (/^\d{1,2}:\d{2}$/.test(s)) {
    const [h, m] = s.split(':')
    return `${h.padStart(2, '0')}:${m}`
  }
  return '09:00'
}

export async function loadLivePageBundle(): Promise<LivePageBundle> {
  if (import.meta.env.VITE_LIVE_API !== 'true') {
    return { player: livePlayerSettingsMock, recorded: liveRecordedMock, upNext: liveUpNextMock }
  }
  const raw = await getJson<unknown>(apiUrl('/public/live.php'))
  const data =
    extractEnvelopeData<{
      player?: Record<string, unknown>
      recorded?: Record<string, unknown>[]
      up_next?: Record<string, unknown>[]
    }>(raw) ?? {}

  const playerRow = data.player && typeof data.player === 'object' ? (data.player as Record<string, unknown>) : {}
  const player = Object.keys(playerRow).length ? mapPlayer(playerRow) : livePlayerSettingsMock

  const rec = Array.isArray(data.recorded) ? data.recorded.map((r) => mapRecorded(r as Record<string, unknown>)) : []
  const up = Array.isArray(data.up_next) ? data.up_next.map((r) => mapUpNext(r as Record<string, unknown>)) : []

  return {
    player,
    recorded: rec.length ? rec : liveRecordedMock,
    upNext: up.length ? up : liveUpNextMock,
  }
}
