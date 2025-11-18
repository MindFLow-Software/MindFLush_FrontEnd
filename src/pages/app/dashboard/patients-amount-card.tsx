import { useMemo, useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { HeartHandshake } from 'lucide-react'
import { getAmountPatientsCard } from '@/api/get-amount-patients-card'
import { cn } from '@/lib/utils'

interface PatientData {
  total: number
}

const fetchPatientTotal = async (): Promise<PatientData> => {
  try {
    return await getAmountPatientsCard()
  } catch (error) {
    console.error('Erro ao buscar total de pacientes:', error)
    throw error
  }
}

export const PatientsAmountCard = () => {
  const [state, setState] = useState({
    total: null as number | null,
    isLoading: true,
    isError: false
  })

  useEffect(() => {
    fetchPatientTotal()
      .then(data =>
        setState({ total: data.total, isLoading: false, isError: false })
      )
      .catch(() =>
        setState(prev => ({ ...prev, isLoading: false, isError: true }))
      )
  }, [])

  const { displayValue, diffSign, formattedDiff, diffColorClass } = useMemo(() => {
    if (state.total === null) {
      return {
        displayValue: '—',
        diffSign: '',
        formattedDiff: 0,
        diffColorClass: 'text-red-600 dark:text-red-400'
      }
    }

    const displayValue = state.total
    const diff = 0.0
    const formattedDiff = diff * 100
    const diffSign = formattedDiff >= 0 ? '+' : ''
    const diffColorClass =
      formattedDiff >= 0
        ? 'text-red-600 dark:text-red-400'
        : 'text-red-600 dark:text-red-400'

    return { displayValue, diffSign, formattedDiff, diffColorClass }
  }, [state.total])

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60 border-b-[3px] border-b-red-700 dark:border-b-red-500",
        "shadow-md shadow-black/20 dark:shadow-black/8 bg-card transition-all p-4"
      )}
    >
      <div
        className={cn(
          "absolute -top-14 -right-14 w-40 h-40 rounded-full",
          "bg-gradient-to-r from-red-400/50 to-red-700/30 dark:from-red-400/70 dark:to-red-900",
          "blur-3xl opacity-60 pointer-events-none"
        )}
      />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="rounded-full bg-red-100/80 dark:bg-red-950/40 p-2 w-fit">
          <HeartHandshake className="size-5 text-red-700 dark:text-red-400" />
        </div>

        {state.isLoading ? (
          <div className="space-y-2">
            <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-3 w-36 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        ) : state.isError ? (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-red-500">Erro ao carregar</span>
            <span className="text-xs text-muted-foreground">Tente novamente</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <span className="text-2xl font-semibold tracking-tight leading-none">
              {displayValue.toLocaleString("pt-BR")}
            </span>

            <p className="text-[13px] text-muted-foreground font-medium leading-none">
              Total de Pacientes
            </p>

            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className={cn("font-semibold", diffColorClass)}>
                {diffSign}
                {formattedDiff.toFixed(1)}%
              </span>{" "}
              em relação ao mês anterior
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
