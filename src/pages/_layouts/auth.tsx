import { BrainIcon } from '@phosphor-icons/react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
    return (
        <div className="grid min-h-screen grid-cols-2 antialiased">
            <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
                <div className="flex items-center gap-3 text-lg text-foreground">
                    <BrainIcon className="h-9 w-9 text-blue-600" />
                    <span className="font-semibold">MindFlush</span>
                </div>

                <div className="flex flex-1 items-center justify-center">
                    <img
                        src="logo.svg"
                        alt="Logo MindFlush"
                        className="w-100 h-auto opacity-90"
                    />
                </div>

                <footer className="text-sm text-center">
                    Painel central &copy; MindFlush - {new Date().getFullYear()}
                </footer>
            </div>

            <div className="flex flex-col items-center justify-center relative">
                <Outlet />
            </div>
        </div>
    )
}
