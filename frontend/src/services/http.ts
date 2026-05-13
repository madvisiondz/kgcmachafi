import { appConfig } from '../config'

/** Normalized API base without trailing slash (e.g. `/api` or `https://host/api`). */
export function apiOriginBase(): string {
  return appConfig.apiBaseUrl.replace(/\/$/, '')
}

/** Join API base with a path starting with `/` (e.g. `/public/news.php`). */
export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${apiOriginBase()}${p}`
}

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export type GetJsonOptions = RequestInit & {
  /** Abort request after this many milliseconds (default 12_000). */
  timeoutMs?: number
}

/**
 * Typed JSON GET with timeout. Legacy PHP endpoints may return a bare object
 * (not `{ ok, data }`); callers should accept both shapes until envelopes unify.
 */
export async function getJson<T>(input: string, init?: GetJsonOptions): Promise<T> {
  const { timeoutMs = 12_000, ...rest } = init ?? {}
  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), timeoutMs)

  try {
    const res = await fetch(input, {
      ...rest,
      method: 'GET',
      signal: ctrl.signal,
      headers: {
        Accept: 'application/json',
        ...(rest.headers as Record<string, string> | undefined),
      },
    })

    const text = await res.text()
    let parsed: unknown = null
    if (text) {
      try {
        parsed = JSON.parse(text) as unknown
      } catch {
        throw new ApiError('Response was not valid JSON', res.status, text)
      }
    }

    if (!res.ok) {
      throw new ApiError(`HTTP ${res.status}`, res.status, parsed)
    }

    return parsed as T
  } finally {
    window.clearTimeout(timer)
  }
}
