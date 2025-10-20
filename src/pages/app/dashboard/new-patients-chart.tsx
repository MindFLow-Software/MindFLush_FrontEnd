'use client'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
    { date: '2024-05-01', newPatients: 3 },
    { date: '2024-05-02', newPatients: 5 },
    { date: '2024-05-03', newPatients: 4 },
    { date: '2024-05-04', newPatients: 7 },
    { date: '2024-05-05', newPatients: 2 },
    { date: '2024-05-06', newPatients: 6 },
    { date: '2024-05-07', newPatients: 8 },
    { date: '2024-05-08', newPatients: 4 },
    { date: '2024-05-09', newPatients: 5 },
    { date: '2024-05-10', newPatients: 9 },
    { date: '2024-04-01', newPatients: 6 },
    { date: '2024-04-02', newPatients: 10 },
    { date: '2024-04-03', newPatients: 8 },
    { date: '2024-04-04', newPatients: 14 },
    { date: '2024-04-04', newPatients: 4 },
    { date: '2024-04-06', newPatients: 12 },
    { date: '2024-04-07', newPatients: 16 },
    { date: '2024-04-08', newPatients: 8 },
    { date: '2024-04-09', newPatients: 10 },
    { date: '2024-04-10', newPatients: 18 },
    { date: '2024-03-01', newPatients: 6 },
    { date: '2024-03-02', newPatients: 10 },
    { date: '2024-03-03', newPatients: 8 },
    { date: '2024-03-03', newPatients: 14 },
    { date: '2024-03-03', newPatients: 4 },
    { date: '2024-03-06', newPatients: 12 },
    { date: '2024-03-07', newPatients: 16 },
    { date: '2024-03-08', newPatients: 8 },
    { date: '2024-03-09', newPatients: 10 },
    { date: '2024-03-10', newPatients: 18 },
]

const chartConfig = {
    newPatients: {
        label: 'Novos Pacientes',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig

export function NewPatientsChart() {


    return (
        <Card className="col-span-6 py-4 sm:py-0">
            <CardHeader className="flex-row items-center justify-between pb-8 mt-5">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium">
                        Crescimento de Pacientes
                    </CardTitle>
                    <CardDescription>
                        Quantidade de novos pacientes no período
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short',
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[140px]"
                                    nameKey="newPatients"
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })
                                    }
                                />
                            }
                        />
                        <Line
                            dataKey="newPatients"
                            type="monotone"
                            stroke="#0ea5e9"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />

                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
