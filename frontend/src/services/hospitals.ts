import type { HospitalFeature, HospitalListing, HospitalType, InternationalHospitalListing } from '../data/hospitals'
import { hospitalsAlgeriaMock, hospitalsInternationalMock } from '../data/hospitals'
import { getCommunes } from '../data/algeria-data'
import { apiUrl, getJson } from './http'

const LOCAL_TYPES: readonly HospitalType[] = ['public', 'private', 'clinic', 'specialized']

const FEATURE_SET = new Set<HospitalFeature>([
  'emergency',
  'icu',
  'online_consult',
  'direct_booking',
  'insurance',
  'card_payment',
])

type PhpItemsResponse = {
  items?: Record<string, unknown>[]
  ok?: boolean
  data?: { items?: Record<string, unknown>[] }
}

function padWilayaId(raw: unknown): string {
  const t = String(raw ?? '').trim()
  if (/^\d{1,2}$/.test(t)) return t.padStart(2, '0')
  return t
}

function mapHospitalType(raw: unknown): HospitalType {
  const x = String(raw ?? 'public').trim().toLowerCase()
  return LOCAL_TYPES.includes(x as HospitalType) ? (x as HospitalType) : 'public'
}

function mapFeatures(raw: unknown): HospitalFeature[] {
  if (!Array.isArray(raw)) return []
  const out: HospitalFeature[] = []
  for (const x of raw) {
    const s = String(x).trim() as HospitalFeature
    if (FEATURE_SET.has(s)) out.push(s)
  }
  return out
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

/** Map one `hospitals` row from `api/public/hospitals.php` into the SPA listing model. */
export function mapPhpHospitalRow(row: Record<string, unknown>): HospitalListing {
  const wilayaCode = padWilayaId(row.wilaya_id)
  const city = String(row.city ?? '').trim()
  const latRaw = row.latitude
  const lngRaw = row.longitude
  const latitude =
    latRaw !== null && latRaw !== undefined && latRaw !== '' ? Number(latRaw) : undefined
  const longitude =
    lngRaw !== null && lngRaw !== undefined && lngRaw !== '' ? Number(lngRaw) : undefined

  const specialties = row.specialties
  const specialtyTags = Array.isArray(specialties) ? specialties.map((x) => String(x)) : []

  const name = String(row.name ?? '').trim() || '—'
  const idRaw = String(row.id ?? '').trim()

  return {
    id: idRaw || `row-${name}`,
    name,
    wilayaCode,
    communeId: resolveCommuneId(wilayaCode, city),
    address: String(row.address ?? '').trim() || undefined,
    phone: String(row.phone ?? '').trim() || undefined,
    website: String(row.website ?? '').trim() || undefined,
    type: mapHospitalType(row.type),
    specialtyTags,
    hoursLabel: String(row.hours ?? '').trim() || undefined,
    isVerified: false,
    rating: typeof row.rating === 'number' ? row.rating : Number(row.rating ?? 0) || undefined,
    reviewsCount:
      typeof row.reviews_count === 'number'
        ? row.reviews_count
        : Number(row.reviews_count ?? 0) || undefined,
    features: mapFeatures(row.features),
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
    isActive: Number(row.is_active ?? 1) === 1,
  }
}

/** Map one `international_hospitals` row from `api/public/international-hospitals.php`. */
export function mapPhpInternationalHospitalRow(row: Record<string, unknown>): InternationalHospitalListing {
  const name = String(row.name ?? '').trim() || '—'
  const idRaw = String(row.id ?? '').trim()
  return {
    id: idRaw || `row-${name}`,
    name,
    countryKey: String(row.country ?? '').trim().toLowerCase() || 'unknown',
    specialtyKey: String(row.specialty ?? '').trim().toLowerCase() || 'unknown',
    city: String(row.city ?? '').trim() || undefined,
    phone: String(row.phone ?? '').trim() || undefined,
    website: String(row.website ?? '').trim() || undefined,
    isVerified: false,
    rating: typeof row.rating === 'number' ? row.rating : Number(row.rating ?? 0) || undefined,
    reviewsCount:
      typeof row.reviews_count === 'number'
        ? row.reviews_count
        : Number(row.reviews_count ?? 0) || undefined,
    features: mapFeatures(row.features),
    isActive: Number(row.is_active ?? 1) === 1,
  }
}

function extractItems(raw: PhpItemsResponse): Record<string, unknown>[] {
  const envelopeItems = raw.data?.items
  if (Array.isArray(raw.items)) return raw.items
  if (Array.isArray(envelopeItems)) return envelopeItems
  return []
}

export type HospitalDatasets = {
  local: HospitalListing[]
  abroad: InternationalHospitalListing[]
}

/**
 * Algeria + abroad hospital lists for the directory page.
 * - Default (`VITE_HOSPITALS_API` unset / not `true`): demo mocks (no network).
 * - When `VITE_HOSPITALS_API=true`: parallel `GET` local + international public PHP; HTTP errors **throw** for Retry UI.
 */
export async function loadHospitalDatasets(): Promise<HospitalDatasets> {
  if (import.meta.env.VITE_HOSPITALS_API !== 'true') {
    return { local: hospitalsAlgeriaMock, abroad: hospitalsInternationalMock }
  }

  const base = apiUrl('/public')
  const [localRaw, abroadRaw] = await Promise.all([
    getJson<PhpItemsResponse>(`${base}/hospitals.php`),
    getJson<PhpItemsResponse>(`${base}/international-hospitals.php`),
  ])

  const localItems = extractItems(localRaw)
  const abroadItems = extractItems(abroadRaw)

  return {
    local: localItems.map((row) => mapPhpHospitalRow(row)),
    abroad: abroadItems.map((row) => mapPhpInternationalHospitalRow(row)),
  }
}
