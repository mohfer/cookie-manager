import React from 'react'

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

    return (
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
            <div className="grid grid-cols-5 gap-4 items-center">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                        {cookie && !imgError ? (
                            <img
                                src={`https://${cookie.domain}/favicon.ico`}
                                alt={`${cookie.websiteName} icon`}
                                className="w-8 h-8 object-contain"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                                {(cookie?.websiteName || cookie?.name)?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {cookie?.websiteName || cookie?.name || 'Unknown Website'}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                        {cookie?.domain || 'unknown.com'}
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleUpdate}
                        className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Update cookie"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Delete cookie"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CookieCard