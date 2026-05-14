import type { LanguageCode, ServiceItem, TranslatedText } from '../data/services'
import { servicesMock } from '../data/services'
import { apiUrl, getJson } from './http'
import { extractEnvelopeData } from './envelope'

const ICON_KEYS = new Set([
  'heart',
  'home-care',
  'lab',
  'nurse',
  'rehab',
  'oxygen',
  'transport',
  'support',
])

function triplet(text: string): TranslatedText {
  const t = text.trim()
  return { ar: t, fr: t, en: t }
}

function pickIconKey(raw: unknown): ServiceItem['icon_key'] {
  const s = String(raw ?? 'support').trim()
  return ICON_KEYS.has(s as ServiceItem['icon_key']) ? (s as ServiceItem['icon_key']) : 'support'
}

export function mapPhpServiceRow(row: Record<string, unknown>): ServiceItem {
  const title = String(row.title ?? '').trim() || '—'
  const description = String(row.description ?? '').trim()
  const details = String(row.details ?? '').trim() || description
  const featuresRaw = row.features
  let features: TranslatedText[] = []
  if (Array.isArray(featuresRaw)) {
    features = featuresRaw.map((x) => triplet(String(x)))
  } else if (typeof featuresRaw === 'string') {
    try {
      const parsed = JSON.parse(featuresRaw) as unknown
      if (Array.isArray(parsed)) features = parsed.map((x) => triplet(String(x)))
    } catch {
      features = []
    }
  }
  if (features.length === 0) features = [triplet('')]

  return {
    id: String(row.id ?? ''),
    icon_key: pickIconKey(row.icon_key),
    color_class: 'from-emerald-500 to-green-600',
    bg_class: 'bg-emerald-50',
    sort_order: Number(row.sort_order ?? 0) || 0,
    is_active: Boolean(Number(row.is_active ?? 1)),
    title: triplet(title),
    description: triplet(description),
    details: triplet(details),
    features,
  }
}

export async function loadServicesCatalog(lang: LanguageCode): Promise<ServiceItem[]> {
  if (import.meta.env.VITE_SERVICES_CATALOG_API !== 'true') {
    return servicesMock
  }
  const l = ['ar', 'fr', 'en'].includes(lang) ? lang : 'ar'
  const raw = await getJson<unknown>(apiUrl(`/public/services.php?lang=${encodeURIComponent(l)}`))
  const data = extractEnvelopeData<{ items?: Record<string, unknown>[] }>(raw) ?? {}
  const items = Array.isArray(data.items) ? data.items : []
  if (items.length === 0) return servicesMock
  return items.map((r) => mapPhpServiceRow(r as Record<string, unknown>))
}
