import { useNavigate } from 'react-router-dom'
import { ArrowRight, Cookie, Download, Globe, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '../components/ui/card'

const highlights = [
    {
        title: 'Browser Extension',
        description: 'Save and load cookies directly from Chrome. Works in normal and incognito mode.',
        icon: Globe,
    },
    {
        title: 'Encrypted Storage',
        description: 'Cookie values are encrypted at rest using AES-256. Your data stays secure.',
        icon: ShieldCheck,
    },
    {
        title: 'One-Click Import',
        description: 'Inject saved cookies into any site with a single click. No manual copy-paste.',
        icon: Cookie,
    },
]

const Home = () => {
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate('/login')
    }

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = '/downloads/cookie-manager-extension.zip'
        link.download = 'cookie-manager-extension.zip'
        link.click()
    }

    return (
        <div className='relative flex min-h-screen items-center px-4 py-20'>
            <div className='mx-auto w-full max-w-6xl'>
                <div className='mx-auto max-w-3xl text-center'>
                    <p className='inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600 dark:border-white/20 dark:bg-zinc-950/70 dark:text-zinc-400'>
                        Cookie Workspace
                    </p>
                    <h1 className='mt-6 text-4xl font-extrabold tracking-tight text-black sm:text-6xl dark:text-white'>
                        Cookie Manager
                    </h1>
                    <p className='mx-auto mt-5 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400'>
                        Monochrome, fast, and focused. Manage browser cookies without distractions using a clean modern interface.
                    </p>

                    <div className='mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row'>
                        <Button
                            onClick={handleDownload}
                            variant='outline'
                            size='lg'
                            className='w-full rounded-full sm:w-auto'
                        >
                            <Download className='size-4' />
                            Download Extension
                        </Button>
                        <Button
                            onClick={handleLogin}
                            size='lg'
                            className='w-full rounded-full sm:w-auto'
                        >
                            Login
                            <ArrowRight className='size-4' />
                        </Button>
                    </div>
                </div>

                <div className='mt-14 grid gap-4 md:grid-cols-3 md:gap-6'>
                    {highlights.map((item) => {
                        const Icon = item.icon
                        return (
                            <Card key={item.title} className='rounded-3xl'>
                                <CardContent className='flex flex-col items-center p-7 text-center'>
                                    <div className='mb-4 flex size-14 items-center justify-center rounded-2xl border border-black/10 bg-black text-white dark:border-white/20 dark:bg-white dark:text-black'>
                                        <Icon className='size-6' />
                                    </div>
                                    <CardTitle>{item.title}</CardTitle>
                                    <CardDescription className='mt-2 leading-relaxed'>{item.description}</CardDescription>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Home
