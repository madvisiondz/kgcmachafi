import { ApiError, apiUrl, postJson } from './http'
import { extractEnvelopeData } from './envelope'

export type ContactPayload = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  company?: string
}

export async function submitContactMessage(payload: ContactPayload): Promise<{ id: number; received: boolean }> {
  const raw = await postJson<{ ok?: boolean; data?: { id?: number; received?: boolean } }>(apiUrl('/public/contact.php'), {
    name: payload.name,
    email: payload.email,
    phone: payload.phone ?? '',
    subject: payload.subject,
    message: payload.message,
    company: payload.company ?? '',
  })
  const data = extractEnvelopeData<{ id?: number; received?: boolean }>(raw) ?? {}
  const id = Number(data.id ?? 0)
  if (!Number.isFinite(id) || id <= 0) {
    throw new ApiError('Invalid contact response', 500, raw)
  }
  return { id, received: Boolean(data.received) }
}
