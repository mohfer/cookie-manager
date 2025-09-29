import { useState } from 'react'
import LoadingSpinner from '../ui/LoadingSpinner'

const AddCookieForm = ({ onSubmit, loading = false, onCancel }) => {
    const [form, setForm] = useState({ name: '', domain: '', value: '' })
    const [error, setError] = useState(null)

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!form.name.trim() || !form.domain.trim() || !form.value.trim()) {
            setError('All fields are required')
            return
        }

        try {
            let parsedValue
            try {
                parsedValue = JSON.parse(form.value)
            } catch {
                parsedValue = form.value
            }

            const submitData = {
                name: form.name,
                domain: form.domain,
                value: parsedValue
            }

            await onSubmit(submitData)
            setForm({ name: '', domain: '', value: '' })
        } catch (err) {
            setError(err.message || 'Failed to add cookie')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-white">
                    Cookie Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Canva"
                    className="w-full h-11 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:bg-zinc-950 dark:border-gray-700 dark:text-white dark:focus:ring-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="domain" className="text-sm font-medium text-gray-900 dark:text-white">
                    Domain
                </label>
                <input
                    id="domain"
                    name="domain"
                    type="text"
                    value={form.domain}
                    onChange={onChange}
                    placeholder="canva.com"
                    className="w-full h-11 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:bg-zinc-950 dark:border-gray-700 dark:text-white dark:focus:ring-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="value" className="text-sm font-medium text-gray-900 dark:text-white">
                    Cookie Value (JSON Array or String)
                </label>
                <textarea
                    id="value"
                    name="value"
                    value={form.value}
                    onChange={onChange}
                    placeholder='[{"name":"auth_token","value":"abc123","domain":".x.com"}] or simple string'
                    rows={6}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:bg-zinc-950 dark:border-gray-700 dark:text-white dark:focus:ring-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors resize-none"
                />
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 h-11 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-400 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-11 bg-zinc-950 text-white text-sm font-medium rounded-lg hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:focus:ring-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading && <LoadingSpinner size="sm" />}
                    {loading ? 'Adding...' : 'Add Cookie'}
                </button>
            </div>
        </form>
    )
}

export default AddCookieForm