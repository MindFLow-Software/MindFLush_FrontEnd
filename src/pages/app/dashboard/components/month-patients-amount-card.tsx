"use client"

import { useMemo } from "react"
import { Goal, TrendingUp, TrendingDown, AlertCircle, RefreshCcw, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { getMonthlySessionsCount } from "@/api/get-monthly-sessions-count"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

interface MonthPatientsAmountCardProps {
    startDate: Date | undefined
    endDate: Date | undefined
}

export function MonthPatientsAmountCard({ startDate, endDate }: MonthPatientsAmountCardProps) {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [
            "month-sessions-count",
            startDate?.toISOString(),
            endDate?.toISOString()
        ],
        queryFn: () => getMonthlySessionsCount({
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString()
        }),
        staleTime: 1000 * 60 * 5,
    })

    const total = data?.count ?? null

    const trend = useMemo(() => {
        if (total === null) return null
        const diff = 0.12 // Simulação de backend
        const isPositive = diff >= 0

        return {
            value: Math.abs(diff * 100).toFixed(1),
            isPositive,
            label: isPositive ? "+" : "-",
            icon: isPositive ? TrendingUp : TrendingDown,
            style: isPositive
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400"
        }
    }, [total])

    return (
        <Card
            className={cn(
                "relative overflow-hidden",
                "rounded-xl border bg-card shadow-sm",
                "p-6 transition-all duration-300 hover:shadow-md",
                "border-l-4 border-l-purple-500 dark:border-l-purple-600"
            )}
        >
            {/* Marca d'água sutil adaptada para Dark Mode */}
            <img
                src="/goal.svg"
                alt="Mascote"
                className={cn(
                    "absolute -bottom-9 -right-3",
                    "w-32 h-auto opacity-[2] dark:opacity-[0.55]",
                    "pointer-events-none select-none rotate-12 dark:brightness-150",
                )}
            />

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-purple-500/10 dark:bg-purple-500/20 p-2 border border-purple-500/20 dark:border-purple-500/30">
                            <Goal className="size-4 text-purple-700 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Sessões do Mês
                        </span>
                    </div>

                    {!isLoading && !isError && trend && (
                        <Badge variant="outline" className={cn("h-6 px-2 text-[11px] font-bold gap-1 transition-all", trend.style)}>
                            <trend.icon className="size-3" />
                            {trend.label}{trend.value}%
                        </Badge>
                    )}
                </div>

                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-start gap-2 py-1">
                        <div className="flex items-center gap-2 text-red-500">
                            <AlertCircle className="size-4" />
                            <span className="text-sm font-medium">Erro ao carregar</span>
                        </div>
                        <button onClick={() => refetch()} className="group flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                            <RefreshCcw className="size-3 transition-transform group-hover:rotate-180 duration-500" />
                            Tentar novamente
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tracking-tighter text-foreground tabular-nums">
                                {total?.toLocaleString("pt-BR") ?? "0"}
                            </span>
                        </div>

                        <div className="flex flex-col mt-1">
                            <p className="text-sm font-medium text-foreground/80 dark:text-foreground/70">
                                Total de atendimentos
                            </p>

                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Info className="size-3 text-muted-foreground/60" />
                                <p className="text-[11px] text-muted-foreground font-medium">
                                    Dados baseados nos últimos 30 dias
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}