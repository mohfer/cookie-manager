import { cn } from '../../lib/utils'

const Textarea = ({ className, ...props }) => {
    return (
        <textarea
            className={cn('flex min-h-[96px] w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm text-black shadow-sm transition-colors outline-none placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-black/35 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:ring-white/40', className)}
            {...props}
        />
    )
}

export { Textarea }
