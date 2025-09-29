import React from 'react'

const SkeletonCard = () => {
    return (
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-4 animate-pulse">
            <div className="grid grid-cols-5 gap-4 items-center">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                </div>

                <div className="col-span-3 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>

                <div className="flex justify-end gap-2">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonCard