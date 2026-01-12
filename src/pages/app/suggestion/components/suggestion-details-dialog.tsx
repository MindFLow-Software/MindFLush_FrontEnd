"use client"

import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { LayoutGrid, Lightbulb, Rocket, Microscope, PartyPopper } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { useHeaderStore } from "@/hooks/use-header-store"
import { getSuggestions } from "@/api/get-suggestions"
import { SuggestionColumn } from "./suggestion-column"

const BRAND_COLOR = "#27187E"

const COLUMN_CONFIG = [
    {
        title: "Sugestões",
        icon: Lightbulb,
        status: "PENDING",
        color: "bg-slate-50",
        dotColor: "bg-slate-500",
        iconColor: "text-slate-600",
    },
    {
        title: "Próximos Passos",
        icon: Rocket,
        status: "UNDER_REVIEW",
        color: "bg-emerald-50",
        dotColor: "bg-emerald-500",
        iconColor: "text-emerald-600",
    },
    {
        title: "Estudando",
        icon: Microscope,
        status: "REJECTED",
        color: "bg-blue-50",
        dotColor: "bg-blue-500",
        iconColor: "text-blue-600",
    },
    {
        title: "Tudo Pronto!",
        icon: PartyPopper,
        status: "IMPLEMENTED",
        color: "bg-yellow-50",
        dotColor: "bg-yellow-500",
        iconColor: "text-yellow-600",
    },
] as const

export function SuggestionBoardPage() {
    const { setTitle } = useHeaderStore()

    useEffect(() => {
        setTitle("Envios da Comunidade")
    }, [setTitle])

    const { data: suggestions, isLoading } = useQuery({
        queryKey: ["suggestions"],
        queryFn: () => getSuggestions({}),
    })

    const filterByStatus = (status: string) => suggestions?.filter((s) => s.status === status) || []

    return (
        <>
            <Helmet title="Envios da Comunidade" />

            <div className="flex flex-col gap-6 mt-4 h-[calc(100vh-160px)] overflow-hidden">
                <header
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 pl-5 py-3 shrink-0 rounded-r-lg bg-gradient-to-r from-transparent to-transparent hover:from-slate-50/50 transition-colors duration-300"
                    style={{ borderLeftColor: BRAND_COLOR }}
                    role="banner"
                >
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
                            <LayoutGrid className="size-7 shrink-0" style={{ color: BRAND_COLOR }} aria-hidden="true" />
                            <span>Sugestões da Comunidade</span>
                        </h1>
                        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                            Acompanhe o que está sendo planejado e vote nas melhores ideias.
                        </p>
                    </div>
                </header>

                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-4 h-full min-h-0 auto-cols-fr"
                    role="region"
                    aria-label="Colunas de sugestões organizadas por status"
                >
                    {COLUMN_CONFIG.map((column) => {
                        const Icon = column.icon
                        return (
                            <SuggestionColumn
                                key={column.status}
                                title={column.title}
                                icon={<Icon className={`size-5 ${column.iconColor}`} aria-hidden="true" />}
                                color={column.color}
                                dotColor={column.dotColor}
                                suggestions={filterByStatus(column.status)}
                                isLoading={isLoading}
                            />
                        )
                    })}
                </div>
            </div>
        </>
    )
}