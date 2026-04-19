import { apiFetch } from './client'

export const getCookiesApi = async () => {
    const res = await apiFetch('/api/cookies')
    const data = await res.json()
    return data.data
}

export const getCookieApi = async (id) => {
    const res = await apiFetch(`/api/cookies/${id}`)
    const data = await res.json()
    return data.data
}

export const createCookieApi = async (cookieData) => {
    const res = await apiFetch('/api/cookies', {
        method: 'POST',
        body: JSON.stringify(cookieData),
    })
    const data = await res.json()
    return data.data
}

export const updateCookieApi = async (id, cookieData) => {
    const res = await apiFetch(`/api/cookies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cookieData),
    })
    const data = await res.json()
    return data.data
}

export const deleteCookieApi = async (id) => {
    await apiFetch(`/api/cookies/${id}`, { method: 'DELETE' })
    return true
}
