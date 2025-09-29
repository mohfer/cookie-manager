import LoginForm from "../forms/LoginForm"

const LoginCard = () => {
    return (
        <div className="mx-auto w-full max-w-sm">
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