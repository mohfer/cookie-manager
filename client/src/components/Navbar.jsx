import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ProfileModal from './modals/ProfileModal'

const Navbar = () => {
    const { user, fetchUser, logout } = useAuth()
    const [dropdown, setDropdown] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    const initial = (user?.username || user?.email || '?').charAt(0).toUpperCase()

    return (
        <>
            <nav className="fixed top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur-xl dark:border-white/15 dark:bg-zinc-950/75">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link to="/" className="text-lg font-semibold tracking-tight text-black dark:text-white">
                            Cookie Manager
                        </Link>

                        <div className="relative">
                            <button
                                onClick={() => setDropdown(!dropdown)}
                                className="flex size-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white transition hover:opacity-80 dark:bg-white dark:text-black"
                            >
                                {initial}
                            </button>

                            {dropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setDropdown(false)} />
                                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-white/10 bg-[#09090b] p-1.5 shadow-xl">
                                        <div className="px-3 py-2">
                                            <p className="truncate text-sm font-semibold text-white">{user?.username || 'user'}</p>
                                            <p className="truncate text-xs text-zinc-500">{user?.email}</p>
                                        </div>
                                        <div className="my-1 border-t border-white/10" />
                                        <button
                                            onClick={() => { setDropdown(false); setShowProfile(true) }}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                            </svg>
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => { setDropdown(false); logout() }}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-red-400"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {showProfile && (
                <ProfileModal
                    user={user}
                    onClose={() => setShowProfile(false)}
                    onUpdated={(updated) => fetchUser()}
                />
            )}
        </>
    )
}

export default Navbar
