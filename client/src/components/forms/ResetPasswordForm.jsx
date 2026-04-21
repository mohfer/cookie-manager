import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { resetPasswordApi } from '../../api/auth'
import LoadingSpinner from '../ui/LoadingSpinner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ password: '', password_confirmation: '' })
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const email = searchParams.get('email') || ''
    const token = searchParams.get('token') || ''

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()

        if (!form.password.trim()) {
            setError('Password is required')
            return
        }

        if (form.password !== form.password_confirmation) {
            setError('Passwords do not match')
            return
        }

        if (!email || !token) {
            setError('Invalid reset link')
            return
        }

        setError(null)
        setLoading(true)

        try {
            await resetPasswordApi({ email, token, password: form.password, password_confirmation: form.password_confirmation })
            setSuccess(true)
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setError(err.message || 'Password reset failed')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <p className="text-sm text-zinc-400">Password reset successful! Redirecting to login...</p>
            </div>
        )
    }

    if (!email || !token) {
        return (
            <div className="text-center space-y-4">
                <p className="text-sm text-zinc-400">Invalid or missing reset link.</p>
                <Link to="/forgot-password" className="inline-block text-sm font-medium text-white hover:underline">
                    Request a new link
                </Link>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
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
                {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
        </form>
    )
}

export default ResetPasswordForm
