"use client"

import { useState, useEffect } from "react"
import { format, addSeconds, startOfDay } from "date-fns"
import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface SessionTimerProps {
    isActive: boolean
}

export function SessionTimer({ isActive }: SessionTimerProps) {
    const [seconds, setSeconds] = useState(0)
    const totalSecondsGoal = 3600 // 60 min

    useEffect(() => {
        let intervalId: number | undefined
        if (isActive) {
            intervalId = window.setInterval(() => setSeconds((prev) => prev + 1), 1000)
        } else {
            setSeconds(0)
        }
        return () => {
            if (intervalId) window.clearInterval(intervalId)
        }
    }, [isActive])

    const formatTime = (total: number) => {
        const helperDate = addSeconds(startOfDay(new Date()), total)
        return format(helperDate, "mm:ss")
    }

    const radius = 85
    const circumference = 2 * Math.PI * radius
    const progress = Math.min(seconds / totalSecondsGoal, 1)
    const strokeDashoffset = circumference - progress * circumference

    if (!isActive) return null

    return (
        <Card className="w-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card rounded-xl p-8 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 relative overflow-hidden">

            <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
                <div className="flex justify-between w-full items-center px-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                            <Clock size={14} />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sessão Ativa</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full border border-border/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-foreground/70 tabular-nums">Realtime: {format(new Date(), "HH:mm")}</span>
                    </div>
                </div>

                <div className="relative flex items-center justify-center">
                    <svg className="transform -rotate-90 w-64 h-64 sm:w-72 sm:h-72" viewBox="0 0 200 200">
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-muted/20"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            stroke="var(--primary)"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={circumference}
                            style={{
                                strokeDashoffset,
                                transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-6xl font-black text-foreground tracking-tighter tabular-nums leading-none">
                            {formatTime(seconds)}
                        </span>
                        <div className="flex flex-col items-center mt-3 gap-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Duração Alvo</span>
                            <div className="px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold tabular-nums">
                                60:00 min
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full space-y-3 px-4">
                    <div className="flex justify-between items-end text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                            <span className="text-primary">{Math.floor(progress * 100)}%</span> Concluído
                        </span>
                        <span>{Math.floor((totalSecondsGoal - seconds) / 60)} min restantes</span>
                    </div>
                    <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden border border-border/20">
                        <div
                            className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}