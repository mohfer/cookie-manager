import { cn } from '../../lib/utils'

const Card = ({ className, ...props }) => (
    <div
        className={cn('rounded-2xl border border-black/10 bg-white/90 shadow-[0_16px_50px_-32px_rgba(0,0,0,0.6)] backdrop-blur dark:border-white/15 dark:bg-zinc-950/85', className)}
        {...props}
    />
)

const CardHeader = ({ className, ...props }) => <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />

const CardTitle = ({ className, ...props }) => <h3 className={cn('text-lg font-semibold tracking-tight text-black dark:text-white', className)} {...props} />

const CardDescription = ({ className, ...props }) => <p className={cn('text-sm text-zinc-600 dark:text-zinc-400', className)} {...props} />

const CardContent = ({ className, ...props }) => <div className={cn('p-6 pt-0', className)} {...props} />

const CardFooter = ({ className, ...props }) => <div className={cn('flex items-center p-6 pt-0', className)} {...props} />

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
