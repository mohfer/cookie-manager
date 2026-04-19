import { cn } from '../../lib/utils'

const Label = ({ className, ...props }) => {
    return <label className={cn('text-sm font-medium text-black dark:text-white', className)} {...props} />
}

export { Label }
