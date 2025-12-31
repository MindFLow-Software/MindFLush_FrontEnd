"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, subDays } from "date-fns"
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

import { Info, BarChart3, CircleX } from "lucide-react"
import { getAmountPatientsChart } from "@/api/get-amount-patients-chart"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
    newPatients: {
        label: "Pacientes",
        color: "var(--primary)",
    },
} satisfies ChartConfig

export function NewPatientsBarChart({ startDate: propStartDate, endDate: propEndDate }: { startDate?: Date, endDate?: Date }) {
    const { startDate, endDate } = useMemo(() => {
        const end = propEndDate || new Date()
        const start = propStartDate || subDays(end, 7)
        return { startDate: start, endDate: end }
    }, [propStartDate, propEndDate])

    const { data, isLoading, isError } = useQuery({
        queryKey: ["new-patients-bar", startDate.toISOString(), endDate.toISOString()],
        queryFn: () => getAmountPatientsChart({ startDate, endDate }),
        retry: 1,
    })

    const chartData = useMemo(() => data || [], [data])
    const maxPatients = useMemo(() => Math.max(...chartData.map(d => d.newPatients), 0), [chartData])
    const yAxisMax = useMemo(() => Math.max(5, maxPatients + 1), [maxPatients])

    return (
        <Card className="col-span-6 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card rounded-xl overflow-hidden transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between px-7 pt-7 pb-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                        <BarChart3 className="size-5" />
                    </div>
                    <div className="flex flex-col">
                        <CardTitle className="text-sm font-bold tracking-tight text-foreground/90 uppercase">
                            Novos Pacientes
                        </CardTitle>
                        <CardDescription className="text-[11px] font-medium text-muted-foreground/80">
                            Fluxo diário de cadastros
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
                        <Info className="size-5" />
                        <span className="text-xs font-semibold">Erro ao carregar métricas</span>
                    </div>
                ) : chartData.length === 0 || chartData.every(d => d.newPatients === 0) ? (
                    <div className="flex h-[220px] flex-col items-center justify-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <CircleX className="h-6 w-6 opacity-50" />
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
                                <linearGradient id="newPatientsGradient" x1="0" y1="0" x2="0" y2="1">
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
                                dataKey="newPatients"
                                fill="url(#newPatientsGradient)"
                                radius={[6, 6, 2, 2]}
                                barSize={24}
                            />
                        </BarChart>
                    </ChartContainer>
                )}

                <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-5 px-2">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Fluxo de Entrada
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground/50">
                        <Info size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                            Período Selecionado
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}