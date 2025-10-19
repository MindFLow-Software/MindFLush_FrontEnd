"use client"

import { BarChart } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import colors from "tailwindcss/colors"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dados adaptados para MindFlow
const data = [
    { category: "Cognitiva", sessions: 40 },
    { category: "Comportamental", sessions: 30 },
    { category: "de Casal", sessions: 50 },
    { category: "Sessões de Grupo", sessions: 16 },
    { category: "Atendimentos Online", sessions: 26 },
]

const COLORS = [colors.sky[400], colors.amber[400], colors.violet[400], colors.emerald[400], colors.rose[400]]

const totalSessions = data.reduce((sum, item) => sum + item.sessions, 0)

function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        const data = payload[0]
        const percentage = ((data.value / totalSessions) * 100).toFixed(1)

        return (
            <div className="rounded-lg border bg-background p-3 shadow-lg">
                <p className="font-medium text-sm mb-1">{data.name}</p>
                <p className="text-sm text-muted-foreground">
                    {data.value} sessões ({percentage}%)
                </p>
            </div>
        )
    }
    return null
}

export function PopularSessionsChart() {
    return (
        <Card className="col-span-4">
            <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Sessões populares</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart style={{ fontSize: 12 }}>
                        <Pie
                            data={data}
                            nameKey="category"
                            dataKey="sessions"
                            cx="50%"
                            cy="50%"
                            outerRadius={86}
                            innerRadius={64}
                            strokeWidth={8}
                            labelLine={false}
                            label={(props: any) => {
                                const cx = props.cx ?? 0
                                const cy = props.cy ?? 0
                                const midAngle = props.midAngle ?? 0
                                const innerRadius = props.innerRadius ?? 0
                                const outerRadius = props.outerRadius ?? 0
                                const value = props.value ?? 0

                                const RADIAN = Math.PI / 180
                                const radius = 12 + innerRadius + (outerRadius - innerRadius)
                                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                                const y = cy + radius * Math.sin(-midAngle * RADIAN)
                                const percentage = ((value / totalSessions) * 100).toFixed(0)

                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        className="fill-foreground text-xs font-medium"
                                        textAnchor={x > cx ? "start" : "end"}
                                        dominantBaseline="central"
                                    >
                                        {percentage}%
                                    </text>
                                )
                            }}
                            animationBegin={0}
                            animationDuration={800}
                            animationEasing="ease-out"
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index]}
                                    className="stroke-background hover:opacity-80 transition-opacity cursor-pointer"
                                    strokeWidth={8}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {data.map((item, index) => {
                        const percentage = ((item.sessions / totalSessions) * 100).toFixed(1)
                        return (
                            <div key={item.category} className="flex items-start gap-2">
                                <div className="mt-1 h-3 w-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[index] }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-foreground truncate">{item.category}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.sessions} ({percentage}%)
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
