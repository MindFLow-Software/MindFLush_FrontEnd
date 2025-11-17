import { RotateCw } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const CompletedTransactionsCard = () => {
  // Dados estáticos para simulação
  const displayValue = "0"
  const description = "Transações completas"

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "rounded-2xl",
      "border border-border border-b-[3px]",
      "shadow-sm shadow-black/8",
    )}>
      {/* Efeito Aurora (Tema Neutro/Slate) */}
      <div
        className={cn(
          "absolute -top-16 -right-16",
          "w-48 h-48",
          "rounded-full",
          "bg-linear-to-br from-slate-400/30 to-slate-700/30 dark:from-slate-400/70 dark:to-slate-700/70",
          "blur-3xl opacity-60",
          "pointer-events-none"
        )}
      />

      {/* Conteúdo Principal com Padding Compacto (p-4) */}
      <div className="relative z-1 p-4 flex flex-col h-full justify-between">

        {/* 1. ROW DE ÍCONE (TOPO ESQUERDO) */}
        <div className="flex items-start mb-4">
          {/* ÍCONE DE STATUS (RotateCw - Implica ciclo completo) */}
          <div className="rounded-lg bg-slate-100 dark:bg-slate-950/40 p-2.5">
            <RotateCw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
        </div>

        {/* 2. VALOR E DESCRIÇÃO (CONTENT) */}
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-extrabold tracking-tight">
            {displayValue}
          </span>
          <p className="text-sm text-muted-foreground font-medium">
            {description}
          </p>
        </div>
      </div>
    </Card>
  )
}