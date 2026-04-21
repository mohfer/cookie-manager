import { apiFetch } from './client'

export const loginApi = async (login, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ login, password }),
    })

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Login failed')
    }

    const data = await res.json()
    return data.data
}

export const registerApi = async ({ email, password, password_confirmation }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password, password_confirmation }),
    })

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Registration failed')
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

export const forgotPasswordApi = async (email) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
    })

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Failed to send reset link')
    }

    return true
}

export const resetPasswordApi = async ({ email, token, password, password_confirmation }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ email, token, password, password_confirmation }),
    })

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Password reset failed')
    }

    return true
}

export const updateProfileApi = async (data) => {
    const res = await apiFetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    })
    const result = await res.json()
    return result.data
}
