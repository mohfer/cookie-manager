import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../ui/LoadingSpinner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const LoginForm = () => {
    const { login, loading } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState(null)

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()

        if (!form.username.trim() || !form.password.trim()) {
            setError('All fields are required')
            return
        }

        setError(null)

        try {
            await login(form.username, form.password)
        } catch (err) {
            setError(err.message || 'Login failed')
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="username">
                    Username
                </Label>
                <Input
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={onChange}
                    placeholder="johndoe"
                    className="h-11 rounded-2xl"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">
                    Password
                </Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={onChange}
                        placeholder="••••••••"
                        className="h-11 rounded-2xl pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-2xl"
            >
                {loading && <LoadingSpinner size="sm" />}
                {loading ? 'Logging in...' : 'Login'}
            </Button>
            {error && <p className="text-sm text-zinc-700 dark:text-zinc-300">{error}</p>}
        </form>
    )
}

export default LoginForm
