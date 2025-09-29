import React, { useState } from 'react'

const LoginCard = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ username: '', password: '' })

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const onSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div className="mx-auto w-full max-w-sm">
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-zinc-950">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Login</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Use your account to login
                        </p>
                    </div>

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
                            className="w-full h-11 bg-zinc-950 text-white text-sm font-medium rounded-lg hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:focus:ring-white transition-colors"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginCard