import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi, logoutApi } from '../api/auth'

const TOKEN_KEY = 'authToken'

export const useAuth = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const isAuthenticated = !!localStorage.getItem(TOKEN_KEY)

    const login = useCallback(async (username, password) => {
        setLoading(true)
        try {
            const data = await loginApi(username, password)
            localStorage.setItem(TOKEN_KEY, data.token)
            navigate('/dashboard')
            return data
        } finally {
            setLoading(false)
        }
    }, [navigate])

    const logout = useCallback(async () => {
        try {
            await logoutApi()
        } catch {
            // Logout API may fail if token is already invalid
        } finally {
            localStorage.removeItem(TOKEN_KEY)
            navigate('/login')
        }
    }, [navigate])

    return { isAuthenticated, loading, login, logout }
}
