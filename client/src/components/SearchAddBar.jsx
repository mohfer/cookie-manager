import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

const SearchAddBar = ({ onAddClick, searchValue, onSearchChange }) => {
    return (
        <div className="mx-auto mt-6 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-black/10 bg-white/75 p-3 backdrop-blur-sm dark:border-white/15 dark:bg-zinc-950/70 sm:flex-row sm:items-center sm:gap-4">
                <Input
                    type="text"
                    placeholder="Search cookies..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-10 rounded-full"
                />

                <Button
                    onClick={onAddClick}
                    className="h-10 w-full rounded-full sm:w-auto"
                >
                    <Plus className="size-4" />
                    Add Cookie
                </Button>
            </div>
        </div>
    )
}

export default SearchAddBar