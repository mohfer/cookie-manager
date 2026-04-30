const API_URL = import.meta.env.VITE_API_URL

export const apiFetch = async (path, options = {}) => {
    const token = sessionStorage.getItem('authToken')

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    }

    const res = await fetch(`${API_URL}${path}`, { ...options, headers })

    if (!res.ok) {
        if (res.status === 401) {
            sessionStorage.removeItem('authToken')
            throw new Error('Authentication required')
        }
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Request failed')
    }

    return res
}