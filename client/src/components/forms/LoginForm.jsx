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
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? 'Hide' : 'Show'}
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
