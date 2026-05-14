import type { DonationCampaign, DonationStats, TranslatedText } from '../data/donations'
import { campaignsMock, donationStatsMock } from '../data/donations'
import { ApiError, apiUrl, getJson, postJson } from './http'
import { extractEnvelopeData } from './envelope'

function asRecord(v: unknown): Record<string, string> {
  if (!v || typeof v !== 'object') return {}
  const o = v as Record<string, unknown>
  const out: Record<string, string> = {}
  for (const k of ['ar', 'fr', 'en']) {
    const x = o[k]
    if (x !== undefined && x !== null) out[k] = String(x)
  }
  return out
}

function parseTitleDesc(row: Record<string, unknown>): { title: TranslatedText; description: TranslatedText } {
  let titleRaw: unknown = row.title_json ?? row.title
  let descRaw: unknown = row.description_json ?? row.description
  if (typeof titleRaw === 'string') {
    try {
      titleRaw = JSON.parse(titleRaw)
    } catch {
      titleRaw = { ar: titleRaw, fr: titleRaw, en: titleRaw }
    }
  }
  if (typeof descRaw === 'string') {
    try {
      descRaw = JSON.parse(descRaw)
    } catch {
      descRaw = { ar: descRaw, fr: descRaw, en: descRaw }
    }
  }
  const t = asRecord(titleRaw)
  const d = asRecord(descRaw)
  const title: TranslatedText = {
    ar: t.ar || t.en || t.fr || '—',
    fr: t.fr || t.en || t.ar || '—',
    en: t.en || t.fr || t.ar || '—',
  }
  const description: TranslatedText = {
    ar: d.ar || d.en || d.fr || '',
    fr: d.fr || d.en || d.ar || '',
    en: d.en || d.fr || d.ar || '',
  }
  return { title, description }
}

function pickTheme(raw: unknown): DonationCampaign['theme'] {
  const s = String(raw ?? 'emerald')
  if (s === 'red' || s === 'emerald' || s === 'blue') return s
  return 'emerald'
}

export function mapPhpCampaignRow(row: Record<string, unknown>): DonationCampaign {
  const { title, description } = parseTitleDesc(row)
  return {
    id: String(row.id ?? ''),
    title,
    description,
    raisedEur: Math.max(0, Number(row.raised_eur ?? 0) || 0),
    goalEur: Math.max(1, Number(row.goal_eur ?? 1) || 1),
    donors: Math.max(0, Number(row.donors ?? 0) || 0),
    theme: pickTheme(row.theme),
  }
}

export type DonationsPageData = {
  stats: DonationStats
  campaigns: DonationCampaign[]
}

export async function loadDonationsPageData(): Promise<DonationsPageData> {
  if (import.meta.env.VITE_DONATIONS_API !== 'true') {
    return { stats: donationStatsMock, campaigns: campaignsMock }
  }
  const raw = await getJson<unknown>(apiUrl('/public/donations.php'))
  const data = extractEnvelopeData<{ stats?: Record<string, unknown>; campaigns?: Record<string, unknown>[] }>(raw) ?? {}
  const statsRow = data.stats && typeof data.stats === 'object' ? (data.stats as Record<string, unknown>) : {}
  const stats: DonationStats = {
    ...donationStatsMock,
    helpedValue: String(statsRow.helped_value ?? donationStatsMock.helpedValue),
    totalValueEur: String(statsRow.total_value_eur ?? donationStatsMock.totalValueEur),
    donorsValue: String(statsRow.donors_value ?? donationStatsMock.donorsValue),
    successValue: String(statsRow.success_value ?? donationStatsMock.successValue),
  }
  const campRows = Array.isArray(data.campaigns) ? data.campaigns : []
  const campaigns = campRows.length ? campRows.map((r) => mapPhpCampaignRow(r as Record<string, unknown>)) : campaignsMock
  return { stats, campaigns }
}

export type DonationIntentPayload = {
  campaign_id: string
  amount: number
  currency: string
  is_monthly: boolean
  donor_name?: string
  donor_email?: string
  message?: string
  website?: string
}

export async function submitDonationIntent(payload: DonationIntentPayload): Promise<{ id: number; received: boolean }> {
  const raw = await postJson<{ ok?: boolean; data?: { id?: number; received?: boolean } }>(
    apiUrl('/public/donations.php'),
    {
      campaign_id: payload.campaign_id,
      amount: payload.amount,
      currency: payload.currency,
      is_monthly: payload.is_monthly,
      donor_name: payload.donor_name ?? '',
      donor_email: payload.donor_email ?? '',
      message: payload.message ?? '',
      website: payload.website ?? '',
    },
  )
  const data = extractEnvelopeData<{ id?: number; received?: boolean }>(raw) ?? {}
  const id = Number(data.id ?? 0)
  if (!Number.isFinite(id) || id <= 0) {
    throw new ApiError('Invalid donation response', 500, raw)
  }
  return { id, received: Boolean(data.received) }
}
