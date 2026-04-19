import React from 'react'

const SkeletonCard = () => {
    return (
        <div className="animate-pulse rounded-3xl border border-black/10 bg-white/90 p-4 shadow-[0_16px_50px_-32px_rgba(0,0,0,0.6)] dark:border-white/15 dark:bg-zinc-950/85">
            <div className="grid grid-cols-5 gap-4 items-center">
                <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-xl bg-zinc-300 dark:bg-zinc-700"></div>
                </div>

                <div className="col-span-3 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-zinc-300 dark:bg-zinc-700"></div>
                    <div className="h-3 w-1/2 rounded bg-zinc-300 dark:bg-zinc-700"></div>
                </div>

                <div className="flex justify-end gap-2">
                    <div className="h-8 w-8 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                    <div className="h-8 w-8 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonCard