import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi, logoutApi, getUserApi } from '../api/auth'

export const useAuth = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)

    const isAuthenticated = !!sessionStorage.getItem('authToken')

    const fetchUser = useCallback(async () => {
        if (!isAuthenticated) return
        try {
            const data = await getUserApi()
            setUser(data)
        } catch {
            // Token invalid
        }
    }, [isAuthenticated])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const login = useCallback(async (login, password) => {
        setLoading(true)
        try {
            const data = await loginApi(login, password)
            sessionStorage.setItem('authToken', data.token)
            setUser(data.user)
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
            sessionStorage.removeItem('authToken')
            setUser(null)
            navigate('/login')
        }
    }, [navigate])

    return { isAuthenticated, loading, user, fetchUser, login, logout }
}
