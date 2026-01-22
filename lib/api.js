// API utility functions for calls

export async function apiFetch(path, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
  const url = new URL(path, baseUrl)

  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API Fetch Error:', error)
    throw error
  }
}

export async function apiGet(path, options) {
  return apiFetch(path, { ...options, method: 'GET' })
}

export async function apiPost(path, body, options) {
  return apiFetch(path, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })
}

export async function apiPut(path, body, options) {
  return apiFetch(path, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })
}

export async function apiDelete(path, options) {
  return apiFetch(path, { ...options, method: 'DELETE' })
}
