import type { NewsArticleMock } from '../data/news'
import { getNewsArticleById, newsArticlesMock } from '../data/news'
import { ApiError, apiUrl, getJson } from './http'

const SOURCE_KEYS = new Set(['local', 'aps', 'spa', 'afp', 'reuters', 'aljazeera', 'bbc'])
const TAG_KEYS = new Set(['national', 'public_health', 'hospitals', 'awareness', 'emergency', 'research'])

function pickSourceKey(raw: string): NewsArticleMock['sourceKey'] {
  const k = raw.trim().toLowerCase()
  if (SOURCE_KEYS.has(k)) return k as NewsArticleMock['sourceKey']
  return 'local'
}

function pickTagKey(raw: string): NewsArticleMock['tagKey'] {
  const k = raw.trim().toLowerCase().replace(/\s+/g, '_')
  if (TAG_KEYS.has(k)) return k as NewsArticleMock['tagKey']
  return 'national'
}

function splitBody(content: string): { ar: string[]; fr: string[]; en: string[] } {
  const parts = content.trim() ? content.split(/\n\n+/).map((s) => s.trim()).filter(Boolean) : ['']
  return { ar: parts, fr: parts, en: parts }
}

/** Map one `news_articles` row from PHP `api/public/news.php` into the SPA newsroom card model. */
export function mapPhpNewsRow(row: Record<string, unknown>): NewsArticleMock {
  const id = Number(row.id)
  const titleStr = String(row.title ?? '')
  const leadStr = String(row.description ?? '')
  const contentStr = String(row.content ?? '')
  const date = String(row.date ?? '').slice(0, 10) || '1970-01-01'
  const isArchived = Boolean(Number(row.is_archived ?? 0))

  const title = { ar: titleStr, fr: titleStr, en: titleStr }
  const lead = { ar: leadStr, fr: leadStr, en: leadStr }
  const body = splitBody(contentStr || leadStr)

  return {
    id: Number.isFinite(id) ? id : 0,
    slug: String(row.slug ?? `news-${row.id ?? 'item'}`),
    sourceKey: pickSourceKey(String(row.source ?? 'local')),
    tagKey: pickTagKey(String(row.tag ?? 'national')),
    date,
    isArchived,
    featured: false,
    breaking: false,
    readingMinutes: Math.max(1, Math.ceil((contentStr || leadStr).split(/\s+/).filter(Boolean).length / 200)),
    bylineKey: 'desk',
    title,
    lead,
    body,
  }
}

type NewsPhpListResponse = {
  items?: Record<string, unknown>[]
  ok?: boolean
  data?: { items?: Record<string, unknown>[] }
}

/**
 * Load articles for the newsroom list.
 * - Default (`VITE_NEWS_API` unset / false): returns demo mocks (no network).
 * - When `VITE_NEWS_API=true`: calls PHP; empty list returns `[]`; network/HTTP errors **throw** so the UI can show `listStates` + Retry.
 */
export async function loadNewsArticlesForList(): Promise<NewsArticleMock[]> {
  if (import.meta.env.VITE_NEWS_API !== 'true') {
    return newsArticlesMock
  }

  const url = apiUrl('/public/news.php?limit=80&archived=0')
  const raw = await getJson<NewsPhpListResponse>(url)
  const envelopeItems = raw.data?.items
  const items = Array.isArray(raw.items) ? raw.items : Array.isArray(envelopeItems) ? envelopeItems : []

  if (items.length === 0) {
    return []
  }

  return items.map((row) => mapPhpNewsRow(row))
}

type NewsPhpItemResponse = {
  item?: Record<string, unknown>
  ok?: boolean
  data?: { item?: Record<string, unknown> }
}

/**
 * Load a single article for `/news/:id`.
 * - Default: demo data via `getNewsArticleById` (no network).
 * - `VITE_NEWS_API=true`: `GET /public/news.php?id=…`; **404** → `undefined` (show “not found”); other errors **throw**.
 */
export async function loadNewsArticleForDetail(id: string | undefined): Promise<NewsArticleMock | undefined> {
  if (id === undefined || id === null || id === '') return undefined
  const n = Number(id)
  if (!Number.isFinite(n)) return undefined

  if (import.meta.env.VITE_NEWS_API !== 'true') {
    return getNewsArticleById(id)
  }

  try {
    const url = apiUrl(`/public/news.php?id=${encodeURIComponent(String(n))}`)
    const raw = await getJson<NewsPhpItemResponse>(url)
    const row = raw.item ?? raw.data?.item
    if (!row || typeof row !== 'object') return undefined
    return mapPhpNewsRow(row as Record<string, unknown>)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return undefined
    throw e
  }
}
