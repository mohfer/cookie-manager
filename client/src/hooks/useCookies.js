import { useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getCookiesApi, createCookieApi, updateCookieApi, deleteCookieApi } from '../api/cookies'

export const useCookies = () => {
    const [cookies, setCookies] = useState([])
    const [fetchLoading, setFetchLoading] = useState(true)
    const [mutating, setMutating] = useState(false)

    const fetchCookies = useCallback(async () => {
        setFetchLoading(true)
        try {
            const data = await getCookiesApi()
            setCookies(data)
        } catch (error) {
            toast.error(error.message || 'Failed to fetch cookies')
        } finally {
            setFetchLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCookies()
    }, [fetchCookies])

    const addCookie = useCallback(async (cookieData) => {
        setMutating(true)
        try {
            const newCookie = await createCookieApi(cookieData)
            setCookies(prev => [...prev, newCookie])
            toast.success('Cookie added successfully!')
            return newCookie
        } catch (error) {
            toast.error(error.message || 'Failed to add cookie')
            throw error
        } finally {
            setMutating(false)
        }
    }, [])

    const updateCookie = useCallback(async (id, cookieData) => {
        setMutating(true)
        try {
            const updated = await updateCookieApi(id, cookieData)
            setCookies(prev => prev.map(c => (c.id === id ? updated : c)))
            toast.success('Cookie updated successfully!')
            return updated
        } catch (error) {
            toast.error(error.message || 'Failed to update cookie')
            throw error
        } finally {
            setMutating(false)
        }
    }, [])

    const deleteCookie = useCallback(async (id) => {
        setMutating(true)
        try {
            await deleteCookieApi(id)
            setCookies(prev => prev.filter(c => c.id !== id))
            toast.success('Cookie deleted successfully!')
        } catch (error) {
            toast.error(error.message || 'Failed to delete cookie')
        } finally {
            setMutating(false)
        }
    }, [])

    return { cookies, fetchLoading, mutating, addCookie, updateCookie, deleteCookie }
}