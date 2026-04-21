import { useNavigate } from "react-router-dom"
import { ArrowLeft } from 'lucide-react'
import ResetPasswordForm from "../components/forms/ResetPasswordForm"
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'

const ResetPassword = () => {
    const navigate = useNavigate()

    return (
        <div className='flex min-h-screen items-center justify-center px-4 py-16'>
            <div className="mx-auto w-full max-w-sm">
                <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="mb-4 rounded-full border-black/20 bg-white/80 px-3 text-black hover:bg-black/5 dark:border-white/20 dark:bg-zinc-950/70 dark:text-zinc-200 dark:hover:bg-white/10"
                >
                    <ArrowLeft className="size-4" />
                    Back to Login
                </Button>

                <Card className="rounded-3xl">
                    <CardHeader className="pb-4 text-center">
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>
                            Enter your new password below
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResetPasswordForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ResetPassword
