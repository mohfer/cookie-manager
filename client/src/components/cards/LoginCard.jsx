import { useNavigate } from "react-router-dom"
import { ArrowLeft } from 'lucide-react'
import LoginForm from "../forms/LoginForm"
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'

const LoginCard = () => {
    const navigate = useNavigate()

    return (
        <div className="mx-auto w-full max-w-sm">
            <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="mb-4 rounded-full border-black/20 bg-white/80 px-3 text-black hover:bg-black/5 dark:border-white/20 dark:bg-zinc-950/70 dark:text-zinc-200 dark:hover:bg-white/10"
            >
                <ArrowLeft className="size-4" />
                Back to Home
            </Button>

            <Card className="rounded-3xl">
                <CardHeader className="pb-4 text-center">
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Use your account to login
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginCard