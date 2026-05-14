/** Unwrap `{ ok, data }` or legacy top-level shapes from PHP JSON. */

export function extractEnvelopeData<T>(raw: unknown): T | undefined {
  if (raw && typeof raw === 'object' && 'data' in raw) {
    return (raw as { data: T }).data
  }
  return undefined
}

export function extractListItems(raw: unknown): Record<string, unknown>[] {
  const d = extractEnvelopeData<{ items?: unknown[] }>(raw)
  if (d && Array.isArray(d.items)) return d.items as Record<string, unknown>[]
  const legacy = raw as { items?: unknown[] }
  if (Array.isArray(legacy.items)) return legacy.items as Record<string, unknown>[]
  return []
}
