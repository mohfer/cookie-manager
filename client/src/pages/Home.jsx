import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate('/login')
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4 py-12 md:py-8'>
            <div className='max-w-4xl mx-auto text-center'>
                <div className='space-y-6'>
                    <div className='mb-6 md:mb-8'>
                        <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4'>
                            Cookie Manager
                        </h1>
                        <div className='w-20 h-1 bg-zinc-950 dark:bg-white mx-auto rounded-full'></div>
                    </div>

                    <h2 className='text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200 mb-4 md:mb-6'>
                        Manage Your Cookies Easily
                    </h2>

                    <p className='text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6 md:mb-8'>
                        Take control of your browser cookies with our powerful extension.
                        Export, import, and manage cookies across different browsers effortlessly.
                    </p>

                    <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 md:mt-10'>
                        <button
                            disabled
                            className='w-full sm:w-auto px-8 py-3 text-base font-medium text-gray-400 bg-gray-300 rounded-lg cursor-not-allowed dark:bg-gray-700 dark:text-gray-500 shadow-lg opacity-60'
                        >
                            Download Extension (Coming Soon)
                        </button>

                        <button
                            onClick={handleLogin}
                            className='w-full sm:w-auto px-8 py-3 text-base font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-zinc-950 dark:text-white dark:border-gray-800 dark:hover:bg-zinc-900 dark:focus:ring-gray-400 transition-colors shadow-lg'
                        >
                            Login
                        </button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 md:mt-16'>
                        <div className='p-6 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-zinc-950 shadow-lg'>
                            <div className='text-3xl mb-3'>🍪</div>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                                Easy Management
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Manage all your cookies in one place with an intuitive interface
                            </p>
                        </div>

                        <div className='p-6 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-zinc-950 shadow-lg'>
                            <div className='text-3xl mb-3'>🔄</div>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                                Import & Export
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Seamlessly transfer cookies between browsers and devices
                            </p>
                        </div>

                        <div className='p-6 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-zinc-950 shadow-lg'>
                            <div className='text-3xl mb-3'>🔒</div>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                                Secure Storage
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Keep your cookies safe and organized in the cloud
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home