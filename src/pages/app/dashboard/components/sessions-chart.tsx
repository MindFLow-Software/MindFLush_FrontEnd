"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { Info, CalendarDays, CalendarOff, RefreshCcw, AlertCircle } from "lucide-react"
import { getDailySessionsMetrics } from "@/api/get-daily-sessions-metrics"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
    count: {
        label: "Sessões",
        color: "var(--primary)",
    },
} satisfies ChartConfig

interface SessionsBarChartProps {
    startDate?: Date
    endDate?: Date
}

export function SessionsBarChart({ startDate: propStartDate, endDate: propEndDate }: SessionsBarChartProps) {
    const dateRange = useMemo(() => {
        const end = propEndDate ? endOfDay(propEndDate) : endOfDay(new Date())
        const start = propStartDate ? startOfDay(propStartDate) : startOfDay(subDays(end, 7))

        return { startDate: start, endDate: end }
    }, [propStartDate, propEndDate])

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["daily-sessions-bar", dateRange.startDate.toISOString(), dateRange.endDate.toISOString()],
        queryFn: () => getDailySessionsMetrics(dateRange.startDate.toISOString(), dateRange.endDate.toISOString()),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    })

    const chartData = useMemo(() => data || [], [data])

    const isEmpty = useMemo(() => {
        return chartData.length === 0 || chartData.every(d => d.count === 0)
    }, [chartData])

    const yAxisMax = useMemo(() => {
        const max = Math.max(...chartData.map(d => d.count), 0)
        return max < 5 ? 5 : Math.ceil(max * 1.2)
    }, [chartData])

    return (
        <Card className="col-span-6 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card rounded-xl overflow-hidden transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between px-7 pt-7 pb-4">
                <div className="flex items-center gap-4">
                    {/* Container do ícone Soft UI */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                        <CalendarDays className="size-5" />
                    </div>
                    <div className="flex flex-col">
                        <CardTitle className="text-sm font-bold tracking-tight text-foreground/90 uppercase">
                            Sessões Realizadas
                        </CardTitle>
                        <CardDescription className="text-[11px] font-medium text-muted-foreground/80">
                            Volume diário de atendimentos concluídos
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-5 pb-7">
                {isLoading ? (
                    <div className="flex items-end gap-3 h-[220px] w-full px-2">
                        {[...Array(7)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="w-full bg-muted/40 rounded-t-lg"
                                style={{ height: `${20 + Math.random() * 60}%` }}
                            />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex h-[220px] flex-col items-center justify-center rounded-xl bg-destructive/5 text-destructive gap-2 border border-destructive/10">
                        <AlertCircle className="size-5" />
                        <span className="text-xs font-semibold text-center">Erro ao carregar métricas de sessões</span>
                        <button
                            onClick={() => refetch()}
                            className="text-[10px] uppercase font-bold text-primary flex items-center gap-1 hover:underline mt-1"
                        >
                            <RefreshCcw size={10} /> Tentar novamente
                        </button>
                    </div>
                ) : isEmpty ? (
                   <div className="flex h-[220px] flex-col items-center justify-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <CalendarOff className="h-6 w-6 opacity-50" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="font-medium">Nenhuma sessão encontrada</p>
                            <p className="text-sm text-muted-foreground">Não houveram atendimentos concluídos neste período.</p>
                        </div>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-[220px] w-full">
                        <BarChart data={chartData} margin={{ top: 10, left: -25, right: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.6} />

                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={15}
                                fontSize={10}
                                fontWeight={700}
                                className="fill-muted-foreground/70 uppercase"
                                tickFormatter={(value) => format(new Date(value), "dd MMM", { locale: ptBR })}
                            />

                            <YAxis
                                domain={[0, yAxisMax]}
                                tickLine={false}
                                axisLine={false}
                                fontSize={10}
                                fontWeight={700}
                                className="fill-muted-foreground/70"
                                allowDecimals={false}
                            />

                            <ChartTooltip
                                cursor={{ fill: 'var(--primary)', opacity: 0.04 }}
                                content={
                                    <ChartTooltipContent
                                        className="border-none shadow-2xl bg-card/95 backdrop-blur-sm rounded-lg"
                                        labelFormatter={(value) => format(new Date(value), "dd 'de' MMMM", { locale: ptBR })}
                                    />
                                }
                            />

                            <Bar
                                dataKey="count"
                                fill="url(#sessionsGradient)"
                                radius={[6, 6, 2, 2]}
                                barSize={24}
                                animationDuration={1000}
                            />
                        </BarChart>
                    </ChartContainer>
                )}

                {/* Rodapé Padronizado conforme o Dashboard UI */}
                <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-5 px-2">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Produtividade Mensal
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground/50">
                        <Info size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                            Dados baseados no período selecionado
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}