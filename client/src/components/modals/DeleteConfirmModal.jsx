import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

const DeleteConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    loading = false, 
    cookieName = '',
    title = 'Delete Cookie',
    message = null,
    confirmText = 'Delete'
}) => {
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

    const defaultMessage = (
        <>
            Are you sure you want to delete <span className="font-medium text-black dark:text-white">"{cookieName}"</span>? This action cannot be undone.
        </>
    )

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <Card className="mx-auto w-full max-w-sm rounded-3xl">
                <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                            <AlertTriangle className="size-6" />
                        </div>
                    </div>

                    <div className="mb-6 text-center">
                        <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
                            {title}
                        </h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {message || defaultMessage}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            variant="outline"
                            className="h-11 flex-1 rounded-2xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className="h-11 flex-1 rounded-2xl"
                        >
                            {loading && <LoadingSpinner size="sm" />}
                            {loading ? `${confirmText}ing...` : confirmText}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DeleteConfirmModal