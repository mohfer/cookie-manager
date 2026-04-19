import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/40',
    {
        variants: {
            variant: {
                default: 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90',
                outline: 'border border-black/15 bg-white text-black hover:bg-black/5 dark:border-white/20 dark:bg-zinc-950 dark:text-white dark:hover:bg-white/10',
                ghost: 'text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10',
                destructive: 'bg-black text-white hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-lg px-3',
                lg: 'h-11 px-6',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

const Button = ({ className, variant, size, asChild = false, ...props }) => {
    const Comp = asChild ? Slot : 'button'

    return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button }
