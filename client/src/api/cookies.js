const API_URL = import.meta.env.VITE_API_URL

const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken')
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

export const getCookiesApi = async () => {
    const res = await fetch(`${API_URL}/api/cookies`, {
        method: 'GET',
        headers: getAuthHeaders(),
    })

    if (!res.ok) {
        if (res.status === 401) {
            localStorage.removeItem('authToken')
            throw new Error('Authentication required')
        }
        const errData = await res.json()
        throw new Error(errData.message || 'Failed to fetch cookies')
    }

    const data = await res.json()
    return data.data
}

export const createCookieApi = async (cookieData) => {
    const requestData = {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(cookieData),
    }

    const res = await fetch(`${API_URL}/api/cookies`, requestData)

    if (!res.ok) {
        if (res.status === 401) {
            localStorage.removeItem('authToken')
            throw new Error('Authentication required')
        }
        const errData = await res.json()
        throw new Error(errData.message || 'Failed to create cookie')
    }

    const data = await res.json()
    return data.data
}

export const updateCookieApi = async (id, cookieData) => {
    const res = await fetch(`${API_URL}/api/cookies/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(cookieData),
    })

    if (!res.ok) {
        if (res.status === 401) {
            localStorage.removeItem('authToken')
            throw new Error('Authentication required')
        }
        const errData = await res.json()
        throw new Error(errData.message || 'Failed to update cookie')
    }

    const data = await res.json()
    return data.data
}

export const deleteCookieApi = async (id) => {
    const res = await fetch(`${API_URL}/api/cookies/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    })

    if (!res.ok) {
        if (res.status === 401) {
            localStorage.removeItem('authToken')
            throw new Error('Authentication required')
        }
        const errData = await res.json()
        throw new Error(errData.message || 'Failed to delete cookie')
    }

    return true
}

export const getCookieApi = async (id) => {
    const res = await fetch(`${API_URL}/api/cookies/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    })

    if (!res.ok) {
        if (res.status === 401) {
            localStorage.removeItem('authToken')
            throw new Error('Authentication required')
        }
        const errData = await res.json()
        throw new Error(errData.message || 'Failed to fetch cookie')
    }

    const data = await res.json()
    return data.data
}
