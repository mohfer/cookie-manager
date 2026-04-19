import React from 'react'
import toast from 'react-hot-toast'
import { Copy, Pencil, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

const CookieCard = ({ cookie, onUpdate, onDelete }) => {
    const [imgError, setImgError] = React.useState(false);

    const handleUpdate = () => {
        if (onUpdate) {
            onUpdate(cookie)
        }
    }

    const handleDelete = () => {
        if (onDelete) {
            onDelete(cookie)
        }
    }

    const handleCopyValue = async () => {
        try {
            const rawValue = cookie?.value
            const textValue = typeof rawValue === 'string'
                ? rawValue
                : JSON.stringify(rawValue ?? '', null, 2)

            await navigator.clipboard.writeText(textValue)
            toast.success('Cookie value copied')
        } catch {
            toast.error('Failed to copy cookie value')
        }
    }

    return (
        <Card className="rounded-3xl transition-transform duration-200 hover:-translate-y-0.5">
            <CardContent className="p-4">
                <div className="grid grid-cols-5 items-center gap-4">
                    <div className="flex justify-center">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/5 p-1 dark:border-white/20 dark:bg-white/10">
                            {cookie && !imgError ? (
                                <img
                                    src={`https://${cookie.domain}/favicon.ico`}
                                    alt={`${cookie.websiteName} icon`}
                                    className="h-full w-full rounded-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-black text-xs font-semibold text-white dark:bg-white dark:text-black">
                                    {(cookie?.websiteName || cookie?.name)?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-span-3">
                        <h3 className="truncate text-sm font-semibold text-black dark:text-white">
                            {cookie?.websiteName || cookie?.name || 'Unknown Website'}
                        </h3>
                        <p className="mt-1 truncate text-xs text-zinc-600 dark:text-zinc-400">
                            {cookie?.domain || 'unknown.com'}
                        </p>
                    </div>

                    <div className="flex justify-end gap-1.5 pl-2">
                        <Button
                            onClick={handleCopyValue}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full px-2"
                            title="Copy cookie value"
                        >
                            <Copy className="size-4" />
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full px-2"
                            title="Update cookie"
                        >
                            <Pencil className="size-4" />
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full px-2"
                            title="Delete cookie"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CookieCard