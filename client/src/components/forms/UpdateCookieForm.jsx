import { useState, useEffect } from 'react'
import LoadingSpinner from '../ui/LoadingSpinner'

const UpdateCookieForm = ({ onSubmit, loading = false, onCancel, initialData = {} }) => {
    const [form, setForm] = useState({
        name: initialData.name || '',
        domain: initialData.domain || '',
        value: initialData.value || ''
    })
    const [error, setError] = useState(null)

    useEffect(() => {
        let valueString = ''
        if (initialData.value) {
            if (Array.isArray(initialData.value) || typeof initialData.value === 'object') {
                valueString = JSON.stringify(initialData.value, null, 2)
            } else {
                valueString = initialData.value
            }
        }

        setForm({
            name: initialData.name || '',
            domain: initialData.domain || '',
            value: valueString
        })
    }, [initialData])

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
        } catch (err) {
            setError(err.message || 'Failed to update cookie')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="update-name" className="text-sm font-medium text-gray-900 dark:text-white">
                    Cookie Name
                </label>
                <input
                    id="update-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    placeholder="session_id"
                    className="w-full h-11 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:bg-zinc-950 dark:border-gray-700 dark:text-white dark:focus:ring-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="update-domain" className="text-sm font-medium text-gray-900 dark:text-white">
                    Domain
                </label>
                <input
                    id="update-domain"
                    name="domain"
                    type="text"
                    value={form.domain}
                    onChange={onChange}
                    placeholder="example.com"
                    className="w-full h-11 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:bg-zinc-950 dark:border-gray-700 dark:text-white dark:focus:ring-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="update-value" className="text-sm font-medium text-gray-900 dark:text-white">
                    Cookie Value (JSON Array or String)
                </label>
                <textarea
                    id="update-value"
                    name="value"
                    value={form.value}
                    onChange={onChange}
                    placeholder='[{"name":"auth_token","value":"abc123","domain":".x.com"}] or simple string'
                    rows={8}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:bg-zinc-950 dark:border-gray-700 dark:text-white dark:focus:ring-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors resize-none font-mono"
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
                    {loading ? 'Updating...' : 'Update Cookie'}
                </button>
            </div>
        </form>
    )
}

export default UpdateCookieForm