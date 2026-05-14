import type { ProgramCategory, ProgramDayKey, ProgramScheduleItem } from '../data/programs'
import { programScheduleMock } from '../data/programs'
import { apiUrl, getJson } from './http'
import { extractListItems } from './envelope'

const CATEGORIES: ReadonlySet<ProgramCategory> = new Set([
  'awareness',
  'nutrition',
  'mental-health',
  'family',
  'emergency',
  'chronic-care',
])

const DAY_KEYS: ReadonlySet<ProgramDayKey> = new Set(['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'])

/** JS getDay(): 0=Sun … 6=Sat → ProgramDayKey */
const JS_DAY_TO_KEY: ProgramDayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

function pickCategory(raw: unknown): ProgramCategory {
  const s = String(raw ?? 'general').trim()
  return CATEGORIES.has(s as ProgramCategory) ? (s as ProgramCategory) : 'awareness'
}

function pickDay(row: Record<string, unknown>): ProgramDayKey {
  const dk = String(row.day_key ?? '').trim().toLowerCase()
  if (DAY_KEYS.has(dk as ProgramDayKey)) return dk as ProgramDayKey
  const dow = row.day_of_week
  if (dow !== null && dow !== undefined && dow !== '') {
    const n = Number(dow)
    if (Number.isFinite(n) && n >= 0 && n <= 6) return JS_DAY_TO_KEY[n]
  }
  return 'sat'
}

function normalizeTime(raw: unknown): string {
  const s = String(raw ?? '').trim()
  if (/^\d{1,2}:\d{2}$/.test(s)) {
    const [h, m] = s.split(':')
    return `${h.padStart(2, '0')}:${m}`
  }
  return '09:00'
}

export function mapPhpProgramRow(row: Record<string, unknown>): ProgramScheduleItem {
  const programKey = String(row.program_key ?? 'healthyMorning').trim() || 'healthyMorning'
  const hostKey = String(row.host_key ?? 'drBenali').trim() || 'drBenali'
  const title = String(row.title ?? '').trim()
  const description = String(row.description ?? '').trim()

  return {
    id: String(row.id ?? ''),
    programKey,
    hostKey,
    category: pickCategory(row.category),
    day: pickDay(row),
    startTime: normalizeTime(row.time_slot),
    durationMin: Math.max(1, Number(row.duration_min ?? row.video_duration_seconds ?? 30) || 30),
    isLive: Boolean(Number(row.is_live_slot ?? 0)),
    isReplayAvailable: Boolean(Number(row.is_replay_available ?? 1)),
    title: title || undefined,
    description: description || undefined,
  }
}

export async function loadProgramsForList(): Promise<ProgramScheduleItem[]> {
  if (import.meta.env.VITE_PROGRAMS_API !== 'true') {
    return programScheduleMock
  }
  const raw = await getJson<unknown>(apiUrl('/public/programs.php'))
  const rows = extractListItems(raw)
  if (rows.length === 0) return programScheduleMock
  return rows.map((r) => mapPhpProgramRow(r))
}
