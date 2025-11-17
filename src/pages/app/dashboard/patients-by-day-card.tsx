import { Users2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { subDays } from "date-fns"

import { getAmountPatientsChart, type NewPatientsResponse } from "@/api/get-amount-patients-chart" 

interface PatientsCountCardProps {
    startDate: Date | undefined
    endDate: Date | undefined
}

export function PatientsCountCard({ startDate: propStartDate, endDate: propEndDate }: PatientsCountCardProps) {
    
    const endDate = propEndDate || new Date()
    const startDate = propStartDate || subDays(endDate, 30)

    const startIso = startDate.toISOString()
    const endIso = endDate.toISOString()

    const { data: chartData, isLoading, isError } = useQuery<NewPatientsResponse, Error, NewPatientsResponse, (string | undefined)[]>({
        queryKey: ['dashboard', 'patients-count-summary', startIso, endIso],
        queryFn: () => getAmountPatientsChart({
            startDate: startDate,
            endDate: endDate,
        }),
        enabled: !!startIso && !!endIso, 
    })

    const totalPatients = chartData ? chartData.reduce((sum, item) => sum + item.newPatients, 0) : 0
    
    const diffValue = 0.05 // Mock: 5% de aumento
    
    const formattedDiff = diffValue * 100
    const diffSign = formattedDiff >= 0 ? '+' : ''
    const diffColorClass = formattedDiff >= 0 
        ? 'text-emerald-500 dark:text-emerald-400' 
        : 'text-red-500 dark:text-red-400'

    const content = isLoading ? (
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
    ) : isError ? (
        <span className="text-red-500 text-sm">Erro ao carregar</span>
    ) : (
        <>
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
                {totalPatients.toLocaleString('pt-BR')}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
                <span className={diffColorClass}>{diffSign}{formattedDiff.toFixed(1)}%</span> em relação ao período passado
            </p>
        </>
    )

    return (
        <Card>
            <CardHeader className="pb-3 sm:pb-2">
                <CardTitle className="flex items-center justify-between text-sm sm:text-base font-semibold">
                    <span className="leading-tight">Novos Pacientes (Período)</span>
                    <Users2 className="size-4 sm:size-5 text-emerald-500 dark:text-emerald-400 shrink-0" /> 
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                {content}
            </CardContent>
        </Card>
    )
}