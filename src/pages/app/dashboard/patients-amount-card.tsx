import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HeartStraight } from '@phosphor-icons/react'

export function PatientsAmountCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          Total de Pacientes
          <HeartStraight className="size-5 text-orange-500 dar:text-teal-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">135</span>
        <p className="text-xs text-muted-foreground">
          <span className="text-emerald-500 dark:text-emerald-400">+8%</span> em
          relação ao mês anterior
        </p>
      </CardContent>
    </Card>
  )
}
