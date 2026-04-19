import { useState } from 'react'
import LoadingSpinner from '../ui/LoadingSpinner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

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
                <Label htmlFor="name">
                    Cookie Name
                </Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Canva"
                    className="h-11 rounded-2xl"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="domain">
                    Domain
                </Label>
                <Input
                    id="domain"
                    name="domain"
                    type="text"
                    value={form.domain}
                    onChange={onChange}
                    placeholder="canva.com"
                    className="h-11 rounded-2xl"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="value">
                    Cookie Value (JSON Array or String)
                </Label>
                <Textarea
                    id="value"
                    name="value"
                    value={form.value}
                    onChange={onChange}
                    placeholder='[{"name":"auth_token","value":"abc123","domain":".x.com"}] or simple string'
                    rows={6}
                    className="rounded-2xl resize-none"
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
                    {loading ? 'Adding...' : 'Add Cookie'}
                </Button>
            </div>
        </form>
    )
}

export default AddCookieForm