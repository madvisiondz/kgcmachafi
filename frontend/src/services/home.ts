import { apiUrl, getJson } from './http'
import { extractEnvelopeData } from './envelope'

export type HomeMainStat = { value: string; label: string; tone: 'blue' | 'green' | 'emerald' }

export type HomeNewsTeaser = { id: string; tag: string; date: string; title: string; desc: string }

export type HomeBundle = {
  mainStats: HomeMainStat[]
  newsTeasers: HomeNewsTeaser[]
}

function iconToTone(iconKey: string): HomeMainStat['tone'] {
  if (iconKey === 'heart') return 'green'
  if (iconKey === 'book') return 'emerald'
  return 'blue'
}

function mapHeroRow(row: Record<string, unknown>): HomeMainStat {
  return {
    value: String(row.value ?? '').trim() || '—',
    label: String(row.label ?? '').trim() || '—',
    tone: iconToTone(String(row.icon_key ?? '')),
  }
}

function mapNewsTeaser(row: Record<string, unknown>): HomeNewsTeaser {
  return {
    id: String(row.id ?? ''),
    tag: 'News',
    date: String(row.date ?? '').slice(0, 10) || '—',
    title: String(row.title ?? '').trim() || '—',
    desc: String(row.description ?? '').trim() || '',
  }
}

export async function loadHomeBundle(lang: string): Promise<HomeBundle | null> {
  if (import.meta.env.VITE_HOME_API !== 'true') {
    return null
  }
  const l = ['ar', 'fr', 'en'].includes(lang) ? lang : 'ar'
  const raw = await getJson<unknown>(apiUrl(`/public/home.php?lang=${encodeURIComponent(l)}`))
  const data =
    extractEnvelopeData<{
      hero_stats?: Record<string, unknown>[]
      latest_news?: Record<string, unknown>[]
    }>(raw) ?? {}

  const hero = Array.isArray(data.hero_stats) ? data.hero_stats.map((r) => mapHeroRow(r as Record<string, unknown>)) : []
  const news = Array.isArray(data.latest_news) ? data.latest_news.map((r) => mapNewsTeaser(r as Record<string, unknown>)) : []

  return { mainStats: hero, newsTeasers: news }
}
