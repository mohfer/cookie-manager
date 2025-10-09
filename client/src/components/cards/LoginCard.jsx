import { useNavigate } from "react-router-dom"
import LoginForm from "../forms/LoginForm"

const LoginCard = () => {
    const navigate = useNavigate()

    return (
        <div className="mx-auto w-full max-w-sm">
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
            >
                <svg
                    className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to Home
            </button>

            <div className="rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-zinc-950">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Login</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Use your account to login
                        </p>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default LoginCard