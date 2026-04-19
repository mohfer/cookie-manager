import { useState, useEffect } from 'react'
import LoadingSpinner from '../ui/LoadingSpinner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

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
                <Label htmlFor="update-name">
                    Cookie Name
                </Label>
                <Input
                    id="update-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    placeholder="session_id"
                    className="h-11 rounded-2xl"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="update-domain">
                    Domain
                </Label>
                <Input
                    id="update-domain"
                    name="domain"
                    type="text"
                    value={form.domain}
                    onChange={onChange}
                    placeholder="example.com"
                    className="h-11 rounded-2xl"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="update-value">
                    Cookie Value (JSON Array or String)
                </Label>
                <Textarea
                    id="update-value"
                    name="value"
                    value={form.value}
                    onChange={onChange}
                    placeholder='[{"name":"auth_token","value":"abc123","domain":".x.com"}] or simple string'
                    rows={8}
                    className="resize-none rounded-2xl font-mono"
                />
            </div>

            {error && <p className="text-sm text-zinc-700 dark:text-zinc-300">{error}</p>}

            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="h-11 flex-1 rounded-2xl"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 flex-1 rounded-2xl"
                >
                    {loading && <LoadingSpinner size="sm" />}
                    {loading ? 'Updating...' : 'Update Cookie'}
                </Button>
            </div>
        </form>
    )
}

export default UpdateCookieForm