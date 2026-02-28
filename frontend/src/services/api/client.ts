const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message = data?.message ?? res.statusText ?? 'Request failed'
    throw new Error(message)
  }

  return data as T
}
