import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/button'

const Navbar = () => {
    const { logout } = useAuth()

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur-xl dark:border-white/15 dark:bg-zinc-950/75">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="text-lg font-semibold tracking-tight text-black dark:text-white">
                        Cookie Manager
                    </Link>

                    <Button
                        onClick={logout}
                        variant="outline"
                        className="rounded-full"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
