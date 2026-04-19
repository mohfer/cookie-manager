import { apiFetch } from './client'

export const loginApi = async (username, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Login failed')
    }

    const data = await res.json()
    return data.data
}

export const logoutApi = async () => {
    await apiFetch('/api/logout', { method: 'POST' })
    return true
}

export const getUserApi = async () => {
    const res = await apiFetch('/api/user')
    const data = await res.json()
    return data.data
}
