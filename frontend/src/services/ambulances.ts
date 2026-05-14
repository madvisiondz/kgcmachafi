import type { AmbulanceListing, AmbulanceVehicleType } from '../data/ambulances'
import { ambulanceListingsMock } from '../data/ambulances'
import { getCommunes } from '../data/algeria-data'
import { apiUrl, getJson } from './http'

const VEHICLE: ReadonlySet<AmbulanceVehicleType> = new Set(['standard', 'icu', 'medical-transport'])

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

export function mapPhpAmbulanceRow(row: Record<string, unknown>): AmbulanceListing {
  const vt = String(row.vehicle_type ?? 'standard').trim() as AmbulanceVehicleType
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
    ownerName: String(row.owner_name ?? '').trim() || '—',
    phone: String(row.phone ?? '').trim(),
    wilayaCode,
    communeId: resolveCommuneId(wilayaCode, city),
    isFree: Boolean(Number(row.is_free ?? 0)),
    priceDescription: String(row.price_description ?? '').trim() || undefined,
    vehicleType: VEHICLE.has(vt) ? vt : 'standard',
    isActive: Boolean(Number(row.is_active ?? 1)),
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
  }
}

export async function loadAmbulancesForList(): Promise<AmbulanceListing[]> {
  if (import.meta.env.VITE_AMBULANCES_API !== 'true') {
    return ambulanceListingsMock
  }
  const raw = await getJson<ListResp>(apiUrl('/public/ambulances.php'))
  const items = extractItems(raw)
  if (items.length === 0) return []
  return items.map((r) => mapPhpAmbulanceRow(r))
}
