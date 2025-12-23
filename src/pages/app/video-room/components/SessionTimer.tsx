"use client"

import { useState, useEffect } from "react"
import { format, addSeconds, startOfDay } from "date-fns"

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
        return () => { if (intervalId) window.clearInterval(intervalId) }
    }, [isActive])

    const formatTime = (total: number) => {
        const helperDate = addSeconds(startOfDay(new Date()), total)
        return format(helperDate, "mm : ss")
    }

    // Cálculos SVG
    const radius = 70
    const circumference = 2 * Math.PI * radius
    const progress = Math.min(seconds / totalSecondsGoal, 1)
    const strokeDashoffset = circumference - progress * circumference

    if (!isActive) return null

    return (
        <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]  border border-slate-50 w-full max-w-[280px] animate-in slide-in-from-top-4 duration-500">

            {/* Header Info */}
            <div className="flex justify-between w-full items-center px-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Horário </span>
                <span className="text-xs font-semibold text-slate-500 tabular-nums">{format(new Date(), "HH:mm")}</span>
            </div>

            {/* Progress Circle */}
            <div className="relative flex items-center justify-center">
                <svg className="transform -rotate-90 w-44 h-44">
                    <circle cx="88" cy="88" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-50" />
                    <circle
                        cx="88" cy="88" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
                        strokeLinecap="round" className="text-indigo-600"
                    />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-slate-800 tracking-tighter tabular-nums">
                        {formatTime(seconds)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">60 min</span>
                </div>
            </div>
        </div>
    )
}
