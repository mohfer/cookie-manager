import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '../../api/auth'
import LoadingSpinner from '../ui/LoadingSpinner'

const LoginForm = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ username: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        
        if (!form.username.trim() || !form.password.trim()) {
            setError('All fields are required')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const token = await loginApi(form.username, form.password)
            localStorage.setItem('authToken', token)
            navigate('/dashboard')
        } catch (err) {
            setError(err.message || "Login gagal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-900 dark:text-white">
                    Username
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={onChange}
                    placeholder="johndoe"
                    className="w-full h-11 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:bg-zinc-950 dark:border-gray-700 dark:text-white dark:focus:ring-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-white">
                    Password
                </label>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={onChange}
                        placeholder="••••••••"
                        className="w-full h-11 px-3 pr-12 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:bg-zinc-950 dark:border-gray-700 dark:text-white dark:focus:ring-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white focus:outline-none transition-colors"
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-zinc-950 text-white text-sm font-medium rounded-lg hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:focus:ring-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading && <LoadingSpinner size="sm" />}
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </form>
    )
}

export default LoginForm