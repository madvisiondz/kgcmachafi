import type { Pharmacy } from '../data/pharmacies'
import { pharmaciesDirectoryMock } from '../data/pharmacies'
import { getCommunes, wilayas } from '../data/algeria-data'
import { apiUrl, getJson } from './http'

type PharmaciesPhpListResponse = {
  items?: Record<string, unknown>[]
  ok?: boolean
  data?: { items?: Record<string, unknown>[] }
}

function padWilayaCode(raw: string): string {
  const t = raw.trim()
  if (/^\d{1,2}$/.test(t)) return t.padStart(2, '0')
  return t
}

function resolveWilaya(rowWilaya: string): { code: string; nameFr: string; nameAr: string } {
  const raw = String(rowWilaya ?? '').trim()
  if (!raw) return { code: '00', nameFr: '', nameAr: '' }

  if (/^\d{1,2}$/.test(raw)) {
    const code = raw.padStart(2, '0')
    const w = wilayas.find((x) => x.id === code)
    if (w) return { code: w.id, nameFr: w.name, nameAr: w.ar_name }
    return { code, nameFr: raw, nameAr: raw }
  }

  const lower = raw.toLowerCase()
  const w = wilayas.find(
    (x) =>
      x.name.toLowerCase() === lower ||
      x.ar_name === raw ||
      x.name.toLowerCase().includes(lower) ||
      x.ar_name.includes(raw),
  )
  if (w) return { code: w.id, nameFr: w.name, nameAr: w.ar_name }

  return { code: '00', nameFr: raw, nameAr: raw }
}

function resolveCommune(wilayaCode: string, commune: string): { cityAr: string; cityFr: string } {
  const c = String(commune ?? '').trim()
  if (!c) return { cityAr: '', cityFr: '' }
  if (wilayaCode === '00') return { cityAr: c, cityFr: c }

  const communes = getCommunes(wilayaCode)
  const lower = c.toLowerCase()
  const hit = communes.find((x) => x.name === c || x.ar_name === c || x.name.toLowerCase() === lower)
  if (hit) return { cityAr: hit.ar_name, cityFr: hit.name }
  return { cityAr: c, cityFr: c }
}

/** Map one `pharmacies` row from PHP `api/public/pharmacies.php` into the SPA directory model. */
export function mapPhpPharmacyRow(row: Record<string, unknown>): Pharmacy {
  const id = String(row.id ?? '')
  const name = String(row.name ?? '').trim()
  const wilayaRaw = String(row.wilaya ?? '')
  const communeRaw = String(row.commune ?? '')
  const phone = String(row.phone ?? '').trim() || undefined

  const latRaw = row.latitude
  const lngRaw = row.longitude
  const latitude =
    latRaw !== null && latRaw !== undefined && latRaw !== '' ? Number(latRaw) : undefined
  const longitude =
    lngRaw !== null && lngRaw !== undefined && lngRaw !== '' ? Number(lngRaw) : undefined

  const { code, nameFr, nameAr } = resolveWilaya(wilayaRaw)
  const wilayaCode = code === '00' ? padWilayaCode(wilayaRaw) || '00' : code
  const { cityAr, cityFr } = resolveCommune(wilayaCode, communeRaw)

  const isNightDuty = Boolean(Number(row.is_night_duty ?? 0))

  return {
    id: id || `row-${name}`,
    name: name || '—',
    wilayaCode,
    wilayaNameAr: nameAr,
    wilayaNameFr: nameFr,
    cityAr,
    cityFr,
    phone,
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
    source: 'static',
    isNightDuty,
  }
}

/**
 * Load pharmacies for the directory list + map.
 * - Default (`VITE_PHARMACIES_API` unset / false): demo mocks (no network).
 * - When `VITE_PHARMACIES_API=true`: `GET /public/pharmacies.php`; empty → `[]`; HTTP errors **throw** for Retry UI.
 */
export async function loadPharmaciesForList(): Promise<Pharmacy[]> {
  if (import.meta.env.VITE_PHARMACIES_API !== 'true') {
    return pharmaciesDirectoryMock
  }

  const url = apiUrl('/public/pharmacies.php')
  const raw = await getJson<PharmaciesPhpListResponse>(url)
  const envelopeItems = raw.data?.items
  const items = Array.isArray(raw.items) ? raw.items : Array.isArray(envelopeItems) ? envelopeItems : []

  if (items.length === 0) {
    return []
  }

  return items.map((row) => mapPhpPharmacyRow(row as Record<string, unknown>))
}
