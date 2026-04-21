import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerApi } from '../../api/auth'
import LoadingSpinner from '../ui/LoadingSpinner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const RegisterForm = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ email: '', password: '', password_confirmation: '' })
    const [error, setError] = useState(null)

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()

        if (!form.email.trim() || !form.password.trim()) {
            setError('All fields are required')
            return
        }

        if (form.password !== form.password_confirmation) {
            setError('Passwords do not match')
            return
        }

        setError(null)
        setLoading(true)

        try {
            const data = await registerApi(form)
            localStorage.setItem('authToken', data.token)
            navigate('/dashboard')
        } catch (err) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="john@example.com" className="h-11 rounded-2xl" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={onChange} placeholder="••••••••" className="h-11 rounded-2xl pr-12" />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white" aria-label="Toggle password">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {showPassword ? (
                                <>
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                </>
                            ) : (
                                <>
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input id="password_confirmation" name="password_confirmation" type="password" value={form.password_confirmation} onChange={onChange} placeholder="••••••••" className="h-11 rounded-2xl" />
            </div>
            {error && <p className="text-sm text-zinc-700 dark:text-zinc-300">{error}</p>}
            <Button type="submit" disabled={loading} className="h-11 w-full rounded-2xl">
                {loading && <LoadingSpinner size="sm" />}
                {loading ? 'Creating account...' : 'Register'}
            </Button>
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-black hover:underline dark:text-white">Login</Link>
            </p>
        </form>
    )
}

export default RegisterForm
