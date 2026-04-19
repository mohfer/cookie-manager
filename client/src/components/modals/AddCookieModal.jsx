import { useEffect } from 'react'
import { X } from 'lucide-react'
import AddCookieForm from '../forms/AddCookieForm'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const AddCookieModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <Card className="mx-auto w-full max-w-md rounded-3xl">
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-xl">Add New Cookie</CardTitle>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                    >
                        <X className="size-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <AddCookieForm
                        onSubmit={onSubmit}
                        loading={loading}
                        onCancel={onClose}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default AddCookieModal