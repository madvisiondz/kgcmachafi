import type { ConsultationDoctor, ConsultationSpecialty } from '../data/consultations'
import { consultationDoctorsMock, consultationSpecialtiesMock } from '../data/consultations'
import { ApiError, apiUrl, getJson, postJson } from './http'
import { extractEnvelopeData } from './envelope'

type ConsultationsGetResponse = {
  specialties?: Record<string, unknown>[]
  doctors?: Record<string, unknown>[]
}

function padWilaya(raw: unknown): string {
  const t = String(raw ?? '').trim()
  if (/^\d{1,2}$/.test(t)) return t.padStart(2, '0')
  return t
}

export function mapPhpSpecialtyRow(row: Record<string, unknown>): ConsultationSpecialty {
  const nm = String(row.name ?? '').trim()
  return {
    id: String(row.id ?? ''),
    key: String(row.specialty_key ?? row.key ?? 'general'),
    iconEmoji: String(row.icon_emoji ?? '🩺'),
    colorClass: String(row.color_class ?? 'from-emerald-500 to-green-600'),
    apiName: nm || undefined,
  }
}

export function mapPhpDoctorRow(row: Record<string, unknown>): ConsultationDoctor {
  const wilayaCode = padWilaya(row.wilaya_id)
  const specLbl = String(row.specialty_name ?? '').trim()
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? '').trim() || '—',
    specialtyKey: String(row.specialty_key ?? 'general'),
    specialtyLabel: specLbl || undefined,
    wilayaCode,
    communeId: String(row.commune_id ?? '').trim() || '',
    clinicName: String(row.clinic_name ?? '').trim() || String(row.hospital ?? '').trim() || undefined,
    experienceYears: Math.max(0, Number(row.experience_years ?? 0) || 0),
    rating: Math.min(5, Math.max(0, Number(row.rating ?? 0) || 0)),
    price: Math.max(0, Number(row.price ?? 0) || 0),
    currency: String(row.currency ?? 'DZD').trim() || 'DZD',
    phone: String(row.phone ?? '').trim(),
    supportsRemote: Boolean(Number(row.supports_remote ?? 0)),
    supportsInPerson: Boolean(Number(row.supports_in_person ?? 0)),
    isVerified: Boolean(Number(row.is_verified ?? 0)),
    isActive: Boolean(Number(row.is_active ?? 1)),
  }
}

export type ConsultationsBundle = {
  specialties: ConsultationSpecialty[]
  doctors: ConsultationDoctor[]
}

export async function loadConsultationsBundle(lang: string): Promise<ConsultationsBundle> {
  if (import.meta.env.VITE_CONSULTATIONS_API !== 'true') {
    return { specialties: consultationSpecialtiesMock, doctors: consultationDoctorsMock }
  }
  const l = ['ar', 'fr', 'en'].includes(lang) ? lang : 'ar'
  const raw = await getJson<unknown>(apiUrl(`/public/consultations.php?lang=${encodeURIComponent(l)}`))
  const data = extractEnvelopeData<ConsultationsGetResponse>(raw) ?? (raw as ConsultationsGetResponse)
  const specRows = Array.isArray(data.specialties) ? data.specialties : []
  const docRows = Array.isArray(data.doctors) ? data.doctors : []
  return {
    specialties: specRows.length ? specRows.map((r) => mapPhpSpecialtyRow(r as Record<string, unknown>)) : consultationSpecialtiesMock,
    doctors: docRows.length ? docRows.map((r) => mapPhpDoctorRow(r as Record<string, unknown>)) : consultationDoctorsMock,
  }
}

export type ConsultationBookingPayload = {
  doctor_id: number
  patient_name: string
  patient_phone: string
  preferred_date?: string
  notes?: string
  fax?: string
}

export async function submitConsultationBooking(payload: ConsultationBookingPayload): Promise<{ id: number; received: boolean }> {
  const body = {
    doctor_id: payload.doctor_id,
    patient_name: payload.patient_name,
    patient_phone: payload.patient_phone,
    preferred_date: payload.preferred_date ?? '',
    notes: payload.notes ?? '',
    fax: payload.fax ?? '',
  }
  const raw = await postJson<{ ok?: boolean; data?: { id?: number; received?: boolean } }>(
    apiUrl('/public/consultations.php'),
    body,
  )
  const data = extractEnvelopeData<{ id?: number; received?: boolean }>(raw) ?? {}
  const id = Number(data.id ?? 0)
  if (!Number.isFinite(id) || id <= 0) {
    throw new ApiError('Invalid booking response', 500, raw)
  }
  return { id, received: Boolean(data.received) }
}
