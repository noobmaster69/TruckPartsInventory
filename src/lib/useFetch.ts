import { useCallback, useEffect, useState } from 'react'
import { apiGet } from '../api/client'

// Small GET hook with loading/error/refetch. Pass null to skip fetching.
export function useFetch<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    if (path == null) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    apiGet<T>(path)
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false))
  }, [path])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch, setData }
}
