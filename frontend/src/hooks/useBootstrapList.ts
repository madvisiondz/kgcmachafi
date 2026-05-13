import { useCallback, useEffect, useRef, useState } from 'react'

export type BootstrapStatus = 'loading' | 'ready' | 'error'

export type UseBootstrapListResult<T> = {
  status: BootstrapStatus
  data: T | null
  error: Error | null
  reload: () => void
}

/**
 * Runs an async loader on mount (and when `reload()` is called). Optional
 * `VITE_LIST_BOOTSTRAP_MS` delays resolution so skeleton states can be reviewed in dev.
 */
export function useBootstrapList<T>(loader: () => Promise<T>): UseBootstrapListResult<T> {
  const loaderRef = useRef(loader)

  useEffect(() => {
    loaderRef.current = loader
  }, [loader])

  const [tick, setTick] = useState(0)
  const [status, setStatus] = useState<BootstrapStatus>('loading')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const reload = useCallback(() => {
    setTick((n) => n + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    const delayMs = Number(import.meta.env.VITE_LIST_BOOTSTRAP_MS ?? 0) || 0

    async function run() {
      setStatus('loading')
      setError(null)

      try {
        if (delayMs > 0) {
          await new Promise((r) => window.setTimeout(r, delayMs))
        }
        const result = await loaderRef.current()
        if (!cancelled) {
          setData(result)
          setStatus('ready')
        }
      } catch (e) {
        if (!cancelled) {
          setData(null)
          setError(e instanceof Error ? e : new Error(String(e)))
          setStatus('error')
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [tick])

  return { status, data, error, reload }
}
