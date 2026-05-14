import { apiUrl, getJson } from './http'
import { extractEnvelopeData } from './envelope'

export type PublicSettings = Record<string, unknown>

export async function loadPublicSettings(): Promise<PublicSettings | null> {
  if (import.meta.env.VITE_SETTINGS_API !== 'true') {
    return null
  }
  const raw = await getJson<unknown>(apiUrl('/public/settings.php'))
  const data = extractEnvelopeData<{ settings?: PublicSettings }>(raw) ?? {}
  return data.settings && typeof data.settings === 'object' ? data.settings : {}
}
