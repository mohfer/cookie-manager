import { useState } from 'react'
import { forgotPasswordApi } from '../../api/auth'
import LoadingSpinner from '../ui/LoadingSpinner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Link } from 'react-router-dom'

const ForgotPasswordForm = () => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [sent, setSent] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!email.trim()) {
            setError('Email is required')
            return
        }

        setError(null)
        setLoading(true)

        try {
            await forgotPasswordApi(email)
            setSent(true)
        } catch (err) {
            setError(err.message || 'Failed to send reset link')
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="text-center space-y-4">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <p className="text-sm text-zinc-400">
                    If an account with that email exists, we've sent a password reset link.
                </p>
                <Link to="/login" className="inline-block text-sm font-medium text-white hover:underline">
                    Back to Login
                </Link>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="h-11 rounded-2xl" />
            </div>
            {error && <p className="text-sm text-zinc-700 dark:text-zinc-300">{error}</p>}
            <Button type="submit" disabled={loading} className="h-11 w-full rounded-2xl">
                {loading && <LoadingSpinner size="sm" />}
                {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                <Link to="/login" className="font-medium text-black hover:underline dark:text-white">Back to Login</Link>
            </p>
        </form>
    )
}

export default ForgotPasswordForm
