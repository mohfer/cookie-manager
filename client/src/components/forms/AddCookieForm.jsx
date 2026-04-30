import { useState } from 'react'
import LoadingSpinner from '../ui/LoadingSpinner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

const AddCookieForm = ({ onSubmit, loading = false, onCancel }) => {
    const [form, setForm] = useState({ name: '', domain: '', value: '' })
    const [error, setError] = useState(null)
    const [showConfirm, setShowConfirm] = useState(false)
    const [pendingSubmit, setPendingSubmit] = useState(null)

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!form.name.trim() || !form.domain.trim() || !form.value.trim()) {
            setError('All fields are required')
            return
        }

        // Parse JSON value
        let parsedValue
        try {
            parsedValue = JSON.parse(form.value)
        } catch {
            parsedValue = form.value
        }

        const submitData = {
            name: form.name,
            domain: form.domain,
            value: parsedValue,
            overwrite: false
        }

        // Submit to API
        try {
            await onSubmit(submitData)
            setForm({ name: '', domain: '', value: '' })
        } catch (err) {
            // Check if it's a duplicate error (422 validation error)
            if (err.response?.status === 422) {
                setPendingSubmit(submitData)
                setShowConfirm(true)
                return
            }
            setError(err.message || 'Failed to add cookie')
        }
    }

    const handleConfirmOverwrite = async () => {
        setShowConfirm(false)
        setError(null)
        
        try {
            const submitData = { ...pendingSubmit, overwrite: true }
            await onSubmit(submitData)
            setForm({ name: '', domain: '', value: '' })
            setPendingSubmit(null)
        } catch (err) {
            setError(err.message || 'Failed to overwrite cookie')
        }
    }

    const handleCancelOverwrite = () => {
        setShowConfirm(false)
        setPendingSubmit(null)
    }

    return (
        <>
            {showConfirm ? (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Cookie Already Exists</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            A cookie with the name &quot;{pendingSubmit?.name}&quot; already exists for domain &quot;{pendingSubmit?.domain}&quot;.
                            Do you want to overwrite it?
                        </p>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelOverwrite}
                            className="h-11 flex-1 rounded-2xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmOverwrite}
                            disabled={loading}
                            className="h-11 flex-1 rounded-2xl"
                        >
                            {loading && <LoadingSpinner size="sm" />}
                            {loading ? 'Overwriting...' : 'Overwrite'}
                        </Button>
                    </div>
                </div>
            ) : (
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
            )}
        </>
    )
}

export default AddCookieForm
