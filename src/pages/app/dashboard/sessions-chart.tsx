import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

const data = [
    { date: '10/12', sessions: 5 },
    { date: '11/12', sessions: 8 },
    { date: '12/12', sessions: 6 },
    { date: '13/12', sessions: 9 },
    { date: '14/12', sessions: 12 },
    { date: '15/12', sessions: 7 },
    { date: '16/12', sessions: 4 },
]

export function SessionsChart() {
    return (
        <Card className="col-span-6">
            <CardHeader className="flex-row items-center justify-between pb-8">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium">
                        Sessões realizadas
                    </CardTitle>
                    <CardDescription>
                        Quantidade de atendimentos concluídos no período
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={data} style={{ fontSize: 12 }}>
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            dy={16}
                        />
                        <YAxis
                            stroke="#888"
                            axisLine={false}
                            tickLine={false}
                            width={30}
                        />
                        <CartesianGrid vertical={false} className="stroke-muted" />
                        <Line
                            stroke={colors.violet[500]}
                            type="monotone"
                            strokeWidth={3}
                            dataKey="sessions"
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
