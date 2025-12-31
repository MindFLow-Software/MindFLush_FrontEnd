"use client"

import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { Loader2, AlertCircle, Cake, PieChart as PieChartIcon, Info } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/axios"

interface AgeStats {
    ageRange: string
    patients: number
}

async function getPatientsByAgeStats(params: { startDate?: string; endDate?: string }): Promise<AgeStats[]> {
    const response = await api.get<AgeStats[]>("/patients/stats/age", { params })
    return response.data
}

const CHART_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
]

function CustomTooltip({ active, payload, total }: any) {
    if (active && payload && payload.length && total > 0) {
        const data = payload[0]
        const percentage = ((data.value / total) * 100).toFixed(1)
        return (
            <div className="rounded-lg border-none bg-card/95 backdrop-blur-sm p-3 shadow-2xl">
                <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    {data.name}
                </p>
                <p className="text-sm font-bold text-foreground">
                    {data.value} pacientes <span className="text-primary ml-1">({percentage}%)</span>
                </p>
            </div>
        )
    }
    return null
}

interface PatientsByAgeChartProps {
    startDate: Date | undefined
    endDate: Date | undefined
}

export function PatientsByAgeChart({ startDate, endDate }: PatientsByAgeChartProps) {
    const startIso = startDate?.toISOString()
    const endIso = endDate?.toISOString()

    const { data, isLoading, isError, refetch } = useQuery<AgeStats[]>({
        queryKey: ['dashboard', 'age-stats', startIso, endIso],
        queryFn: () => getPatientsByAgeStats({ startDate: startIso, endDate: endIso }),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    })

    const totalPatients = useMemo(() => {
        return data ? data.reduce((sum, item) => sum + item.patients, 0) : 0
    }, [data])

    const isEmpty = useMemo(() => {
        return !data || data.length === 0 || totalPatients === 0
    }, [data, totalPatients])

    return (
        <Card className="col-span-1 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card rounded-xl overflow-hidden flex flex-col transition-all duration-500">
            <CardHeader className="px-7 pt-7 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                            <PieChartIcon className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <CardTitle className="text-sm font-bold tracking-tight text-foreground/90 uppercase">
                                Faixa Etária
                            </CardTitle>
                            <p className="text-[11px] font-medium text-muted-foreground/80">
                                Distribuição demográfica
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col px-7 pb-7">
                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-[300px]">
                        <div className="relative flex items-center justify-center">
                            <Skeleton className="h-40 w-40 rounded-full border-8 border-muted/20" />
                            <Loader2 className="absolute size-6 animate-spin text-muted-foreground/40" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ) : isError ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 min-h-[300px] rounded-xl bg-destructive/5 border border-destructive/10 text-destructive">
                        <AlertCircle className="size-5" />
                        <span className="text-xs font-semibold">Erro ao carregar dados</span>
                        <button onClick={() => refetch()} className="text-[10px] uppercase font-bold text-primary hover:underline">
                            Tentar novamente
                        </button>
                    </div>
                ) : isEmpty ? (
                    <div className="flex h-[220px] flex-col items-center justify-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Cake className="h-6 w-6 opacity-50" />
                        </div>
                        <div className="text-center space-y-1.5 px-6">
                            <p className="text-sm font-bold text-foreground/80">Sem dados de idade</p>
                            <p className="text-[11px] font-medium leading-relaxed max-w-[220px]">
                                Não há pacientes cadastrados no período selecionado.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 min-h-[260px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        nameKey="ageRange"
                                        dataKey="patients"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={95}
                                        innerRadius={75}
                                        strokeWidth={4}
                                        paddingAngle={4}
                                        className="outline-none"
                                        animationDuration={1200}
                                        animationEasing="ease-in-out"
                                    >
                                        {data?.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                className="stroke-card hover:opacity-80 transition-all duration-300 cursor-pointer outline-none"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip total={totalPatients} />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-6 border-t border-border/50 mt-auto">
                            {data?.map((item, index) => {
                                const percentage = ((item.patients / totalPatients) * 100).toFixed(1)
                                return (
                                    <div key={item.ageRange} className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-2.5">
                                            <div
                                                className="h-2 w-2 rounded-full shrink-0 shadow-sm"
                                                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                                            />
                                            <span className="text-[11px] font-bold uppercase tracking-tight whitespace-nowrap group-hover:text-foreground transition-colors">
                                                {item.ageRange}
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-bold tabular-nums">
                                            {percentage}%
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                <div className="mt-6 flex items-center gap-2 px-1">
                    <Info className="size-3" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Total de {totalPatients} pacientes registrados
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}