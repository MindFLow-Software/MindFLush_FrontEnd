"use client"

import { TrendingUp, TrendingDown, Users, AlertCircle, Info } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { subDays } from "date-fns"
import { useMemo } from "react"
import { getAmountPatientsChart } from "@/api/get-amount-patients-chart"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface PatientsCountCardProps {
    startDate?: Date
    endDate?: Date
}

export const PatientsCountCard = ({ startDate: propStartDate, endDate: propEndDate }: PatientsCountCardProps) => {
    const endDate = propEndDate || new Date()
    const startDate = propStartDate || subDays(endDate, 30)

    const {
        data: chartData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["dashboard", "patients-count-summary", startDate.toISOString(), endDate.toISOString()],
        queryFn: () => getAmountPatientsChart({ startDate, endDate }),
    })

    const { totalPatients, formattedDiff, diffSign, diffStyle, TrendIcon } = useMemo(() => {
        if (!chartData?.length) {
            return {
                totalPatients: 0,
                formattedDiff: 0,
                diffSign: "",
                diffStyle: "bg-muted text-muted-foreground border-transparent",
                TrendIcon: TrendingUp,
            }
        }

        const total = chartData.reduce((sum, item) => sum + item.newPatients, 0)

        // Mock de lógica de diferença (substituir pela lógica real se disponível)
        const diff = 0.15
        const formatted = Math.abs(diff * 100)
        const isPositive = diff >= 0

        return {
            totalPatients: total,
            formattedDiff: formatted,
            diffSign: isPositive ? "+" : "-",
            TrendIcon: isPositive ? TrendingUp : TrendingDown,
            diffStyle: isPositive
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400",
        }
    }, [chartData])

    return (
        <div
            className={cn(
                "relative overflow-hidden",
                "rounded-xl border bg-card shadow-sm",
                "p-6 transition-all duration-300 hover:shadow-md",
                "border-l-4 border-l-emerald-500"
            )}
        >
            <img
                src="/brain.png"
                alt="Mascote cérebro"
                className={cn(
                    "absolute -bottom-10 -right-10",
                    "w-48 h-auto opacity-[2] dark:opacity-[0.55]",
                    "pointer-events-none select-none rotate-12"
                )}
            />

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-emerald-500/10 p-2 border border-emerald-500/20">
                            <Users className="size-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Pacientes
                        </span>
                    </div>

                    {!isLoading && !isError && totalPatients > 0 && (
                        <Badge variant="outline" className={cn("h-6 px-2 text-[11px] font-bold gap-1 transition-colors", diffStyle)}>
                            <TrendIcon className="size-3" />
                            {diffSign}{formattedDiff.toFixed(1)}%
                        </Badge>
                    )}
                </div>

                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                ) : isError ? (
                    <div className="flex items-center gap-2 text-red-500">
                        <AlertCircle className="size-4" />
                        <span className="text-sm font-medium">Erro nos dados</span>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tracking-tighter text-foreground tabular-nums">
                                {totalPatients.toLocaleString("pt-BR")}
                            </span>
                        </div>

                        <div className="flex flex-col mt-1">
                            <p className="text-sm font-medium text-foreground/80">
                                Novos pacientes registrados
                            </p>

                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Info className="size-3 text-muted-foreground/60" />
                                <p className="text-[11px] text-muted-foreground font-medium">
                                    {totalPatients === 0
                                        ? "Nenhuma atividade no período"
                                        : "Dados baseados nos últimos 30 dias"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}