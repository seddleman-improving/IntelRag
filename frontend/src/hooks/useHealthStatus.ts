import { useState, useEffect } from 'react'

export type HealthStatus = 'checking' | 'ok' | 'degraded' | 'unreachable'

export function useHealthStatus(intervalMs = 30_000) {
  const [status, setStatus] = useState<HealthStatus>('checking')

  async function check() {
    try {
      const res = await fetch('/api/v1/health', { signal: AbortSignal.timeout(4000) })
      if (!res.ok) { setStatus('degraded'); return }
      const data = await res.json()
      setStatus(data.llm === 'ok' ? 'ok' : 'degraded')
    } catch {
      setStatus('unreachable')
    }
  }

  useEffect(() => {
    check()
    const id = setInterval(check, intervalMs)
    return () => clearInterval(id)
  }, [])

  return status
}
