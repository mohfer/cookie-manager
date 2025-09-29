const API_URL = import.meta.env.VITE_API_URL

const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken')
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

export const loginApi = async (username, password) => {
    const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Login failed')
    }

    const data = await res.json()
    return data.data.token
}

export const logoutApi = async () => {
    const res = await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
    })

    if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Logout failed')
    }

    return true
}

