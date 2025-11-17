import { Tag } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const DiscountValueCard = () => {
    // Dados estáticos para simulação
    const displayValue = "R$ 0,00"
    const description = "Valor em descontos concedidos"

    return (
        <Card className={cn(
            "relative overflow-hidden",
            "rounded-2xl",
            "border border-border border-b-[3px]",
            "shadow-sm shadow-black/8",
        )}>
            {/* Efeito Aurora (Tema Rosa/Rose para Valor/Benefício) */}
            <div
                className={cn(
                    "absolute -top-16 -right-16",
                    "w-48 h-48",
                    "rounded-full",
                    // Gradiente Rose: 30% light, 70% dark
                    "bg-linear-to-br from-rose-400/30 to-rose-700/30 dark:from-rose-400/70 dark:to-rose-700/70",
                    "blur-3xl opacity-60",
                    "pointer-events-none"
                )}
            />

            {/* Conteúdo Principal com Padding Compacto (p-4) */}
            <div className="relative z-1 p-4 flex flex-col h-full justify-between"> 
                
                {/* 1. ROW DE ÍCONE (TOPO ESQUERDO) */}
                <div className="flex items-start mb-4">
                    {/* ÍCONE (Tag - Representa o desconto/promoção) */}
                    <div className="rounded-lg bg-rose-100 dark:bg-rose-950/40 p-2.5">
                        <Tag className="w-5 h-5 text-rose-600 dark:text-rose-400" />
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