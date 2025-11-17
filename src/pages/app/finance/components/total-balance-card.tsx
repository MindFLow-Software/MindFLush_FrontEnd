import { DollarSign } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const TotalBalanceCard = () => {
    
    const displayValue = "R$ 0,00"
    const description = "Total disponível"

    return (
        <Card className={cn(
            "relative overflow-hidden",
            "rounded-2xl",
            "border border-border border-b-[3px]",
            "shadow-sm shadow-black/8",
        )}>
            <div
                className={cn(
                    "absolute -top-16 -right-16",
                    "w-48 h-48",
                    "rounded-full",
                    "bg-linear-to-br from-blue-400/30 to-blue-700/30 dark:from-blue-400/70 dark:to-blue-700/70",
                    "blur-3xl opacity-60",
                    "pointer-events-none"
                )}
            />

            <div className="relative z-1 p-4 flex flex-col h-full justify-between"> 
                
                <div className="flex items-start justify-between mb-4">
                    
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/40 p-2.5">
                        <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                {/* 2. VALOR E DESCRIÇÃO */}
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