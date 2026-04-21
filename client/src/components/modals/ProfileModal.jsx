import { useState } from 'react'
import { updateProfileApi } from '../../api/auth'
import LoadingSpinner from '../ui/LoadingSpinner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const ProfileModal = ({ user, onClose, onUpdated }) => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [tab, setTab] = useState('email')
    const [form, setForm] = useState({
        email: user?.email || '',
        password: '',
        password_confirmation: '',
    })
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setLoading(true)

        try {
            let data = {}
            if (tab === 'email') {
                if (!form.email.trim()) {
                    setError('Email is required')
                    setLoading(false)
                    return
                }
                data = { email: form.email }
            } else {
                if (!form.password.trim()) {
                    setError('Password is required')
                    setLoading(false)
                    return
                }
                if (form.password !== form.password_confirmation) {
                    setError('Passwords do not match')
                    setLoading(false)
                    return
                }
                data = { password: form.password, password_confirmation: form.password_confirmation }
            }

            const updated = await updateProfileApi(data)
            setSuccess('Updated successfully')
            if (onUpdated) onUpdated(updated)
            if (tab === 'password') {
                setForm({ ...form, password: '', password_confirmation: '' })
            }
        } catch (err) {
            setError(err.message || 'Update failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#09090b] p-6" onClick={(e) => e.stopPropagation()}>
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Profile</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                {/* User info */}
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
                        {(user?.username || user?.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">{user?.username || 'user'}</p>
                        <p className="text-xs text-zinc-500">{user?.email}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-4 flex gap-1 rounded-xl bg-white/5 p-1">
                    <button
                        onClick={() => setTab('email')}
                        className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${tab === 'email' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Email
                    </button>
                    <button
                        onClick={() => setTab('password')}
                        className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${tab === 'password' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Password
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    {tab === 'email' ? (
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={form.email} onChange={onChange} className="h-10 rounded-xl" />
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={onChange} placeholder="••••••••" className="h-10 rounded-xl pr-10" />
                                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 hover:text-white">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                <Input id="password_confirmation" name="password_confirmation" type="password" value={form.password_confirmation} onChange={onChange} placeholder="••••••••" className="h-10 rounded-xl" />
                            </div>
                        </>
                    )}

                    {error && <p className="text-xs text-red-400">{error}</p>}
                    {success && <p className="text-xs text-green-400">{success}</p>}

                    <Button type="submit" disabled={loading} className="h-10 w-full rounded-xl">
                        {loading && <LoadingSpinner size="sm" />}
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ProfileModal
