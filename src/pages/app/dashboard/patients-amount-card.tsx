'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HeartStraight } from '@phosphor-icons/react'
import { getAmountPatients } from '@/api/get-amount-patients'

export function PatientsAmountCard() {
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    async function fetchTotal() {
      try {
        const data = await getAmountPatients()
        setTotal(data?.total ?? 0)
      } catch (error) {
        console.error('Erro ao buscar total de pacientes:', error)
        setTotal(0)
      }
    }

    fetchTotal()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          Total de Pacientes
          <HeartStraight className="size-5 text-teal-500 dark:text-teal-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {total === null ? (
          <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        ) : (
          <span className="text-2xl font-bold tracking-tight">{total}</span>
        )}
        <p className="text-xs text-muted-foreground">
          <span className="text-emerald-500 dark:text-emerald-400">+8%</span> em
          relação ao mês anterior
        </p>
      </CardContent>
    </Card>
  )
}
