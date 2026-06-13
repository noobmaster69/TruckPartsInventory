// Thin fetch wrappers around the JSON API. All paths are relative to /api,
// which Vite proxies to the Express backend in dev.
const BASE = '/api'

async function handle<T>(res: Response, method: string, path: string): Promise<T> {
  if (!res.ok) {
    let detail = ''
    try {
      detail = JSON.stringify(await res.json())
    } catch {
      detail = res.statusText
    }
    throw new Error(`${method} ${path} failed: ${res.status} ${detail}`)
  }
  return (await res.json()) as T
}

export async function apiGet<T>(path: string): Promise<T> {
  return handle<T>(await fetch(`${BASE}${path}`), 'GET', path)
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return handle<T>(res, 'POST', path)
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return handle<T>(res, 'PUT', path)
}

export async function apiDelete<T>(path: string): Promise<T> {
  return handle<T>(await fetch(`${BASE}${path}`, { method: 'DELETE' }), 'DELETE', path)
}
