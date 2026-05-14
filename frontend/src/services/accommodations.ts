import type { HousingListing } from '../data/housing'
import { housingListingsMock } from '../data/housing'
import { getCommunes } from '../data/algeria-data'
import { apiUrl, getJson } from './http'

type ListResp = { items?: Record<string, unknown>[]; ok?: boolean; data?: { items?: Record<string, unknown>[] } }

function extractItems(raw: ListResp): Record<string, unknown>[] {
  const a = raw.data?.items
  if (Array.isArray(raw.items)) return raw.items
  if (Array.isArray(a)) return a
  return []
}

function padWilaya(raw: unknown): string {
  const t = String(raw ?? '').trim()
  if (/^\d{1,2}$/.test(t)) return t.padStart(2, '0')
  return t
}

function resolveCommuneId(wilayaCode: string, city: string): string {
  const c = city.trim()
  if (!c) return ''
  if (!/^\d{2}$/.test(wilayaCode)) return c.toLowerCase().replace(/\s+/g, '-')
  const communes = getCommunes(wilayaCode)
  const lower = c.toLowerCase()
  const hit = communes.find(
    (x) => x.id === c || x.name === c || x.ar_name === c || x.name.toLowerCase() === lower,
  )
  if (hit) return hit.id
  return c.toLowerCase().replace(/\s+/g, '-')
}

export function mapPhpAccommodationRow(row: Record<string, unknown>): HousingListing {
  const wilayaCode = padWilaya(row.wilaya_id)
  const city = String(row.city ?? '').trim()
  const latRaw = row.latitude
  const lngRaw = row.longitude
  const latitude =
    latRaw !== null && latRaw !== undefined && latRaw !== '' ? Number(latRaw) : undefined
  const longitude =
    lngRaw !== null && lngRaw !== undefined && lngRaw !== '' ? Number(lngRaw) : undefined

  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? '').trim() || '—',
    hostName: String(row.owner_name ?? '').trim() || '—',
    phone: String(row.phone ?? '').trim(),
    wilayaCode,
    communeId: resolveCommuneId(wilayaCode, city),
    address: String(row.address ?? '').trim() || undefined,
    housingType: 'guesthouse',
    capacity: Math.max(1, Number(row.capacity ?? 1)),
    isFree: Boolean(Number(row.is_free ?? 0)),
    pricePerNightDzd: Number(row.price_per_night ?? 0) || undefined,
    description: String(row.description ?? '').trim() || undefined,
    isVerified: false,
    acceptsCompanion: true,
    suitableForLongStay: false,
    isActive: Boolean(Number(row.is_active ?? 1)),
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
  }
}

export async function loadAccommodationsForList(): Promise<HousingListing[]> {
  if (import.meta.env.VITE_ACCOMMODATIONS_API !== 'true') {
    return housingListingsMock
  }
  const raw = await getJson<ListResp>(apiUrl('/public/accommodations.php'))
  const items = extractItems(raw)
  if (items.length === 0) return []
  return items.map((r) => mapPhpAccommodationRow(r))
}
